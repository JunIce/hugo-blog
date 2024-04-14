


## SVG Path中相关命令

|命令|含义|参数|描述|
|----|--------|--------|--------|
|M|移动到|x,y|移动到x,y|
|L|直线到|x,y|直线到x,y|
|H|水平移动到|x|水平移动到x|
|V|垂直移动到|y|垂直移动到y|
|C|三次贝塞尔曲线|x1,y1,x2,y2,x3,y3|三次贝塞尔曲线|
|S|二次贝塞尔曲线|x2,y2,x3,y3|二次贝塞尔曲线|
|Q|二次贝塞尔曲线|x1,y1,x2,y2|二次贝塞尔曲线|
|T|二次贝塞尔曲线|x2,y2|二次贝塞尔曲线|
|A|椭圆|rx,ry,x-axis-rotation,large-arc-flag,sweep-flag,x,y|椭圆|
|Z|闭合| |闭合|


### 相对位置和绝对位置

Uppercase大写表示绝对位置，lowercase小写表示相对位置。

绝对位置，这意味着它们的参数相对于原点（0，0），
相对位置，这意味着它们的参数相对于上一个命令的端点。


### T 

T命令将使用上一条曲线的控制点的反射绘制一条新的二次曲线。尝试改变第一条曲线的控制点，并注意它如何改变第二条曲线。

### A

画弧形

```js
A rx ry rotation large-arc-flag sweep-flag x y
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/387cef8f383b4375a46ed9dc3effe241~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=670&h=451&s=23647&e=png&b=f8f8f8)



- 弧是椭圆的一部分;
- 从当前光标位置到x和y值绘制圆弧;
- Ry和Ry值控制椭圆的大小;
- x-axis-rotation值使椭圆绕其x轴旋转;
- large-arc-flag和sweep-flag值控制绘制四个可能弧中的哪一个。


### 总结如下：

- 元素中的d属性<path>是一系列命令;
- 通过顺序执行命令来绘制路径;
- 命令以单字母代码开头，后跟一个或多个数字;
- 大写命令是绝对的，而小写命令是相对的。
