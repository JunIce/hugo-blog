---
title: "element input数字格式化"
date: 2024-03-18T08:35:32+08:00
categories: ["js"]
draft: false
---




# element input数字格式化

```js
  formatNumber: (value, decimals = 0, max) => {
    let v = String(value);

    let reg = new RegExp(`[^\\d${decimals > 0 ? "." : ""}]`, "g");

    v = v
      .replace(reg, "")
      .replace(/^0+(\d)/, "$1") // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      .replace(/^\./, "0.");

    if (decimals > 0) {
      let idx = v.indexOf(".") + 1;
      if (idx > 0) {
        v = v.substring(0, idx + decimals);
      }
    }

    if (max) {
      v = Number(v) > Number(max) ? String(max) : v;
    }
    return v;
  },
```
