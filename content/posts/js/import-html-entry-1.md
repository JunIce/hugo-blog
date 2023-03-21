---
title: "import-html-entry 笔记"
date: 2023-03-15T10:18:32+08:00
tags:
categories: ["import-html-entry"]
draft: false
---



# import-html-entry 源码解读



## importHTML函数



输入2个参数

- url： 请求路径url，可以是远程路径
- opts: 用户配置，可以定义用户请求的fetch函数等.





根据用户配置设定请求的fetch函数

```js
if (typeof opts === 'function') {
		fetch = opts;
	} else {
		// fetch option is availble
		if (opts.fetch) {
			// fetch is a funciton
			if (typeof opts.fetch === 'function') {
				fetch = opts.fetch;
			} else { // configuration
				fetch = opts.fetch.fn || defaultFetch;
				autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
			}
		}
		getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
		getTemplate = opts.getTemplate || defaultGetTemplate;
	}
```



embedHTMLCache 用来缓存请求结果，如果之前有结果则返回之前的结果，

使用url作为对象的key



```js
return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url)...
```



把请求结果范围为字符串

```js
.then(response => readResAsString(response, autoDecodeResponse))
```



解析字符串为对应的template、scripts、styles等对应的模块

```js
.then(html => {

			const assetPublicPath = getPublicPath(url);
			const { template, scripts, entry, styles } = processTpl(getTemplate(html), assetPublicPath, postProcessTemplate);
			// ....
})
```



## getEmbedHTML



拿到拼接完样式内容的html字符串之后，

返回一个对象包括html、script等数据

```js
return getEmbedHTML(template, styles, { fetch }).then(embedHTML => ({
				template: embedHTML,
				assetPublicPath,
  			// 获取所有script数据
				getExternalScripts: () => getExternalScripts(scripts, fetch),
  			// 获取所有样式数据
				getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
  			// 执行script方法
				execScripts: (proxy, strictGlobal, opts = {}) => {
					if (!scripts.length) {
						return Promise.resolve();
					}
					return execScripts(entry, scripts, proxy, {
						fetch,
						strictGlobal,
						...opts,
					});
				},
			}));
```



## getEmbedHTML



请求对应的样式文件，并且去读里面的内容

插入到对应的html字符串中，拼接成html模版的一部分



```js
export function getExternalStyleSheets(styles, fetch = defaultFetch) {
  // promise.all 一次请求所有样式，拿到样式内容
	return Promise.all(styles.map(styleLink => {
			if (isInlineCode(styleLink)) {
				// if it is inline style
				return getInlineCode(styleLink);
			} else {
				// external styles
				return styleCache[styleLink] ||
					(styleCache[styleLink] = fetch(styleLink).then(response => response.text()));
			}

		},
	));
}
function getEmbedHTML(template, styles, opts = {}) {
	const { fetch = defaultFetch } = opts;
	let embedHTML = template;
	
  // 先获取所有样式文件内容
	return getExternalStyleSheets(styles, fetch)
		.then(styleSheets => {
			embedHTML = styles.reduce((html, styleSrc, i) => {
        // 插入到对应html字符串中
				html = html.replace(genLinkReplaceSymbol(styleSrc), isInlineCode(styleSrc) ? `${styleSrc}` : `<style>/* ${styleSrc} */${styleSheets[i]}</style>`);
				return html;
			}, embedHTML);
			return embedHTML;
		});
}
```





## 完整代码



```js
export default function importHTML(url, opts = {}) {
	let fetch = defaultFetch;
	let autoDecodeResponse = false;
	let getPublicPath = defaultGetPublicPath;
	let getTemplate = defaultGetTemplate;
	const { postProcessTemplate } = opts;

	// compatible with the legacy importHTML api
	if (typeof opts === 'function') {
		fetch = opts;
	} else {
		// fetch option is availble
		if (opts.fetch) {
			// fetch is a funciton
			if (typeof opts.fetch === 'function') {
				fetch = opts.fetch;
			} else { // configuration
				fetch = opts.fetch.fn || defaultFetch;
				autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
			}
		}
		getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
		getTemplate = opts.getTemplate || defaultGetTemplate;
	}

	return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url)
		.then(response => readResAsString(response, autoDecodeResponse))
		.then(html => {

			const assetPublicPath = getPublicPath(url);
			const { template, scripts, entry, styles } = processTpl(getTemplate(html), assetPublicPath, postProcessTemplate);

			return getEmbedHTML(template, styles, { fetch }).then(embedHTML => ({
				template: embedHTML,
				assetPublicPath,
				getExternalScripts: () => getExternalScripts(scripts, fetch),
				getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
				execScripts: (proxy, strictGlobal, opts = {}) => {
					if (!scripts.length) {
						return Promise.resolve();
					}
					return execScripts(entry, scripts, proxy, {
						fetch,
						strictGlobal,
						...opts,
					});
				},
			}));
		}));
}

```

