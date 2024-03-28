---
title: "expressjs 源码"
date: 2024-03-28T09:39:16+08:00
draft: false
tags: ["expressjs"]
categories: ["js"]
---



# expressjs 源码

# createApplication
暴露应用逻辑
```javascript
exports = module.exports = createApplication;
```


`express.js`创建应用主体逻辑
```javascript
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}
```

mixin通过扩展属性的方式扩展这里app上的方法
这里分别扩展了`EventEmitter.prototype`和`proto`
`proto`就是`application`暴露出的内容

# application.js

输出app这样的一个对象
```javascript
var app = exports = module.exports = {};
```


对象中通过对空对象的属性添加，增加一系列方法

- init
- defaultConfiguration
- lazyrouter
- handle
- use
- route
- engine
- param
- set
- path
- enabled
- disabled
- METHOD方式扩展
- all
- del // 已删除
- render
- listen


## lazyrouter

初始化`_router`， 其实就是实例化`Router`

```javascript
if (!this._router) {
    this._router = new Router({
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });

    this._router.use(query(this.get('query parser fn')));
    this._router.use(middleware.init(this));
  }
```

这里初始化的时候，就会增加2个初始的中间件

- init中间件
- query中间件

### init
init中间件，增加了一个powered-by头，可配置
把res赋值给req.res
把req赋值给res.req
把next复制给req.next
套娃。。
```javascript
init = function(app){
  return function expressInit(req, res, next){
    if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
    req.res = res;
    res.req = req;
    req.next = next;

    setPrototypeOf(req, app.request)
    setPrototypeOf(res, app.response)

    res.locals = res.locals || Object.create(null);

    next();
  };
};
```
### query
query中间件的主要作用就是给请求增加一个query属性，通过queryparse方法进行格式化
```javascript
return function query(req, res, next){
    if (!req.query) {
      var val = parseUrl(req).query;
      req.query = queryparse(val, opts);
    }

    next();
  };
```
## use

- 如果 use方法传入的参数是一个数组， 这里要做参数截取，目的就是拿到所有参数
```javascript
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate app.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var fns = flatten(slice.call(arguments, offset));
```

递归所有函数， 添加路径拦截方法， 调用`fn.handle`方法
```javascript
  fns.forEach(function (fn) {
    // non-express app
    if (!fn || !fn.handle || !fn.set) {
      return router.use(path, fn);
    }

    debug('.use app under %s', path);
    fn.mountpath = path;
    fn.parent = this;

    // restore .app property on req and res
    router.use(path, function mounted_app(req, res, next) {
      var orig = req.app;
      fn.handle(req, res, function (err) {
        setPrototypeOf(req, orig.request)
        setPrototypeOf(res, orig.response)
        next(err);
      });
    });

    // mounted an app
    fn.emit('mount', this);
  }, this);
```


## param

应用主体上绑定param方法，在应用请求过程中如果有相应的参数，就会回调对应的回调函数

```javascript
app.param("name", (req, res, next) => {
  // .....
  
})
```

主体实现还是在router中完成的

```javascript
function param(name, fn) {
  this.lazyrouter();

  if (Array.isArray(name)) {
    for (var i = 0; i < name.length; i++) {
      this.param(name[i], fn);
    }

    return this;
  }

  this._router.param(name, fn);

  return this;
};
```

## path

通过调用`app.path()`方法 可以输出当前请求的绝对路径，这里会递归调用，如果存在父级，会拿到父级路径并连接

```javascript
  return this.parent
    ? this.parent.path() + this.mountpath
    : '';
```


## handle

handle这里调用了router的handle方法
done方法进行了重写

```javascript
function handle(req, res, callback) {
  var router = this._router;

  // final handler
  var done = callback || finalhandler(req, res, {
    env: this.get('env'),
    onerror: logerror.bind(this)
  });

  // no routes
  if (!router) {
    debug('no routes defined on app');
    done();
    return;
  }

  router.handle(req, res, done);
};
```

## set

```javascript
app.set('foo', 'bar')
```

set方法往主体应用setting对象添加属性
```javascript
this.settings[setting] = val
```

如果只传入了一个参数，默认是get获取值


## all

对所有请求方式进行调用

```javascript
  var route = this._router.route(path);
  var args = slice.call(arguments, 1);

  for (var i = 0; i < methods.length; i++) {
    route[methods[i]].apply(route, args);
  }

  return this;
```



