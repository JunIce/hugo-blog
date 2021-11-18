---
title: "Event Bus"
date: 2021-11-01T09:39:16+08:00
draft: false
tags: ["js"]
---


日常我们在vue开发的时候使用公共事件总线进行跨组建数据传递，这里我们自己封装一个事件总线，了解其背后的原理
```js
class MyEvent {
    constructor() {
        this._eventMap = new Map()
    }


    on(event, callback) {
        if(event && typeof callback == 'function') {
            this._eventMap.has(event) || this._eventMap.set(event, []);
            this._eventMap.get(event).push(callback);
        }
        return this;
    }

    off(event, callback) {
        if(event) {
            if(typeof callback == 'function') {
                const callbacks = this._eventMap.get(event) || [];
                for(let i in callbacks) {
                    if(callbacks[i] === callback) {
                        callbacks.splice(i, 1);
                    }
                }
            } else {
                this._eventMap.delete(event)
            }

        }
        return this
    }

    once(event, callback) {

    }

    emit(event, ...args) {
        if(!this._eventMap.has(event)) return false;
        this._eventMap.get(event).map(callback => callback(...args))
        return true;
    }
}
```

