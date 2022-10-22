---
title: "Async.js"
date: 2022-10-17T18:50:37+08:00
tags:
categories:
draft: false
---







### each

数组循环调用iterator方法进行处理

`_each`方法对数组进行遍历， 内部使用`iterator`进行调用

`only_once`方法保证函数只会被调用一次

`done`方法内部进行计数，和数组长度进行比对，执行成功后会调用回调函数



```javascript
async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          } else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
};
```

