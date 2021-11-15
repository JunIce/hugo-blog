---
title: "Browserslist 详解"
date: 2021-11-12T14:14:05+08:00
draft: true
---

## Browserslist

> 根据提供的目标浏览器的环境来，智能添加css前缀，js的polyfill垫片,来兼容旧版本浏览器，而不是一股脑的添加。避免不必要的兼容代码，以提高代码的编译质量。

```markdown
`Android` for Android WebView.
`Baidu` for Baidu Browser.
`BlackBerry` or bb for Blackberry browser.
`Chrome` for Google Chrome.
`ChromeAndroid` or and_chr for Chrome for Android
`Edge` for Microsoft Edge.
`Electron` for Electron framework. It will be converted to Chrome version.
`Explorer` or ie for Internet Explorer.
`ExplorerMobile` or ie_mob for Internet Explorer Mobile.
`Firefox` or ff for Mozilla Firefox.
`FirefoxAndroid` or and_ff for Firefox for Android.
`iOS` or ios_saf for iOS Safari.
`Node` for Node.js.
`Opera` for Opera.
`OperaMini` or op_mini for Opera Mini.
`OperaMobile` or op_mob for Opera Mobile.
`QQAndroid` or and_qq for QQ Browser for Android.
`Safari` for desktop Safari.
`Samsung` for Samsung Internet.
`UCAndroid` or and_uc for UC Browser for Android.
`kaios` for KaiOS Browser.
```

|  参数   | 解释  |
|  ----  | ----  |
| 1% | 全球超过1%人使用的浏览器 |
| 5% in US|	指定国家使用率覆盖|
|last 2 versions|	所有浏览器兼容到最后两个版本根据CanIUse.com追踪的版本|
|Firefox ESR|	火狐最新版本|
|Firefox > 20|	指定浏览器的版本范围|
|not ie <=8	|方向排除部分版本|
|Firefox 12.1	|指定浏览器的兼容到指定版本|
|unreleased versions|	所有浏览器的beta测试版本|
|unreleased Chrome versions	|指定浏览器的测试版本|
|since 2013|	2013年之后发布的所有版本|


