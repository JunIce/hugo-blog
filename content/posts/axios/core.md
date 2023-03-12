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



