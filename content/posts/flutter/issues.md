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