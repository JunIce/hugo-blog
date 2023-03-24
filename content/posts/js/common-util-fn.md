---
title: "常用工具函数整理"
date: 2023-03-19T20:25:49+08:00
draft: false
tags: ["工具函数"]
categories: ["js"]
---


# 常用工具函数整理


#### 是否是iE11

```js
// 判断是否是iE11
const isIE11 = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1;

```

#### 浏览器类型

```js
export const IS_REACT_VERSION_17_OR_ABOVE =
  parseInt(React.version.split('.')[0], 10) >= 17

export const IS_IOS =
  typeof navigator !== 'undefined' &&
  typeof window !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream

export const IS_APPLE =
  typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent)

export const IS_ANDROID =
  typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent)

export const IS_FIREFOX =
  typeof navigator !== 'undefined' &&
  /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)

export const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)

// "modern" Edge was released at 79.x
export const IS_EDGE_LEGACY =
  typeof navigator !== 'undefined' &&
  /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent)

export const IS_CHROME =
  typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent)

// Native `beforeInput` events don't work well with react on Chrome 75
// and older, Chrome 76+ can use `beforeInput` though.
export const IS_CHROME_LEGACY =
  typeof navigator !== 'undefined' &&
  /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent)

// Firefox did not support `beforeInput` until `v87`.
export const IS_FIREFOX_LEGACY =
  typeof navigator !== 'undefined' &&
  /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(
    navigator.userAgent
  )

// qq browser
export const IS_QQBROWSER =
  typeof navigator !== 'undefined' && /.*QQBrowser/.test(navigator.userAgent)

// UC mobile browser
export const IS_UC_MOBILE =
  typeof navigator !== 'undefined' && /.*UCBrowser/.test(navigator.userAgent)

// Wechat browser
export const IS_WECHATBROWSER =
  typeof navigator !== 'undefined' && /.*Wechat/.test(navigator.userAgent)

// Check if DOM is available as React does internally.
// https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js
export const CAN_USE_DOM = !!(
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
)

// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly
export const HAS_BEFORE_INPUT_SUPPORT =
  !IS_CHROME_LEGACY &&
  !IS_EDGE_LEGACY &&
  // globalThis is undefined in older browsers
  typeof globalThis !== 'undefined' &&
  globalThis.InputEvent &&
  // @ts-ignore The `getTargetRanges` property isn't recognized.
  typeof globalThis.InputEvent.prototype.getTargetRanges === 'function'
```


#### 是否支持module



```js
// Detect whether browser supports `<script type=module>` or not
export function isModuleScriptSupported() {
	const s = document.createElement('script');
	return 'noModule' in s;
}
```


#### requestIdleCallback



```js
export const requestIdleCallback =
	window.requestIdleCallback ||
	function requestIdleCallback(cb) {
		const start = Date.now();
		return setTimeout(() => {
			cb({
				didTimeout: false,
				timeRemaining() {
					return Math.max(0, 50 - (Date.now() - start));
				},
			});
		}, 1);
	};
```


#### 合法的script类型


```js
function isValidJavaScriptType(type) {
	const handleTypes = ['text/javascript', 'module', 'application/javascript', 'text/ecmascript', 'application/ecmascript'];
	return !type || handleTypes.indexOf(type) !== -1;
}
```