---
title: "flutter 问题整理"
date: 2022-10-16T20:54:21+08:00
tags:
categories: ["flutter"]
draft: false
---



### Undefined name 'OutlineButton'.



使用TextButton代替



#### Try adding either an explicit non-'null' default value or the 'required' modifier.



空安全报错，一旦sdk升级到2.12以上之后，那么就会执行空安全检查

1. 添加关键字 `required`
2. 添加默认值





### flutter 运行时 "Your session has expired. Please log in."

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4aeb3e3c2cc473796f3c7cada848938~tplv-k3u1fbpfcp-watermark.image?)



> Xcode ——>Preferences…——> accounts 重新登录 ——> fix





### Failed assertion: line 4680 pos 14: 'owner!._debugCurrentBuildTarget == this': is not true.



出现在使用CustomScrollView的时候

| Sliver名称             | 说明                                                   |
| ---------------------- | ------------------------------------------------------ |
| SliverAppBar           | 对应 AppBar，主要是为了在 CustomScrollView 中使用。    |
| SliverToBoxAdapter     | 一个适配器，可以将 RenderBox 适配为 Sliver，后面介绍。 |
| SliverPersistentHeader | 滑动到顶部时可以固定住，后面介绍。                     |



常规组件需要使用`SliverToBoxAdapter`包裹一层


### Error: The default value of an optional parameter must be constant

当在声明Color类型时， 使用`Colors.grey.shade600`会报错，查询后需要定义成常量，前面加`const`

```dart
class CardPanelHeader extends StatelessWidget {
  final String leadingPanelText;
  final Color leadingPanelTextColor;
  final String trailingPanelText;
  final Color trailingPanelTextColor;

  const CardPanelHeader({
    Key key,
    this.leadingPanelText,
    this.leadingPanelTextColor = Colors.black87,
    this.trailingPanelText,
    this.trailingPanelTextColor = const Colors.grey.shade600,
  }) : super(key: key);
```


### 生成对应的应用图标

[https://icon.wuruihong.com/](https://icon.wuruihong.com/)



### Column children中动态添加元素

在`children`中进行`if`判断

```dart
Column(
     children: <Widget>[
     if(condition1)
      widget1,
     if(condition2)
     widget2,
_    ..._getWeatherDataWidgets(),
],)
```



### The method '[\]' can't be unconditionally invoked because the receiver can be 'null



简单判断

```dart
var list = someList;
if (list != null) {
  int a = list[0]; // No error
}
```

使用**`?`** and **`??`**:

```dart
int a = someList?[0] ?? -1;
```

如果是数组中进行索引，加个`!`进行强制判断

```dart
int a = someList![0];
```



### 背景色渐变



```dart
Container(
  width: 60,
  height: 60,
  decoration: BoxDecoration(
      borderRadius: BorderRadius.all(Radius.circular(30)),
      boxShadow: [
        BoxShadow(
          color: Color.fromARGB(255, 111, 187, 249),
          blurRadius: 5,
          spreadRadius: 0.0,
        ),
      ],
      gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color.fromARGB(255, 80, 174, 252),
            Color.fromARGB(255, 32, 131, 212),
          ])),
  child: Icon(
    Icons.edit_rounded,
    color: Colors.white,
    size: 30,
  ),
),
```



### 行平均4等份

```dart
Row(
  children: [
    Expanded(
      flex: 1, // you can play with this value, by default it is 1
      child: Child1(),
    ),
    Expanded(
      flex: 1, 
      child: Child2(),
    ),
    Expanded(
      flex: 1, 
      child: Child3(),
    ),
    Expanded(
      flex: 1, 
      child: Child4(),
    ),
  ],
);
```



### Unable to upgrade Flutter: no origin repository configured



```perl
flutter channel stable
flutter upgrade --force
```



