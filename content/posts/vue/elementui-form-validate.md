---
title: "elementui form多表单验证"
date: 2022-08-17T13:16:27+08:00
tags: ["elementui"]
categories: ["vue"]
draft: false
---

# 多表单验证

页面中存在多个表单验证时，要验证多个表单是否完整就比较费劲

平时业务中验证都是这样的回调形式

```javascript
this.$refs.form1.validate((valid) => {
  // ....
});
```

重新写个高阶函数

```typescript
const validateForms = (...args) => {
  return Promise.all(
    args.map(
      (form) =>
        new Promise((r, j) =>
          form && typeof form.validate === "function"
            ? form.validate((v) => (v ? r() : j()))
            : j()
        )
    )
  );
};
```

业务代码

```javascript
validateForms(
  this.$refs.form1,
  this.$refs.form2,
  this.$refs.form3 // ...多个form实例
).then(() => {
  // code
  // 具体全部验证后的代码
});
```
