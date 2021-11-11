---
title: "Classnames库代码解读"
date: 2021-11-11T09:46:42+08:00
draft: false
---


`classnames`库是日常工作中用来操作dom中class相关的工具函数，这里我们对它进行解读
```js
function classNames() {
    let classes = [];

    for (let i = 0; i < arguments.length; i++ ) {
        if(!arguments[i]) {
            continue
        }

        const arg = arguments[i]

        if(typeof arg === 'string' || typeof arg === 'number') {
            // 直接插入
            classes.push(arg)
        } else if (Array.isArray(arg)) {
            // 子项是数组
            arg.length && classes.push(classNames.call(null, arg))
        } else if(typeof arg === 'object') {
            // 判断是不是object, 是就进行遍历
            if(arg.toString() === Object.prototype.toString()) {
                for(let key in arg) {
                    if(arg[key]) {
                        classes.push(arg[key])
                    }
                }
            } else {
                // 不是object
                classes.push(arg.toString())
            }
        }

    }


    return classes.join(' ')
}
```