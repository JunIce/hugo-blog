---
title: "html Dom的Animate方法"
date: 2021-10-08T10:59:45+08:00
draft: false
tags: ["js"]
---

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div>
        <h5>test paragraph</h5>
    </div>
    <script>
        var animate = document.getElementsByTagName("h5")[0].animate([
            // keyframes
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-300px)' }
        ], {
            // timing options
            duration: 1000,
            iterations: Infinity
        });
    </script>
</body>
</html>
```

`h5`标签会一直在动画状态

```js
animate.pause() // 暂停
animate.cancel() // 取消暂停状态
animate.effect
```

