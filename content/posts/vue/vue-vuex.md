---
title: "Vue vuex源码解读"
date: 2022-04-21T15:01:27+08:00
draft: true
tags: ["vue"]
categories: ["vue2"]

---





# vuex源码



> v3.6.2





## 入口mixin.js



1. 判断`vue`版本，如果`vue`版本是2的，挂载`beforeCreate`勾子

```javascript
if (version >= 2) {
    // beforeCreate注入
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }
```



这里看代码就能推断出， `root`组件挂载的就是`options.store`, 而root的子组件，都是引用的它的父组件的store， 最终都指向根组件的`store`， 所以`vuex`推荐一个应用只有一个store

```javascript
function vuexInit () {
    const options = this.$options
    // store injection
    // 根组件上调用拿到的store
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 根节点的子组建其实都是拿的根上的那个store， 同一个引用
      this.$store = options.parent.$store
    }
  }
```



## new Store



1. 内部的一些储存参数的初始化

```javascript
const {
  plugins = [],
  strict = false
} = options

// store internal state
this._committing = false
this._actions = Object.create(null)
this._actionSubscribers = []
this._mutations = Object.create(null)
this._wrappedGetters = Object.create(null)
this._modules = new ModuleCollection(options)
this._modulesNamespaceMap = Object.create(null)
```



2. `store`实例上暴露了`dispatch`和`commit`方法，这里修改了方法的`this`指向，指向了当前的`store`实例

   

```javascript
const store = this
const { dispatch, commit } = this
this.dispatch = function boundDispatch (type, payload) {
  return dispatch.call(store, type, payload)
}
this.commit = function boundCommit (type, payload, options) {
  return commit.call(store, type, payload, options)
}
```



3. 接下来就到了安装模块

```javascript
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && __DEV__) {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      if (__DEV__) {
        if (moduleName in parentState) {
          console.warn(
            `[vuex] state field "${moduleName}" was overridden by a module with the same name at "${path.join('.')}"`
          )
        }
      }
      Vue.set(parentState, moduleName, module.state)
    })
  }
```



4. 我们返回到上面`_modules`初始化这里

>   this._modules = new ModuleCollection(options)



## class ModuleCollection



实例化函数中直接调用内部函数register



### register



`register`这里传入的就是`new Store`传入的参数

我们平时传入的参数如下

```javascript
new Store({
	state: {
		count: 0
	},
	getters: {
		computedGetters: state => state.count
	},
	actions: {
		doAction() {
			// ....
		}
	}
})
```



这里的path，其实用来记录模块的名字的

初次会生成一个`root`对象，一个`Module`实例

如果不是根对象，会找到它对应的父模块，并把自身加入到子队列中区





如果配置中有子模块的情况下，遍历`modules`，同时把`module`的名字推入到`path`中



```javascript
const newModule = new Module(rawModule, runtime)
// 第一次会生成一个root根
if (path.length === 0) {
  // 这个时候会生成root
  this.root = newModule
} else {
  const parent = this.get(path.slice(0, -1))
  // 找到对应的父模块，加到children中
  parent.addChild(path[path.length - 1], newModule)
}

// register nested modules
// 存在子模块递归调用， 同时把名字放到path中
if (rawModule.modules) {
  forEachValue(rawModule.modules, (rawChildModule, key) => {
    this.register(path.concat(key), rawChildModule, runtime)
  })
}
```



### get



`get`方法，从根组件开始找起

`path`这里是一个数组，`slice(0, -1)`其实就是当前数组去除了最后一个元素的副本



```javascript
get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
}
```





## class Module



Module内部就比较简单了， 其实就两个对象

一个`_children`, 用作保存下面的子模块

一个`state`， 保存的就是当前的模块



```javascript
this.runtime = runtime
// Store some children item
this._children = Object.create(null)
// Store the origin module object which passed by programmer
this._rawModule = rawModule
const rawState = rawModule.state

// Store the origin module's state
this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
```



同时内部还提供几个遍历更新的方法， 其实就是遍历actions、getters、actions、mutations等



### update



模块方法， 用作更新当前模块的数据



```javascript
this._rawModule.namespaced = rawModule.namespaced
if (rawModule.actions) {
  this._rawModule.actions = rawModule.actions
}
if (rawModule.mutations) {
  this._rawModule.mutations = rawModule.mutations
}
if (rawModule.getters) {
  this._rawModule.getters = rawModule.getters
}
```

