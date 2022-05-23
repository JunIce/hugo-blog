---
title: "elementui Tab样式改造"
date: 2022-05-23T13:16:27+08:00
tags: ["elementui"]
categories:
draft: false
---











对于`ElementUI`样式进行改造



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4dc68c41bd5469aaa2071e969dc2cdb~tplv-k3u1fbpfcp-watermark.image?)



```scss
.#{$prefix}-field-drawer {
  > .el-drawer__header {
    background-color: var(--theme);
    padding-bottom: 20px;
    color: #fff;
  }

  > .el-drawer__body {
    padding-left: 8px;
    padding-right: 8px;
  }

  .flow-field-tab {
    .el-tabs__nav-wrap {
      padding-bottom: 10px;

      &::after {
        background-color: var(--theme);
      }
    }
    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__item {
      padding: 6px 12px;
      height: unset;
      line-height: unset;
    }

    .el-tabs__item.is-active {
      background-color: #e5edf3;
      border-radius: 5px;
      color: #6c95ca;
    }

    .field-title {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      margin-bottom: 20px;
    }

    .field-table {
      .el-radio__label {
        display: none;
      }
    }
  }
}

```

