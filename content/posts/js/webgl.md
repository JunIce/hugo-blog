---
title: "webgl笔记"
date: 2024-07-19T08:35:32+08:00
tags: ["webgl"]
categories: ["js"]
draft: false
---



# webgl 笔记



![img](../../assets/webgl25a.png)



### 坐标系

- 中心点(0,0,0)

- 左下角 （-1，-1，0）

- 右上（1,1,0）

  

### createShader

- `gl.VERTEX_SHADER` 顶点着色器
- `gl.FRAGMENT_SHADER` 片段着色器

```js
      function createShader(gl, type, fragment) {
        let shader = gl.createShader(type, fragment);
        gl.shaderSource(shader, fragment);
        gl.compileShader(shader);
        return shader;
      }
```



### createProgram

```js
function createProgram(gl, vertexShader, fragmentShader) {
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram
      }
```



program生成后要被使用



> gl.useProgram(program);



### vertexAttribPointer

> ```js
> gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
> ```



- index 变量属性
- size 每个顶点属性的组成数量， 即数据中几个数成一组
- type 类型
- normalized 是否归一化处理
- stride 以字节为单位的偏移量
- offset 顶点属性数组中第一部分的字节偏移量



### attribute

attribute 声明变量 （储存限定符）

attribute 类型 变量名



## API Methods



| 方法名                                                       | 说明                                                         |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| gl.clearColor(0.0, 0.0, 0.0, 1.0)                            | 清空canvas颜色                                               |
| gl.clear(gl.COLOR_BUFFER_BIT)                                | 清空canvas                                                   |
| gl.createShader(type)                                        | 创建着色器                                                   |
| gl.shaderSource(shader, fragment);                           | 设置着色器代码                                               |
| gl.compileShader(shader);                                    | 编译一个 GLSL 着色器，使其成为为二进制数据                   |
| gl.createProgram()                                           | 创建和初始化一个 [`WebGLProgram`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLProgram) 对象 |
| gl.attachShader(program, shader)                             | 添加一个片段或者顶点着色器。                                 |
| gl.linkProgram(program);                                     | 链接                                                         |
| gl.createBuffer()                                            | 创建buffer数据缓冲区                                         |
| gl.bindBuffer(gl.ARRAY_BUFFER, buffer);                      | 创建并初始化了 Buffer 对象的数据存储区                       |
| gl.getAttribLocation(program, name)                          | 某属性的下标指向位置                                         |
| gl.getUniformLocation(program, name)                         | 返回指定uniform变量的指向                                    |
| gl.useProgram(program)                                       | 使用程序                                                     |
| gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions), gl.STATIC_DRAW) | 绑定buffer对应的数据                                         |
| gl.enableVertexAttribArray(index)                            | 激活的顶点索引，由[`getAttribLocation()`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/getAttribLocation)返回 |
| gl.vertexAttribPointer(index, size, type, normalized, stride, offset); | 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。 |
| gl.drawArrays(mode, first, count);                           | 从向量数组中绘制图元。                                       |
|                                                              |                                                              |
|                                                              |                                                              |



```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/gl-matrix/3.4.2/gl-matrix.js"></script>
  </head>
  <body>
    <canvas width="500" height="500" id="canvas"></canvas>
    <script>
      const canvas = document.getElementById("canvas");
      const gl = canvas.getContext("webgl");

      // 使用完全不透明的黑色清除所有图像
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      // 用上面指定的颜色清除缓冲区
      gl.clear(gl.COLOR_BUFFER_BIT);

      const vsSource = `
        attribute vec4 a_position;
        uniform mat4 u_matrix;
        void main() {
          // 将位置从模型空间转换到裁剪空间
          gl_Position = a_position;
        }
      `;

      const fsSource = `
        precision mediump float;
        uniform vec4 u_color;
        void main() {
          gl_FragColor = u_color;
        }
      `;

      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      const program = createProgram(gl, vertexShader, fragmentShader);
      gl.useProgram(program);
      const colorLocation = gl.getUniformLocation(program, "u_color");
      
      gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 1.0);

      const positions = [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5];
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
      );
      const positionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLocation);

      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // 绘制图形
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      function createShader(gl, type, fragment) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, fragment);
        gl.compileShader(shader);
        return shader;
      }

      function createProgram(gl, vertexShader, fragmentShader) {
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
      }
    </script>
  </body>
</html>
```

