---
title: "Vue Router源码解读"
date: 2022-04-24T16:56:41+08:00
draft: true
tags: ["vue2"]
categories: ["vue"]
---



# Vue Router源码解读



>  "version": "3.5.3"

![VueRouter.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9578e5e1cb664f338ac52cfce9b3fbe7~tplv-k3u1fbpfcp-watermark.image?)



### 入口

`install.js`



Vue原型上混入router对应的逻辑

这里能看到root应用上,调用了router实例的init方法

子组件上所有的`_routerRoot`都指向根组件的`_routerRoot`

```javascript
Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
})
```





## VueRouter



`index.js`



### createMatcher

`createMatcher`方法把`routes`循环，对应生成 `match`, `addRoute`, `getRoutes`, `addRoutes` 4个方法

```
this.matcher = createMatcher(options.routes || [], this)
```



### createRouteMap

内部其实调用这个`createRouteMap`生成对应的routes的map

- pathList： 路径的数组
- pathMap： 以路径为key， value是`RouteRecord`对象
- nameMap： 以路由名字为key， value是`RouteRecord`对象



以上操作都是为了索引方法而做的一些列操作



#### addRouteRecord

把对应的route组装成一个对象, 然后分别存到 pathList、pathMap、nameMap中去



```javascript
  const record: RouteRecord = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    alias: route.alias
      ? typeof route.alias === 'string'
        ? [route.alias]
        : route.alias
      : [],
    instances: {},
    enteredCbs: {},
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props
          : { default: route.props }
  }

  if (route.children) {
    
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  // pathMap、pathList中做记录
  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }
```



#### path-to-regex



最重要的一步就是使用`path-to-regex`这个库生成对应的正则匹配对象

以路径为例`/crew/crew-archives`

调用后会生成以下对象

```
{
    keys: [],
    lastIndex: 0,
    dotAll: false,
    flags: "i",
    global: false,
    hasIndices: false,
    ignoreCase: true,
    multiline: false,
    source: "^\\/crew\\/crew-archives(?:\\/(?=$))?$",
    sticky: false,
    unicode: false,
}
```





### match



- 存在name
  - 从nameMap中寻找
  - 如果有参数，也就是`path-to-regex`生成的`keys`中如果有对应的参数，则去参数列表中去匹配
  - 最后生成对应的路由对象，这里路由对象用`Object.freeze`进行包装
- 不存在name
  - 遍历`pathList`, 根据正则进行匹配出对应的路由



```javascript
function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    const location = normalizeLocation(raw, currentRoute, false, router)
    const { name } = location

    if (name) {
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      if (!record) return _createRoute(null, location)
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }

      location.path = fillParams(record.path, location.params, `named route "${name}"`)
      return _createRoute(record, location, redirectedFrom)
    } else if (location.path) {
      location.params = {}
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }
```

