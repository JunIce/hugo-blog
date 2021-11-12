---
title: "Copy Text to Clipboard"
date: 2021-11-11T14:15:10+08:00
draft: true
---

代码中我们有把文本复制到剪切板的需求，这里我们可以自己写，也可以从npm中找，本着不重复造轮子（buhui）,我们使用 `copy-text-to-clipboard`

### 安装

> npm install copy-text-to-clipboard

### 源码

```js
const copyTextToClipboard = (input, {target = document.body} = {}) => {
    // 创建一个界面外的文本输入框
	const element = document.createElement('textarea');
    // 缓存之前激活的dom
	const previouslyFocusedElement = document.activeElement;
    // 赋值
	element.value = input;

	// Prevent keyboard from showing on mobile
	element.setAttribute('readonly', '');

    // 界面外的css赋值
	element.style.contain = 'strict';
	element.style.position = 'absolute';
	element.style.left = '-9999px';
	element.style.fontSize = '12pt'; // Prevent zooming on iOS

    // 创建选区
	const selection = document.getSelection();
	let originalRange = false;
	if (selection.rangeCount > 0) {
		originalRange = selection.getRangeAt(0);
	}
    // 插入的dom中
	target.append(element);
    // 选中
	element.select();

	// Explicit selection workaround for iOS
	element.selectionStart = 0;
	element.selectionEnd = input.length;

	let isSuccess = false;
	try {
		isSuccess = document.execCommand('copy');
	} catch (_) {}

	element.remove();

	if (originalRange) {
        // 把原本dom中的选区还原到dom中
		selection.removeAllRanges();
		selection.addRange(originalRange);
	}

	// Get the focus back on the previously focused element, if any
	if (previouslyFocusedElement) {
        // focus选中
		previouslyFocusedElement.focus();
	}

	return isSuccess;
};
```


### 使用

```js
const copy = require('copy-text-to-clipboard');

button.addEventListener('click', () => {
	copy('🦄🌈');
});
```
