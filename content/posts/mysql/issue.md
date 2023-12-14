---
title: "mysql -- 问题解决"
date: 2023-12-02T15:25:24+08:00
draft: true
tags: ["mysql"]
---



## Syntax error or access violation: 1055 Expression #1 of ORDER BY clause is not in GROUP BY clause and contains nonaggregated column  which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by


```mysql
mysql> SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
```

- /etc/mysql/my.cnf

```my.cnf
[mysqld]
sql_mode = ""
# sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"
```

then
```bash
sudo systemctl restart mysql
```