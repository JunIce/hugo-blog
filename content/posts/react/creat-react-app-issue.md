---
title: "create-react-app 使用中相关问题整理"
date: 2022-05-09T07:00:28+08:00
tags:
categories: ["react"]
draft: false
---







# 1.test添加代码覆盖率


命令修改为

```sh
react-scripts test --coverage --watchAll=false
```



package.json

```json
"jest": {
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/"
  ],
  "coverageThreshold": {
    "global": {
      "lines": 90,
      "statements": 90
    }
  }
}
```



