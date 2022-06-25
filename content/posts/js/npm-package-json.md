---
title: "npm -- package.json"
date: 2022-06-24T21:34:19+08:00
draft: true
tags: ["js", "npm"]

---



# npm-package.json





## Lint-staged

```bash
npm install --save-dev lint-staged
```



`lint-staged`用来在提交之前执行一些命令，比如格式化文件，以保持文件格式的统一



```json
"lint-staged": {
    "*": "your-cmd"
}
```

