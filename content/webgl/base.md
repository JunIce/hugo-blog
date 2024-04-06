---
title: "webgl 基础知识"
date: 2024-04-06T17:28:26+08:00
categories: ["webgl"]
draft: true
---



# webgl 基础知识






## 坐标系

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/144698bfc2e74c3ab38a7a53898fe0a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1442&h=648&s=714066&e=png&a=1&b=02060e)

- 屏幕坐标转换成webgl坐标

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/404110660d17427a9d25a80dde62b570~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1508&h=788&s=527738&e=png&a=1&b=01040b)


- 渲染管线

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a991fd85147e4a47b5818335becee3c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1548&h=698&s=700293&e=png&a=1&b=fcfdeb)





## 顶点着色器

顶点着色器通过a_Position、a_PointSize分别接收并设置顶点的位置和大小，通过a_Color从程序获取颜色并通过v_Color传递给片元着色器



以`gl_`开头的变量是着色器的内置变量

`webgl_`和`_webgl`还是着色器保留字，自定义变量不能以`webgl_`或`_webgl`开头。





**gl_Position**（位置）和**gl_PointSize**（大小）是着色器的内置变量





以`attribute vec4 a_Position`为例

- `attribute`表示存储限定符
- `vec`是数据类型
- `a_Position`为变量名称



## 片元着色器

片元着色器的作用是计算出当前绘制图元中每个像素的颜色值，逐片元控制片元的颜色和纹理等渲染。关于片元，片元包含颜色、深度和纹理等信息，片元相对像素多出许多信息，从直观表现上看两者都是像素点。关于图元，图元是指WebGL中可以直接绘制7种基本图形，它们分别是：

- 孤立点：gl.POINTS
- 孤立线段：gl.LINES
- 连续线段：gl.LINE_STRIP
- 连续线圈：gl.LINE_LOOP
- 孤立三角形：gl.TRIANGLES
- 三角带：gl.TRIANGLE_STRIP
- 三角扇：gl.TRIANGLE_FAN





### attribute

​	attribute只能用于顶点着色器，用来存储顶点着色器中每个顶点的输入，包括顶点位置坐标、纹理坐标和颜色等信息。用来从缓冲中获取所需数据，并将它提供给顶点着色器。程序可以指定每次顶点着色器运行时读取缓冲的规则。



### uniform 全局变量

用来存储图元处理过程中保持不变的值，顶点着色器和片元着色器共享了 uniform 变量的命名空间。必须保持精度一致。



### varying 可变量



从顶点着色器向片元着色器传输数据，在图元装配后，WegGL会对图元光栅化，在光栅化过程中，varying声明的变量的值会进行内插，使varying变量的值线性（默认）变化。





## 渲染案例



```html
<body>
    <canvas id="app"></canvas>
    <script>

        const canvas = document.getElementById('app');

        const gl = canvas.getContext('webgl');

        function initShader() {

            // 创建shader

            // 顶点着色器
            const vs_shader = gl.createShader(gl.VERTEX_SHADER);

            gl.shaderSource(vs_shader, `

attribute vec4 a_Position;

attribute float a_PointSize;

attribute vec4 a_Color;

varying vec4 v_Color;

void main() {

  gl_Position = a_Position;

  gl_PointSize = a_PointSize;

  v_Color = a_Color;

}

`);

            gl.compileShader(vs_shader);

            // 片元着色器
            const fs_shader = gl.createShader(gl.FRAGMENT_SHADER);

            gl.shaderSource(fs_shader, `precision mediump float;

varying vec4 v_Color;

void main() {

  gl_FragColor = v_Color;

}`);
            gl.compileShader(fs_shader);

            

            // 创建program

            const program = gl.createProgram();

            gl.attachShader(program, vs_shader);

            gl.attachShader(program, fs_shader);

            gl.linkProgram(program);

            

            // 使用program
            gl.useProgram(program);

            gl.program = program;

            // 获取着色器变量位置和赋值

            const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            const a_Color = gl.getAttribLocation(gl.program, 'a_Color');



            // 使用缓冲区表示多个值

            const vertices = new Float32Array([

                -0.5, 0.5, 1.0, 0.0, 0.9, 1.0,

                -0.5, -0.5, 0.0, 1.0, 0.9, 1.0,

                0.5, 0.5, 0.0, 0.0, 1.0, 1.0

            ])

            const SIZE = vertices.BYTES_PER_ELEMENT;
            

            const vertexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, SIZE * 6, 0);

            gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, SIZE * 6, SIZE * 2);

            gl.enableVertexAttribArray(a_Position);

            gl.enableVertexAttribArray(a_Color);

        }

        initShader();

        gl.clearColor(0.0, 0.1,0.1, 0.2);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

    </script>
</body>
```

