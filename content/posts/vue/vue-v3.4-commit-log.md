---
title: "vue -- v3.4commit提交记录"
date: 2023-12-08T15:26:32+08:00
tags: ["vue3", "v3.4"]
categories: ["vue"]
draft: false
---

# vue -- v3.4commit提交记录

1.  复制htmlparser2 Parser Tokenizer文件 （解析器和分词）

2.  去掉xmlMode和htmlMode，本质上vue不存在xmlMode

3.  去除小写属性，

    1.  分词在对象构造函数中实例化
    2.  buffer重写成字符串
    3.  重写slice方法
    4.  增加parse入口方法，用于实例调用

4.  主parser中重写入口

    1.  暴露parser
    2.  增加htmlMode

5.  parser中单独实例化分词器

    1.  分词器中记录当前指针的行、列、开始的行、列

6.  去除行列计数

7.  getPositionForIndex获取当前index所在的行列数据

8.  用stack数组记录元素堆栈

9.  onattribname中拦截指令相关的标签，处理指令结尾

10. currentAttrs 改为用Set记录当前属性

11. 删除Parser中处理指令的代码，移到到分词器中处理

12. 增加prop位置索引信息，删除外部上下文检查

13. 删除解析中htmlMode的代码

14. 分词器中处理插值的部分`{{}}`

15. 处理v-pre指令部分

16. 增加3种处理模式，base、sfc、html

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a813abd7db824e4c8784dad926c414f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=288\&h=133\&s=4029\&e=png\&b=4c5a2c)

17. 删除buildIn类型
    1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de17abf0aa4f4e57b12e8b8af23f2d9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=875\&h=107\&s=12418\&e=png\&b=701414)
    2.  改为手写，包括Suspense和Transition
        1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1686412d7bda4c6ba9380d71a50c4597~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=657\&h=124\&s=11191\&e=png\&b=252323)
18. refactor: swap to new template parser
    1.  parser中特殊处理vFor指令
19. 处理浏览器部分特殊字符解析
    1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81b29371baa24adf99267858045b73dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518\&h=380\&s=62503\&e=png\&a=1\&b=333b22)
20. 标记解析时的根节点，默认为\*\*Namespace.HTML \*\*。
21. 支持sfc中模版重用的功能
    1.  现在入口处直接转换成ast![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26d2cb5bd24b4261986b76f64d38d4e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356\&h=558\&s=103364\&e=png\&a=1\&b=171717)
    2.  原transform部分不再进行转换ast了![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e49aa8e88794c0c8443a62f6f243c80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2240\&h=614\&s=161068\&e=png\&a=1\&b=181818)
    3.  compile部分优先使用ast，不存在则才使用source源码![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e18bf3420bcd49eeb60a32edd0022d6e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1442\&h=334\&s=77529\&e=png\&a=1\&b=181818)
22. 分词器中加入对template模板的支持
23. 修复新解析器中vBind的处理![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fde9a48a46974ec0a6a8834c5be242bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1294\&h=490\&s=107715\&e=png\&a=1\&b=3b4923)
24. 如果template是从src引入的则不再处理![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6898e4daa0a640729cee131bc44b6a9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320\&h=364\&s=56031\&e=png\&a=1\&b=384422)
25. 重写resolveTemplateUsageCheckString中递归的写法

```typescript
ast!.children.forEach(walk)

function walk(node: TemplateChildNode) {}
```

26. 处理template lang=html的情况![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2081aca8dd1c4311a5e506f1520dea9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184\&h=660\&s=138353\&e=png\&a=1\&b=1a1a1a)

27. 强制刷新ast![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f65f614a69344c68133f9cc6243dbcd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1486\&h=798\&s=187415\&e=png\&a=1\&b=3b4923)

28. 当使用自定义编译器时，ast不可以复用

29. 优化位置克隆，这里使用直接赋值

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99defa42aab34f5689b1278552e6aa21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1760\&h=616\&s=168467\&e=png\&a=1\&b=191919)

30. 去除magic-string中的script trim方法，这里作者解释可以优化10%的时间![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1bfe77f7450457a9f12052b5ced3076~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818\&h=732\&s=91246\&e=png\&a=1\&b=171717)

<!---->

    magic-string's trim method uses a regex check for aborting which turns
    out to be extremely expensive - it cna take up to 10% time in total SFC
    compilation! The usage here is purely aesthetic so simply removing it
    for a big perf gain is well worth it.

31. 合并生成代码中的一些多余操作, 这里在生成代码是的一些换行操作，原来通过push一个回车生成新行，现在标记成flag，可以提升6%

```latex
Previously, many CodegenContext.push() calls were unnecessarily
iterating through the entire pushed string to find newlines, when we
already know the newline positions for most of calls. Providing fast
paths for these calls significantly improves codegen performance when
source map is needed.

In benchmarks, this PR improves full SFC compilation performance by ~6%.
```

32. 优化sourcemap生成, 这里直接操作context.map的原型，这里作者解释了，因为source-map-js中的addMapping()实现有一堆不必要的参数和验证检查，在我们的例子中是纯粹的开销。

```typescript
function addMapping(loc: Position, name: string | null = null) {
    // @ts-ignore we use the private property to directly add the mapping
    // because the addMapping() implementation in source-map-js has a bunch of
    // unnecessary arg and validation checks that are pure overhead in our case.
    const { _names, _mappings } = context.map
    if (name !== null && !_names.has(name)) _names.add(name)
    _mappings.add({
      originalLine: loc.line,
      originalColumn: loc.column - 1, // source-map column is 0 based
      generatedLine: context.line,
      generatedColumn: context.column - 1,
      source: filename,
      name
    })
  }
// ....
}
```

### release: v3.4.0-alpha.2

33. 空行问题， 首字符为回车行，会插入空行![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc6d1178cc4d411db53ca8d6f2ac9ba4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=546\&h=251\&s=17422\&e=png\&b=252323)

34. ssr模式下ast重用
    1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/157a980b41a94bab8d4e495f97544b67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884\&h=169\&s=14396\&e=png\&b=1f1f1f)
    2.  增加flag用于确认是否已经解析过
        1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cef1d17b299469dbe7f9ffb36b016d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=434\&h=202\&s=13520\&e=png\&b=1f1f1f)

35. 增加解析容忍度
    1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba7b8e0d2e4a47f8997fdb90ec29da78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=855\&h=427\&s=66507\&e=png\&b=242323)

36. 修复属性参数为空的情况
    1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f6aadaa09a342969d70f0651b0f9b5d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=488\&h=161\&s=12528\&e=png\&b=1f1f1f)

### release: v3.4.0-alpha.3

37. 分词器在重置方法时调用重置inRCDATA 以致后续解析其他模板时不再报错

38. 在解析模板开始时，重置分词器是否在xml的flag![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/542e1f2336c94856b4157c3a1dd1a4f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1266\&h=502\&s=125469\&e=png\&a=1\&b=171717)

39. 模板在解析时，不去解析Error作为全局变量![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4d49c4a27554968bae01a627e8184bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1364\&h=592\&s=126048\&e=png\&a=1\&b=191919)

40. 通过分析ast，找出模版中引入的变量使用（analyze import usage in template via AST (#9729)）
    1.  解析器新增入口flag，（是否解析语句），默认时true![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc4d53c40b054049a654abec3e6fe31b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892\&h=614\&s=96310\&e=png\&a=1\&b=171717)
    2.  新增creteSimpleExpression入口函数![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0e986e18be04850b50af3fb4ba49ab1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200\&h=1624\&s=319282\&e=png\&a=1\&b=3b4a22)
    3.  解析语句部分
        1.  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f585a793a7764db8b19e3cdc46b6f78a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1248\&h=504\&s=83988\&e=png\&a=1\&b=3a4822)
        2.  children部分ast赋值到解析node对象上![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7816fd7fda71434fb41c4f6233e12aa9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1514\&h=458\&s=82458\&e=png\&a=1\&b=171717)
        3.  原来的code组装方式由原来的字符串拼接，现在采用Set进行整合去重![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbc3abc386a7478a888d4e22157688f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168\&h=996\&s=204863\&e=png\&a=1\&b=171717)

41. v-node指令监听语法升级为错误抛出![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49d3aafbe62f4f8c8464dfbfe9a70ed1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2494\&h=654\&s=220230\&e=png\&a=1\&b=171717)

42. 删除v-is语法

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0a4bf754d994342ae3e44d4690b69b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270\&h=508\&s=106151\&e=png\&a=1\&b=161616)

43. 修复在v-pre中的插值语法![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c831d9131242475584a1d5b572b64f80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250\&h=424\&s=87117\&e=png\&a=1\&b=171717)

### release: v3.4.0-alpha.4

44. 校验props的validator包含2个参数![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d866e4aa8fd841d49052499b1af84dae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234\&h=562\&s=103613\&e=png\&a=1\&b=171717)
45. 使用同样的解析参数进行编辑处理![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7f42abefd3f45028968254916913e84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1232\&h=1604\&s=298249\&e=png\&a=1\&b=181818)
46. 兼容最近的tc39提案，可以动态声明引入的类型<https://github.com/tc39/proposal-import-attributes>

```javascript
import json from "./foo.json" with { type: "json" };
import("foo.json", { with: { type: "json" } });
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0eccedb977e455c849fd10efd08d7ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1478\&h=1638\&s=297653\&e=png\&a=1\&b=171717)

47. 透传filename属性![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71252548d5e34396a4fa238990cb525c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1614\&h=566\&s=133464\&e=png\&a=1\&b=181818)

```typescript
    const ast = baseParse(`<div />`)
    
    const calls: any[] = []
    const plugin: NodeTransform = (node, context) => {
      calls.push({ ...context })
    }
    
    transform(ast, {
      filename: '/the/fileName.vue',
      nodeTransforms: [plugin]
    })
    
    expect(calls.length).toBe(2)
    expect(calls[1]).toMatchObject({
      filename: '/the/fileName.vue',
      selfName: 'FileName'
    })
```

48. 提升ssr下面，hydrant对于html属性的检查，是否需要跳过检查![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e9ae9c2ddec4101b28d10a6962aedae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1554\&h=430\&s=97511\&e=png\&a=1\&b=171717)
49. 增加 `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__`标志，用于记录hydrant
50. 增加MathML语法标签的支持![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2045728203bd468e91b0e1cffa618f87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1568\&h=482\&s=104959\&e=png\&a=1\&b=3b4923)
51. 增加组件类型中对于Slots的输出![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d2b664f3f144f34b9cc2093a9b8ad21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1596\&h=1122\&s=233101\&e=png\&a=1\&b=394623)
52. 输出`DefineType`![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7162897f182c434cbfa84a852def73f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1834\&h=436\&s=113710\&e=png\&a=1\&b=181818)