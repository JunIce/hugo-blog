---
title: "mysql -- 内置函数解读及使用方法"
date: 2022-02-03T15:25:24+08:00
draft: true
tags: ["mysql"]
---

# mysql中Date对应的类型 

- DATE - 格式 YYYY-MM-DD
- DATETIME - 格式: YYYY-MM-DD HH:MM:SS
- TIMESTAMP - 格式: YYYY-MM-DD HH:MM:SS
- YEAR - 格式 YYYY 或 YY

## now

返回当前日期，包括时分秒

> select now();

> 2022-02-03 16:25:46

## curdate

当前日期

> select curdate();

> 2022-02-03

## curtime

> select curtime();

> 16:25:46

## DATE(field) 

提取日期部分

> select date(created_at) as createdTime from ...

> createdTime // 2022-02-03


## to_days

给定一个日期date，返回一个日期号码（自0年以来的天数）

> select to_days('2017-10-09'), to_days('17-10-09'), to_days(171009); // 这三种形式都是一样的结果

> 736976



## 使用案例

### 今天

> SELECT * FROM 表名 WHERE TO_DAYS(时间字段名) = TO_DAYS(now());

### 昨天

> SELECT * FROM 表名 WHERE TO_DAYS( NOW( ) ) - TO_DAYS( 时间字段名) <= 1

### 近7天

> SELECT * FROM 表名 where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(时间字段名)

### 近30天

> SELECT * FROM 表名 where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(时间字段名)

### 本月

> SELECT * FROM 表名 WHERE DATE_FORMAT( 时间字段名, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' )

### 上一个月

> SELECT * FROM 表名 WHERE PERIOD_DIFF( date_format( now( ) , '%Y%m' ) , date_format( 时间字段名, '%Y%m' ) ) =1




