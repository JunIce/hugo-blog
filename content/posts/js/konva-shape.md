---
title: "Konvajs Shape加载自定义图片"
date: 2024-08-08T12:09:11+08:00
tags: ["Konvajs"]
categories: ['js']
draft: false
---



# Konvajs Shape加载自定义图片



需要先请求图片后加载shape，否则不能拖动



```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KonvaJS Custom Shape with Image</title>
    <script src="https://cdn.jsdelivr.net/npm/konva@8.3.9/konva.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
    </style>
</head>

<body>
    <img src="http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960" alt=""
        srcset="" style="width: 100px;" />
    <div id="container"></div>
    <script>
        // 创建Konva舞台
        var stage = new Konva.Stage({
            container: 'container',   // 容器id
            width: window.innerWidth,
            height: window.innerHeight,
        });

        // 创建图层
        var layer = new Konva.Layer({
            draggable: true,

        });
        stage.add(layer);



        // 创建自定义形状
        var customShape = new Konva.Shape({
            draggable: true,
            sceneFunc: function (context, shape) {
                // 自定义绘制逻辑
                context.beginPath();
                context.moveTo(50, 50);
                context.lineTo(150, 50);
                context.lineTo(150, 150);
                context.lineTo(50, 150);
                context.closePath();

                // 加载图片
                var imageObj = new Image();
                imageObj.crossOrigin = 'anonymous'
                imageObj.onload = function () {
                    // 用图片填充形状
                    context.drawImage(imageObj, 150, 50, 100, 100);
                };
                imageObj.src = 'http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960';  // 替换成你的图片路径
                context.fillStrokeShape(shape);
            },
            fill: 'red',  // 备用颜色
            stroke: 'black',
            strokeWidth: 2,
        });

        // 添加自定义形状到图层
        layer.add(customShape);
        // 绘制图层
        layer.draw();
    </script>
</body>
</html>
```

