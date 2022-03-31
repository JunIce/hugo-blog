---
title: "Vue -- Elementui Select样式覆盖"
date: 2021-03-21T20:51:50+08:00
draft: true
tags: ["vue2", "element-ui"]
categories: ["vue"]
---

# element-ui el-select 自定义样式覆盖
- 设计图样式
![截屏2020-10-14 上午8.45.03.png](https://upload-images.jianshu.io/upload_images/9403487-aa0f14b8e3869b5e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

中间分割线使用css`::after`背景图进行，最后一个设置为`display:none`

- 最终效果
![截屏2020-10-14 上午8.48.42.png](https://upload-images.jianshu.io/upload_images/9403487-7d6c5979da346e64.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

备份一下方便使用

```sass
$focus_color: #3296E1;
.statictis-select{
  /deep/.el-input__inner{
    background-color: #112E49;
    color: #ffffff
  }
  .el-input__inner{
    border-color: $focus_color;
  }

  &:hover .el-input__inner{
    border-color: $focus_color;
  }

  &-popper{
    border: 1px solid $focus_color;
    border-radius: 4px;
    overflow: hidden;

    &[x-placement^=bottom]{
      margin-top: 4px;
    }

    .el-scrollbar{
      background-color: #112E49;
    }

    .el-select-dropdown__item{
      height: 26px;
      line-height: 26px;
      padding: 0 12px;
      font-size: 12px;
      color: #ffffff;
      position: relative;
      text-align: center;
    }
    .el-select-dropdown__item::after{
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 10px;
      width: calc(100% - 20px);
      height: 1px;
      background-image: url(../../assets/images/horizontal_line.png);
      background-repeat: no-repeat;
      background-size: cover;
    }

    .el-select-dropdown__item:last-child::after{
      display: none;
    }

    .el-select-dropdown__item.selected{
      color: $focus_color;
    }
    .el-select-dropdown__item.hover{
      background-color: #112E49;
      color: $focus_color;
    }
    .popper__arrow{
      display: none;
    }
  }
}
```