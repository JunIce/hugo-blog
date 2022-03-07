---
title: "window -- RequestIdleCallback "
date: 2022-03-06T09:16:58+08:00
draft: true
---

# requestIdleCallback

用于执行一帧中低优先级的任务, 在每一帧的最后执行

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/18/162d853396355715~tplv-t2oaga2asx-watermark.jpeg)

### 语法

> Window.requestIdleCallback(callback, options)

callback

- timeRemaining Function: 返回当前帧空闲的时间
- didTime Boolean: true表示当前callback执行是因为超时原因

options 

- timeout : 如果指定了timeout并具有一个正值，并且尚未通过超时毫秒数调用回调，那么回调会在下一次空闲时期被强制执行，尽管这样很可能会对性能造成负面影响。



### 返回值

ID标识符

可使用`cancelIdleCallback(id) `取消



### Demo

```javascript
function work(deadline) {
    if(deadline.timeRemaining() > 0) {
        console.log('timeRemaining:', deadline.timeRemaining())
        doWork()
    }

    if(job.length > 0) {
        window.requestIdleCallback(work)
    }
}

function doWork() {
    let cb = job.shift()
    cb()
}



let job = [
    () => {
        console.log('done job 1')
    },
    () => {
        console.log('done job 2')
    },
    () => {
        console.log('done job 3')
    },
    () => {
        console.log('done job 4')
    },
    () => {
        console.log('done job 5')
    },
    () => {
        console.log('done job 6')
    },
]
window.requestIdleCallback(work)
```



- https://juejin.cn/post/6844903592831238157
- https://segmentfault.com/a/1190000039287134

