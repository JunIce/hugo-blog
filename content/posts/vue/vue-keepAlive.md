---
title: "Vue2 keep-alive源码解读"
date: 2021-12-27T16:00:55+08:00
draft: true
tags: ["vue2"]
categories: ["vue"]
---



# keep-alive



`keep-alive`是 vue 中自带的组件，用作对组件实例进行缓存，通常我们用作在路由切换的同时，保持组件之前的状态



### `created`中初始化变量`cache`和`keys`， 分别用作储存实例和实例对应的`key`

```js
created () {
    this.cache = Object.create(null)
    this.keys = []
}
```



### `mounted`中对实例进行缓存

```js
 mounted () {
    this.cacheVNode()
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  }
```



### `cacheVnode`

`cacheVnode`针对对应的`key`构建对应的缓存，同时把`key`保存到`keys`队列中去



```
cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = this
      if (vnodeToCache) {
        const { tag, componentInstance, componentOptions } = vnodeToCache
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag,
          componentInstance,
        }
        keys.push(keyToCache)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
        this.vnodeToCache = null
      }
    }
```

其中有个最大数量的限制，当超过最大限制时，把第一个卸载掉



### render 

1. render中在检查cache中是否有对应的缓存，有的话会赋值到对应vnode的`componentInstance`上

2. 保证keys数组中的key唯一
3. data上`keepAlive`设置为`true`





#### 源码

```javascript
export default {
  name: "keep-alive",
  abstract: true,

  props: {
    include: patternTypes, // 筛选条件， 可以是字符串、正则
    exclude: patternTypes, // 筛选条件， 可以是字符串、正则
    max: [String, Number], // 设置最大缓存实例数量，可以用作控制应用内存使用
  },

  created() {
    this.cache = Object.create(null); // 初始化缓存实例
    this.keys = []; // 实例对应的key值数组
  },

  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted() {
    this.$watch("include", (val) => {
      pruneCache(this, (name) => matches(val, name));
    });
    this.$watch("exclude", (val) => {
      pruneCache(this, (name) => !matches(val, name));
    });
  },
  render() {
    //....
  },
};
```



#### pruneCacheEntry源码

`pruneCacheEntry` 函数是用作清除缓存中的实例, 其中最重要的是调用缓存实例的 destroy 生命周期。



```js
function pruneCacheEntry(
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key];
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy();
  }
  cache[key] = null; // 清楚缓存
  remove(keys, key);
}
```



#### render源码



```js
render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot) // 获取组件实例
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions) // 获取组件名称用作筛选
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) { // 如果不在筛选条件中，直接返回vnode
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        // 如果缓存中存在实例，即赋值为旧的实例
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // 缓存赋值为实例
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true  // 这里很重要， keepAlive标记  在后面生成dom的时候是进行patch而不是挂载， 也会调用组件实例的activated生命周期
    }
    return vnode || (slot && slot[0])
}
```

