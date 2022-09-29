---
title: "webpack5 schema-utils"
date: 2022-09-29T05:59:58+08:00
tags: ["webpack5"]
categories: ["webpack"]
draft: false
---



## schema-utils



# webpack中工具类schema-utils



> yarn **add** -D schema-utils



webpack中调用 `schema-utils` 校验配置对象

```json
// options.json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "boolean"
    }
  },
  "required": ["name"],
  "additionalProperties": false
}
```



`schema-utils`底层依赖ajv js



`ajv`支持`7`种默认基本数据类型

- number

- interger

- string

- boolean

- array

- null

- object

  - `maxProperties` / `minProperties`：限定对象支持的最多、最少属性数量；

  - `required`：声明哪些属性不可为空，例如 `required = ['name', 'age']` 时，传入的值必须至少提供 `name/age` 属性；

  - `properties`：定义特定属性的 Schema 描述，与 `array` 的 `items` 属性类似，支持嵌套规则，例如：

- patternProperties:  支持属性名正则表达式
- additionalProperties
- enum： 枚举数组， 必须相等
- const 静态变量



- not指令： 数值必须不能等于这个值

- anyof指令： 必须满足条件之一

- oneof指令： 数值必须满足且只能满足条件之一
- allof指令： 必须满足所有条件
- if/then/else： 条件复合条件







