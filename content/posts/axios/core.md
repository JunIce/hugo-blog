---
title: "axios core源码"
date: 2023-03-11T10:18:32+08:00
tags: ["axios"]
categories: ["axios"]
draft: false
---



# axios 核心源码



> v1.3.4



`lib/core/Axios.js`



## Class Axios



### constructor构造函数



```js
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  // ....
  
}
```



axios在构造函数里面包括2个熟悉

- 默认配置
- 拦截器函数，包括request拦截器和response拦截器



### request方法



request方法是axios中非常重要的函数，所有请求都是从这个地方走的



#### 构造合并配置

```js
 if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);
```



通过mergeConfig方法把axios请求的配置进行合并



#### 构造headers

```js
// Set config.method
config.method = (config.method || this.defaults.method || 'get').toLowerCase();

let contextHeaders;

// Flatten headers
contextHeaders = headers && utils.merge(
  headers.common,
  headers[config.method]
);

contextHeaders && utils.forEach(
  ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
  (method) => {
    delete headers[method];
  }
);

config.headers = AxiosHeaders.concat(contextHeaders, headers);
```



合并出headers的配置



#### 拦截器

```js
const requestInterceptorChain = [];
let synchronousRequestInterceptors = true;
// 请求拦截器
this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
  if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
    return;
  }

  synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

  requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
});

const responseInterceptorChain = [];
// 请返回拦截器
this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
  responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
});
```



`requestInterceptorChain`

用于搜集请求拦截器函数，从前往后插入数组



> [fulfilled,rejected,fulfilled,rejected,fulfilled,rejected, .......]



`responseInterceptorChain`

用于搜集返回结果的函数

> [fulfilled,rejected,fulfilled,rejected,fulfilled,rejected, .......]



区别就是从后面插入数组的



这里分2中情况，一种是同步的请求拦截器，另一种是异步的请求拦截器



#### 异步的请求拦截器

```js
let promise;
let i = 0;
let len;

if (!synchronousRequestInterceptors) {
  const chain = [dispatchRequest.bind(this), undefined];
  chain.unshift.apply(chain, requestInterceptorChain);
  chain.push.apply(chain, responseInterceptorChain);
  
	// ....
}
```



先构造出一个数组，包括2个元素

> [dispatchRequest.bind(this), undefined]



这里给了第二个元素为undefined,保证数组的结构是

> [fulfilled,rejected,fulfilled,rejected,fulfilled,rejected, .......]



把request拦截器插到数组的顶部

response 拦截器插到数组的尾部



```js
len = chain.length;

promise = Promise.resolve(config);

while (i < len) {
  promise = promise.then(chain[i++], chain[i++]);
}

```



最后构造出一个Promise

把数组的元素依次放入到promise的fulfilled、rejected函数



#### 同步request拦截器



```js
len = requestInterceptorChain.length;

let newConfig = config;

i = 0;

while (i < len) {
  const onFulfilled = requestInterceptorChain[i++];
  const onRejected = requestInterceptorChain[i++];
  try {
    newConfig = onFulfilled(newConfig);
  } catch (error) {
    onRejected.call(this, error);
    break;
  }
}

try {
  promise = dispatchRequest.call(this, newConfig);
} catch (error) {
  return Promise.reject(error);
}

i = 0;
len = responseInterceptorChain.length;

while (i < len) {
  promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
}
```



- 先执行request拦截器数组
- 执行请求主体函数
- 执行response拦截器数组



## InterceptorManager



拦截器管理器



一个基础类，包含一个`handler`熟悉和多个方法



- use: 增加拦截器函数，push到`handlers`数组中
- eject: 删除指定下标的拦截器
- clear: 清空拦截器
- forEach： 递归执行拦截器中的每个函数



### 完整代码

```js
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
```



## dispatchRequest

`dispatchRequest`是代码中实现请求发送的主体函数，其面在看拦截器执行的部分也看到了， 在那部分可以推测出这个函数返回的是一个`Promise`对象



#### 请求头headers部分的处理



处理headers和请求数据data



```js
config.headers = AxiosHeaders.from(config.headers);

  // Transform request data
config.data = transformData.call(
  config,
  config.transformRequest
);

if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
  config.headers.setContentType('application/x-www-form-urlencoded', false);
}
```



#### 请求adapters

```js
const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
```

这里adapter可以是用户自定义，否则就是使用系统的适配器



#### 返回promise函数



可以看到`adapter`在执行后返回的是一个`Promise`对象，也就是在adapter执行中实现的请求发送， 也就是浏览器环境下的`XMLHttpRequest`请求



```js
return adapter(config).then(function onAdapterResolution(response) {
    //...
  // resolve
  }, function onAdapterRejection(reason) {
    // ....
    // reject
  });
```



### 完整代码

```js
export default function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

```





## adapters

axios平时都是用在浏览器环境下的，但可以是用在node环境下的，

这里就需要区分出不同的平台，看下怎么实现的



>  lib/adapters/adapters.js



通过分别读取adapters数组中的字符，可取值为`['xhr', 'http']`



默认xhr在前，也就是默认适配的是浏览器环境



```js
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
}

adapters = utils.isArray(adapters) ? adapters : [adapters];

const {length} = adapters;
let nameOrAdapter;
let adapter;

for (let i = 0; i < length; i++) {
  nameOrAdapter = adapters[i];
  if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
    break;
  }
}
```



### xhr-adapter



>  lib/adapters/xhr.js



```js
const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

export default isXHRAdapterSupported && function (config) {
  // ....
}
```

函数开头就是环境判断，如果非浏览器环境返回undefined



函数主体返回`Promise`,  看内部实现



删除了部分实现的业务代码，看主要代码也就是使用 `XMLHttpRequest`实现的请求



```js

  let request = new XMLHttpRequest();

  // HTTP basic authentication
  if (config.auth) {
    const username = config.auth.username || '';
    const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
    requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
  }

  const fullPath = buildFullPath(config.baseURL, config.url);

  request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

  // Set the request timeout in MS
  request.timeout = config.timeout;

  function onloadend() {
    // ....
  }

  if ('onloadend' in request) {
    // Use onloadend if available
    request.onloadend = onloadend;
  } else {
    // Listen for ready state to emulate onloadend
    request.onreadystatechange = function handleLoad() {
      // ....
    };
  }

  // Handle browser request cancellation (as opposed to a manual cancellation)
  request.onabort = function handleAbort() {
    // ...
  };

  // Handle low level network errors
  request.onerror = function handleError() {
    // ...
  };

  // Handle timeout
  request.ontimeout = function handleTimeout() {
    // ....
  };

	// ....
  
  // Add withCredentials to request if needed
  if (!utils.isUndefined(config.withCredentials)) {
    request.withCredentials = !!config.withCredentials;
  }

  // Add responseType to request if needed
  if (responseType && responseType !== 'json') {
    request.responseType = config.responseType;
  }

  // Handle progress if needed
  if (typeof config.onDownloadProgress === 'function') {
    request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
  }

  // Not all browsers support upload events
  if (typeof config.onUploadProgress === 'function' && request.upload) {
    request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
  } 

// .... 


  // Send the request
  request.send(requestData || null);
```

