---
title: "正则表达式"
date: 2022-07-10T09:29:26+08:00
tags: ["regex"]
categories: ["regex"]
draft: false
---



# 正则表达式



| 特殊字符   | 正则表达式 | 记忆方式                                     |
| ---------- | ---------- | -------------------------------------------- |
| 换行符     | \n         | new line                                     |
| 换页符     | \f         | form feed                                |
| 回车符     | \r         | return                                   |
| 空白符     | \s         | space                                    |
| 制表符     | \t         | tab                                      |
| 垂直制表符 | \v         | vertical tab                             |
| 回退符     | [\b]       | backspace,之所以使用[]符号是避免和\b重复 |


## 引用分组



括号分组的编号规则是从左向右计数，从1开始



**无论括号如何嵌套，分组的编号都是根据开括号出现顺序来计数的；开括号是从左向右数起第多少个开括号，整个括号分组的编号就是多少。**



![234c457cd5085fd7b40bf20dfbda276c.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f603d8e250415ea3ce8c4ffd619883~tplv-k3u1fbpfcp-watermark.image?)





反向引用（back-reference），它允许在正则表达式内部引用之前的捕获分组匹配的文本（也就是左侧），其形式也是\num
，其中num表示所引用分组的编号，编号规则与之前介绍的相同。

```typescript
/([a-z])\1/.match('a@qq.com')  // qq

```



其中\1表示反向引用的值



#### 非引用分组

非捕获分组类似普通的捕获分组，只是在开括号后紧跟一个问号和冒号（?:xxxx）



> (?:\d{4})-(\d{2})-(\d{2}) 



## 位置匹配



- ^ 开头位置
- &结尾位置
- \b单位边界位置
- \B非单词边界位置
- (?=p) 正向先行断言
- (?!p)  负向先行断言
- (?<=p) 符合p子模式的后面
- (?<!p) 除符合p子模式的后面以外的位置



#### 

##### 手机号码转换成3-4-4风格

```typescript
'15380890101'.replace(/(?=(\d{4})+$)/g, '-')
```



##### 数字转换成每隔3位添加逗号

```typescript
'153808901010'.replace(/(?!^)(?=(\d{3})+$)/g, ',')
```

其中`(?!^)`使用负向先行断言，排除了开头的,



##### 密码校验

```typescript
// 1. 校验密码6-12位， 由小写或大写字母组成
/^[a-zA-Z\d]{6-12}$/

// 2. 小写和大写组合
/(?=.*[a-z])(?=.*[A-Z])/
```



## RegExp



如果使用 RegExp的 exec()和 test()函数，并且设定了全局模式，正则表达式的匹配就会从lastIndex的位置开始，并且在每次匹配成功之后重新设定lastIndex。



### exec



> RegExp.exec(string)



RegExp对象中存在 lastIndex变量，它指定下次开始尝试匹配的位置。

指定全局模式g之后，RegExp对象每次匹配成功，都会把匹配的结束位置更新到lastIndex，下次调用时从lastIndex开始尝试匹配

```typescript
var pattern = /\d{4}-\d{2}-\d{02}/u

var str = "2022-01-05 2022-05-23"

var matchArray = pattern.exec(str)
```



和**String.match**方法对比

- **Regexp.exec()**总是返回单次的匹配结果。
- 对**String.match()**来说，如果指定了全局模式，则会返回一个字符串数组，其中包含各次成功匹配的文本，但不包含任何其他信息。



### test



> RegExp.test(string) => boolean



lastIndex 索引后会发生变化

每个RegExp对象都包含状态变量lastIndex。如果指定了全局模式，每次执行RegExp.test()时，都会从字符串中的lastIndex偏移值开始尝试匹配，所以如果用同一个RegExp多次验证字符串，必须记得每次调用之后，**将lastIndex设定为0**，否则就可能出错了。





| 方法           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| RegExp.exec    | 一个在字符串中执行查找匹配的RegExp方法，它返回一个数组（未匹配到则返回null）。 |
| RegExp.test    | 一个在字符串中测试是否匹配的RegExp方法，它返回true或false。  |
| String.match   | 一个在字符串中执行查找匹配的String方法，它返回一个数组或者在未匹配到时返回null。 |
| String.search  | 一个在字符串中测试匹配的String方法，它返回匹配到的位置索引，或者在失败时返回-1。 |
| String.replace | 一个在字符串中执行查找匹配的String方法，并且使用替换字符串替换掉匹配到的子字符串。 |
| String.split   | 一个使用正则表达式或者一个固定字符串分隔一个字符串，并将分隔后的子字符串存储到数组中的String方法。 |

## 注意点



#### **\b 匹配成功只有一种情况：一边必须保证\w（等价于[0-9a-zA-Z_]）匹配成功，另一边必须保证\w匹配不成功。**

![_2022-07-10_15-06-01.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe518fa91cc14b9cad22f571e0e4fc88~tplv-k3u1fbpfcp-watermark.image?)



以下情况都是true

```typescript
/a\b/u.test("a, ")
// true
/a\b/u.test("a，")
// true
/a\b/u.test("a。")
// true
```



#### 命名分组

ES2017新增了对命名分组的支持。如果使用了命名分组，具体写法是（? <name> regex），其中name为捕获分组的名称。



```typescript
pattern = /(? <year>\d{4})-(? <month>\d{2})-(? <day>\d{2})/u;
result = pattern.exec("2017-12-25");

// => result.groups.year === '2017'
// => result.groups.month === '12'
// => result.groups.day === '25
```



**除非复用RegExp对象，否则每次遇到/regex/或new RegExp(regex)时，都会重新生成RegExp对象，这样就会造成死循环。**



需要重新定义变量后再使用





```typescript

// 身份证
^[1-9]\d{14}(\d{2}[0-9x])?$

// html标签匹配
^<[^/]([^>]*[^/])? >$
   
// 匹配路径
'/foo/bar_qux.php'.match(/[a-z]+([a-z]+(_[a-z]+)?\.php)/)

// 邮箱匹配

[-\w.]{1,64}@([-a-zA-Z0-9]{1,63}\.)[-a-zA-Z0-9]{1,63}

```

