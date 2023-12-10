---
title: "vue -- v3.4commit提交记录"
date: 2023-12-08T15:26:32+08:00
tags: ["vue3", "v3.4"]
categories: ["vue"]
draft: false
---

# vue -- v3.4commit提交记录# 





1. 复制htmlparser2 Parser Tokenizer文件 （解析器和分词）

   

2. 去掉xmlMode和htmlMode，本质上vue不存在xmlMode

   

3. 去除小写属性，

   1. 分词在对象构造函数中实例化
   2. buffer重写成字符串
   3. 重写slice方法
   4. 增加parse入口方法，用于实例调用

4. 主parser中重写入口

   1. 暴露parser
   2. 增加htmlMode

5. parser中单独实例化分词器

   1. 分词器中记录当前指针的行、列、开始的行、列

6. 去除行列计数

7. getPositionForIndex获取当前index所在的行列数据

8. 用stack数组记录元素堆栈

9. onattribname中拦截指令相关的标签，处理指令结尾

10. currentAttrs 改为用Set记录当前属性

11. 删除Parser中处理指令的代码，移到到分词器中处理

12. 增加prop位置索引信息，删除外部上下文检查

13. 删除解析中htmlMode的代码

14. 分词器中处理插值的部分`{{}}`

15. 处理v-pre指令部分

16. 增加3种处理模式，base、sfc、html

![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701910465599-0400510a-f5da-41cd-a320-68f722bf90df.png#averageHue=%234c5a2c&clientId=uaa381230-8be3-4&from=paste&height=133&id=Yq9hS&originHeight=133&originWidth=288&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4029&status=done&style=none&taskId=u4fd7bfb8-bb9c-4de8-899f-246351dd5fb&title=&width=288)

17. 删除buildIn类型
    1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701911075054-96654835-b692-4599-a852-f96d1167ccd2.png#averageHue=%23521918&clientId=uaa381230-8be3-4&from=paste&height=107&id=u994626c5&originHeight=107&originWidth=875&originalType=binary&ratio=1&rotation=0&showTitle=false&size=12418&status=done&style=none&taskId=ue87171e2-eb6f-457f-b177-84e571071db&title=&width=875)
    2. 改为手写，包括Suspense和Transition
       1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701911105943-377892aa-0cc2-40d0-95bd-8e507a8f8d92.png#averageHue=%23232221&clientId=uaa381230-8be3-4&from=paste&height=124&id=u021848fe&originHeight=124&originWidth=657&originalType=binary&ratio=1&rotation=0&showTitle=false&size=11191&status=done&style=none&taskId=ud14f9e24-98d9-4f90-89a0-92899a5785f&title=&width=657)
18. refactor: swap to new template parser
    1. parser中特殊处理vFor指令
19. 处理浏览器部分特殊字符解析
    1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701954938533-656543a1-6c67-467b-ad21-c991a442e79c.png#averageHue=%23202517&clientId=uc377313b-2345-4&from=paste&height=190&id=u1e19bdde&originHeight=380&originWidth=1518&originalType=binary&ratio=2&rotation=0&showTitle=false&size=62503&status=done&style=none&taskId=u6340660f-3435-4190-85af-71e3b6fc124&title=&width=759)
20. 标记解析时的根节点，默认为**Namespace.HTML **。
21. 支持sfc中模版重用的功能
    1. 现在入口处直接转换成ast![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701956121537-aa4a7edc-8e39-47a6-b54d-a3f60a9fdc66.png#averageHue=%23131312&clientId=uc377313b-2345-4&from=paste&height=279&id=u377ad45b&originHeight=558&originWidth=1356&originalType=binary&ratio=2&rotation=0&showTitle=false&size=103364&status=done&style=none&taskId=u7708ac3f-c5ea-4da0-ba44-121a23efe46&title=&width=678)
    2. 原transform部分不再进行转换ast了![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701956220479-47718949-f5de-4bf1-b634-d35d9ef8eb52.png#averageHue=%23151414&clientId=uc377313b-2345-4&from=paste&height=307&id=u2c071e3e&originHeight=614&originWidth=2240&originalType=binary&ratio=2&rotation=0&showTitle=false&size=161068&status=done&style=none&taskId=u2d46e5a1-9850-4923-87c6-7ac22876bdb&title=&width=1120)
    3. compile部分优先使用ast，不存在则才使用source源码![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701956287373-0016e4fa-367d-42d5-b518-3821a9e7adee.png#averageHue=%23121111&clientId=uc377313b-2345-4&from=paste&height=167&id=u1f298a17&originHeight=334&originWidth=1442&originalType=binary&ratio=2&rotation=0&showTitle=false&size=77529&status=done&style=none&taskId=ubff5aca3-5324-4889-930d-37b16f1c11d&title=&width=721)
22. 分词器中加入对template模板的支持
23. 修复新解析器中vBind的处理![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701956543724-2c665bd8-2787-487d-9098-f264889f08c5.png#averageHue=%233d4b24&clientId=uc377313b-2345-4&from=paste&height=245&id=ud43a23ed&originHeight=490&originWidth=1294&originalType=binary&ratio=2&rotation=0&showTitle=false&size=107715&status=done&style=none&taskId=u5a1032fd-d1dd-405d-a47b-01c29de7001&title=&width=647)
24. 如果template是从src引入的则不再处理![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701956655553-ffbf7012-eafd-436c-9e83-ef9d82a6ba73.png#averageHue=%23202516&clientId=uc377313b-2345-4&from=paste&height=182&id=u5e06de4c&originHeight=364&originWidth=1320&originalType=binary&ratio=2&rotation=0&showTitle=false&size=56031&status=done&style=none&taskId=ua8c6490a-fb90-46d0-9eef-2495e1d6e58&title=&width=660)
25. 重写resolveTemplateUsageCheckString中递归的写法

```typescript
ast!.children.forEach(walk)

function walk(node: TemplateChildNode) {}
```

26. 处理template lang=html的情况![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701957072374-d1c4661d-8108-494a-a580-b3959e8280c9.png#averageHue=%23161615&clientId=uc377313b-2345-4&from=paste&height=330&id=u5376b526&originHeight=660&originWidth=1184&originalType=binary&ratio=2&rotation=0&showTitle=false&size=138353&status=done&style=none&taskId=ud45b89b7-5e35-47a0-b0d7-1c400f5d71e&title=&width=592)

27. 强制刷新ast![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701957155132-0f2e50bd-72db-45f4-980e-16d184b8daf5.png#averageHue=%233c4b24&clientId=uc377313b-2345-4&from=paste&height=399&id=u41eb8cf1&originHeight=798&originWidth=1486&originalType=binary&ratio=2&rotation=0&showTitle=false&size=187415&status=done&style=none&taskId=u01c6e26d-0440-4fd4-9b9b-33917cfa30d&title=&width=743)

28. 当使用自定义编译器时，ast不可以复用

29. 优化位置克隆，这里使用直接赋值

    ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701957998956-54cfb9ce-e46a-43a7-9e99-0933f8e75757.png#averageHue=%23171615&clientId=uc377313b-2345-4&from=paste&height=308&id=u35d3f4d3&originHeight=616&originWidth=1760&originalType=binary&ratio=2&rotation=0&showTitle=false&size=168467&status=done&style=none&taskId=u69975561-872d-4e70-ac3f-89ced49d648&title=&width=880)

30. 去除magic-string中的script trim方法，这里作者解释可以优化10%的时间![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701957964086-f64f449c-7734-423e-80bd-db6237873cfe.png#averageHue=%231b1313&clientId=uc377313b-2345-4&from=paste&height=366&id=u17af29cf&originHeight=732&originWidth=818&originalType=binary&ratio=2&rotation=0&showTitle=false&size=91246&status=done&style=none&taskId=u24d04ae1-a7d1-4906-935d-375f4333e74&title=&width=409)

```
magic-string's trim method uses a regex check for aborting which turns
out to be extremely expensive - it cna take up to 10% time in total SFC
compilation! The usage here is purely aesthetic so simply removing it
for a big perf gain is well worth it.
```

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

33. 空行问题， 首字符为回车行，会插入空行![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701995885533-4a81486f-3af1-4a8f-a1eb-ff214668a4bf.png#averageHue=%23323725&clientId=ua8af2a3b-4852-4&from=paste&height=340&id=ud77dcc65&originHeight=251&originWidth=546&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17422&status=done&style=none&taskId=u4409e8cf-26f5-40f1-bff7-084545e5870&title=&width=739)
34. ssr模式下ast重用
    1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701996200457-0a66fa9b-0876-4639-9ec4-3e2135cf3edf.png#averageHue=%231f1f1f&clientId=ua8af2a3b-4852-4&from=paste&height=169&id=uf0899047&originHeight=169&originWidth=884&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14396&status=done&style=none&taskId=ufc99e652-9ab8-481d-aace-4d355288b6e&title=&width=884)
    2. 增加flag用于确认是否已经解析过
       1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701996263293-5ab7bdbf-c99b-4ee0-92d8-6a54522f38f7.png#averageHue=%23201f1f&clientId=ua8af2a3b-4852-4&from=paste&height=202&id=u5c4e3390&originHeight=202&originWidth=434&originalType=binary&ratio=1&rotation=0&showTitle=false&size=13520&status=done&style=none&taskId=u34019e0a-6dfc-45ea-a4e9-5b9f078004f&title=&width=434)
35. 增加解析容忍度
    1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701996713735-64be9486-6438-4889-a14d-290e8b06b666.png#averageHue=%23333826&clientId=ua8af2a3b-4852-4&from=paste&height=427&id=ua8c791aa&originHeight=427&originWidth=855&originalType=binary&ratio=1&rotation=0&showTitle=false&size=66507&status=done&style=none&taskId=u0dc84f8a-54c6-4144-9ad6-063e7b1123e&title=&width=855)
36. 修复属性参数为空的情况
    1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1701996789073-cb7b98a3-f121-42df-ba86-89b9fde1f490.png#averageHue=%23222120&clientId=ua8af2a3b-4852-4&from=paste&height=161&id=u17322f39&originHeight=161&originWidth=488&originalType=binary&ratio=1&rotation=0&showTitle=false&size=12528&status=done&style=none&taskId=u2a00e7bf-c7ab-4058-be42-aa7a21353a6&title=&width=488)

37. 分词器在重置方法时调用重置inRCDATA 以致后续解析其他模板时不再报错

38. 在解析模板开始时，重置分词器是否在xml的flag![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702124719291-e533154b-9692-4809-a39e-0599461fa805.png#averageHue=%23121211&clientId=ubd1f17b4-8a40-4&from=paste&height=251&id=u48aa717f&originHeight=502&originWidth=1266&originalType=binary&ratio=2&rotation=0&showTitle=false&size=125469&status=done&style=none&taskId=udc56250f-ce27-4305-b558-be5adeb3358&title=&width=633)
39. 模板在解析时，不去解析Error作为全局变量![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702124789764-52ef0a48-8642-4959-9db0-6ec8e1740c90.png#averageHue=%23191616&clientId=ubd1f17b4-8a40-4&from=paste&height=296&id=u6c5f4fea&originHeight=592&originWidth=1364&originalType=binary&ratio=2&rotation=0&showTitle=false&size=126048&status=done&style=none&taskId=u1fc6055d-c27e-4b7d-ba73-2169465d135&title=&width=682)
40. 通过分析ast，找出模版中引入的变量使用（analyze import usage in template via AST (#9729)）
    1. 解析器新增入口flag，（是否解析语句），默认时true![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702185659945-12078d4e-fe24-412f-9b5e-c1c204fd267d.png#averageHue=%23121212&clientId=ubd1f17b4-8a40-4&from=paste&height=307&id=u2b3b2fe4&originHeight=614&originWidth=892&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96310&status=done&style=none&taskId=uf47212f4-26ed-471b-8a85-457fa17da69&title=&width=446)
    2. 新增creteSimpleExpression入口函数![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702185787555-817e0267-8c1e-46de-940c-7db7f20c4731.png#averageHue=%233d4b23&clientId=ubd1f17b4-8a40-4&from=paste&height=812&id=ud050b270&originHeight=1624&originWidth=1200&originalType=binary&ratio=2&rotation=0&showTitle=false&size=319282&status=done&style=none&taskId=u3f929d2c-a0df-4bee-81fb-26212dd25af&title=&width=600)
    3. 解析语句部分
       1. ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702185905352-2ad9ffd3-7c17-43d9-8cc8-d8f806d73d18.png#averageHue=%233c4a23&clientId=ubd1f17b4-8a40-4&from=paste&height=252&id=u5523f131&originHeight=504&originWidth=1248&originalType=binary&ratio=2&rotation=0&showTitle=false&size=83988&status=done&style=none&taskId=u33dbe079-1fe6-454b-abd2-411f2d3a511&title=&width=624)
       2. children部分ast赋值到解析node对象上![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702185984678-53cc8436-872f-45f6-bf6c-957844714417.png#averageHue=%23121212&clientId=ubd1f17b4-8a40-4&from=paste&height=229&id=uac89e259&originHeight=458&originWidth=1514&originalType=binary&ratio=2&rotation=0&showTitle=false&size=82458&status=done&style=none&taskId=u681ba003-97be-4547-baa8-69f85e810b9&title=&width=757)
       3. 原来的code组装方式由原来的字符串拼接，现在采用Set进行整合去重![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702186445961-2e26aa98-d542-4a7f-92e9-af2a72e11aab.png#averageHue=%23161615&clientId=ubd1f17b4-8a40-4&from=paste&height=498&id=u50b9c228&originHeight=996&originWidth=1168&originalType=binary&ratio=2&rotation=0&showTitle=false&size=204863&status=done&style=none&taskId=u88879568-1825-4c4e-95e6-afa3571d4e0&title=&width=584)




41. v-node指令监听语法升级为错误抛出![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702185109123-64426219-d4f0-400e-a6ec-d324c41e634f.png#averageHue=%231b1514&clientId=ubd1f17b4-8a40-4&from=paste&height=327&id=u06497c29&originHeight=654&originWidth=2494&originalType=binary&ratio=2&rotation=0&showTitle=false&size=220230&status=done&style=none&taskId=u0049e194-3458-475c-86ab-a5eb1b551c5&title=&width=1247)

42. 删除v-is语法

    ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702184938643-150ac5f9-bb78-4775-a05d-5d8bead5175d.png#averageHue=%23311414&clientId=ubd1f17b4-8a40-4&from=paste&height=254&id=u53a703a7&originHeight=508&originWidth=1270&originalType=binary&ratio=2&rotation=0&showTitle=false&size=106151&status=done&style=none&taskId=u74f76ebb-f48d-4a42-87c4-872f5f4a218&title=&width=635)

43. 修复在v-pre中的插值语法![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702184861000-6d8554d4-e71c-41f1-83a1-16eee2bc7c74.png#averageHue=%23121211&clientId=ubd1f17b4-8a40-4&from=paste&height=212&id=u4c5160ee&originHeight=424&originWidth=1250&originalType=binary&ratio=2&rotation=0&showTitle=false&size=87117&status=done&style=none&taskId=u47a9f73d-1a64-4e5a-8de5-d4991478a05&title=&width=625)


### v3.4.0-alpha.4

44. 校验props的validator包含2个参数![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702186679018-e072abf7-7657-4f5f-bfb7-e11e2af9df62.png#averageHue=%23121212&clientId=ubd1f17b4-8a40-4&from=paste&height=281&id=u0345a383&originHeight=562&originWidth=1234&originalType=binary&ratio=2&rotation=0&showTitle=false&size=103613&status=done&style=none&taskId=uf0946d02-6261-4a5f-acbb-8336b216ea7&title=&width=617)
45. 使用同样的解析参数进行编辑处理![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702186871695-64cff967-8f10-4b19-a81c-f61375031531.png#averageHue=%23161616&clientId=ubd1f17b4-8a40-4&from=paste&height=802&id=u5ec129e9&originHeight=1604&originWidth=1232&originalType=binary&ratio=2&rotation=0&showTitle=false&size=298249&status=done&style=none&taskId=u473b377f-8263-45c7-a3bd-124092791b0&title=&width=616)
46. 兼容最近的tc39提案，可以动态声明引入的类型[https://github.com/tc39/proposal-import-attributes](https://github.com/tc39/proposal-import-attributes)

```javascript
import json from "./foo.json" with { type: "json" };
import("foo.json", { with: { type: "json" } });
```

 ![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702204573108-abbb00e3-5270-4dcd-b07b-8573c268fcab.png#averageHue=%23171616&clientId=ubd1f17b4-8a40-4&from=paste&height=819&id=kk2te&originHeight=1638&originWidth=1478&originalType=binary&ratio=2&rotation=0&showTitle=false&size=297653&status=done&style=none&taskId=uc3698390-0c4d-4513-8f92-c87dbf04df1&title=&width=739)

47. 透传filename属性![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702204800157-6b01443d-230d-4557-9eb1-6089d21e3d19.png#averageHue=%23141414&clientId=ubd1f17b4-8a40-4&from=paste&height=283&id=u27243e68&originHeight=566&originWidth=1614&originalType=binary&ratio=2&rotation=0&showTitle=false&size=133464&status=done&style=none&taskId=ud9091553-332e-4c6d-bab6-3201d2e1ca2&title=&width=807)

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

48. 提升ssr下面，hydrant对于html属性的检查，是否需要跳过检查![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702206078319-e5291185-73ad-48b3-a5f2-add607e86757.png#averageHue=%23151411&clientId=ubd1f17b4-8a40-4&from=paste&height=215&id=u77190e3f&originHeight=430&originWidth=1554&originalType=binary&ratio=2&rotation=0&showTitle=false&size=97511&status=done&style=none&taskId=u050a2a38-3f78-4ed5-a22e-82c0fd09f29&title=&width=777)
49. 增加 `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__`标志，用于记录hydrant
50. 增加MathML语法标签的支持![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702206468845-646d1856-f024-4745-8538-1f65b2669a66.png#averageHue=%23434c27&clientId=ubd1f17b4-8a40-4&from=paste&height=241&id=u945ecc69&originHeight=482&originWidth=1568&originalType=binary&ratio=2&rotation=0&showTitle=false&size=104959&status=done&style=none&taskId=uf07a62ac-4d29-49fd-9e50-2c357c2f842&title=&width=784)
51. 增加组件类型中对于Slots的输出![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702207086941-296116cd-18af-4517-9cec-63bfb4b5a933.png#averageHue=%233b4723&clientId=ubd1f17b4-8a40-4&from=paste&height=561&id=ub8295515&originHeight=1122&originWidth=1596&originalType=binary&ratio=2&rotation=0&showTitle=false&size=233101&status=done&style=none&taskId=u85a2bad0-c207-4825-8565-7d46fa0e19e&title=&width=798)
52. 输出`DefineType`![image.png](https://cdn.nlark.com/yuque/0/2023/png/410478/1702207169261-72c20974-f5d1-4ae9-a0ca-1ffb509dc492.png#averageHue=%23141313&clientId=ubd1f17b4-8a40-4&from=paste&height=218&id=uddf225f5&originHeight=436&originWidth=1834&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113710&status=done&style=none&taskId=u12f57d23-4cf9-4f22-b386-9eeb635d02e&title=&width=917)

