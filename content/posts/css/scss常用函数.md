---
title: "scss 常见函数整理"
date: 2024-07-19T16:31:19+08:00
draft: true
tags: ["css", "scss"]
categories: ["css"]
---



# scss 常见函数整理



### 内置函数



#### 数学函数

- `ceil($number)`: 返回大于或等于数字的最小整数。
- `floor($number)`: 返回小于或等于数字的最大整数。
- `round($number, $precision: 0)`: 四舍五入数字，$precision 参数决定小数点后的位数。
- `percentage($number)`: 将数字转换为百分比形式。

#### 颜色函数

- `rgb($red, $green, $blue)`: 创建一个RGB颜色。
- `rgba($red, $green, $blue, $alpha)`: 创建一个RGBA颜色。
- `hsl($hue, $saturation, $lightness)`: 创建一个HSL颜色。
- `hsla($hue, $saturation, $lightness, $alpha)`: 创建一个HSLA颜色。
- `lighten($color, $amount)`: 使颜色变亮。
- `darken($color, $amount)`: 使颜色变暗。

#### 字符串函数

- `str-length($string)`: 返回字符串长度。
- `str-insert($string, $insertion, $position)`: 在指定位置插入字符串。
- `str-index($haystack, $needle)`: 返回子字符串的位置。
- `str-slice($string, $start, $end: null)`: 截取字符串。

#### 列表函数

- `length($list)`: 返回列表长度。
- `nth($list, $n)`: 返回列表中的第n个元素。
- `append($list1, $list2, $separator: space)`: 连接两个列表。
- `join($lists..., $separator: comma)`: 连接多个列表。

#### 映射函数

- `map-get($map, $key)`: 从映射中获取键的值。
- `map-merge($map1, $map2...)`: 合并映射。
- `map-keys($map)`: 获取映射的所有键。
- `map-values($map)`: 获取映射的所有值。

#### 类型检测函数

- `type-of($value)`: 返回值的类型。
- `unit($number)`: 返回数值的单位。
- `unitless($number)`: 检查数值是否无单位。



### 自定义函数



```scss
@function double($num) {
  @return $num * 2;
}

body {
  width: double(50px);
}
```



### `@mixins`

```scss
@mixin box($bgColor, $txtColor) {
  background-color: $bgColor;
  color: $txtColor;
  padding: 10px;
  border: 1px solid black;
}
```



```scss
.box-red {
  @include box(red, white);
}

.box-blue {
  @include box(blue, black);
}
```



### 可变参数

```scss
@mixin gradient($colors...) {
  background-image: linear-gradient(to right, $colors);
}

.gradient-3 {
  @include gradient(red, yellow, green);
}

.gradient-2 {
  @include gradient(blue, white);
}
```



**Sass并不直接支持将Sass变量赋值给CSS变量**

需要使用`#{}`表达式来插入变量的值

```scss
:root {
  --primary-color: #{ $primary-color };
  --secondary-color: #{ $secondary-color };
}
```

