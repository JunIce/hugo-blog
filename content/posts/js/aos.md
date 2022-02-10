---
title: "AOS 源码解读"
date: 2021-12-03T15:11:32+08:00
draft: true
---


## AOS 源码解读

项目中有个需求是官网浏览时，滚动鼠标，相对应的元素会以动画的形式加载到对应的位置。看到这个需求我第一印象就是window下有个`MutationObserver`这个api，可以监听对应的dom元素变化，应该可以使用。本着不重复造轮子，找了npm上有这个包，可以实现。

[https://github.com/michalsnik/aos](https://github.com/michalsnik/aos)

## 安装

```js
npm install aos --save
```


## 使用

在对应dom元素上增加相关`data-aos`相关的属性

```html
 <div data-aos="flip-left" data-aos-delay="100" data-aos-anchor=".example-selector">
```

使用也是非常简单，直接init就完事了。

```js
AOS.init(options?)
```

## 全局配置

`offset` 出发的偏移量

`duration` 动画持续时间

`delay` 延迟触发时间

`easing` 动画形式

## API

### method

1. init 初始化
  
2. refresh 刷新
  
3. refreshHard 强制刷新
  

```js

// 可以使用的动画效果

  * Fade animations:
    * fade
    * fade-up
    * fade-down
    * fade-left
    * fade-right
    * fade-up-right
    * fade-up-left
    * fade-down-right
    * fade-down-left

  * Flip animations:
    * flip-up
    * flip-down
    * flip-left
    * flip-right

  * Slide animations:
    * slide-up
    * slide-down
    * slide-left
    * slide-right

  * Zoom animations:
    * zoom-in
    * zoom-in-up
    * zoom-in-down
    * zoom-in-left
    * zoom-in-right
    * zoom-out
    * zoom-out-up
    * zoom-out-down
    * zoom-out-left
    * zoom-out-right


// data-aos-anchor-placement
// 锚点可选触发值
  * top-bottom
  * top-center
  * top-top
  * center-bottom
  * center-center
  * center-top
  * bottom-bottom
  * bottom-center
  * bottom-top


// easing 可选的值
  * linear
  * ease
  * ease-in
  * ease-out
  * ease-in-out
  * ease-in-back
  * ease-out-back
  * ease-in-out-back
  * ease-in-sine
  * ease-out-sine
  * ease-in-out-sine
  * ease-in-quad
  * ease-out-quad
  * ease-in-out-quad
  * ease-in-cubic
  * ease-out-cubic
  * ease-in-out-cubic
  * ease-in-quart
  * ease-out-quart
  * ease-in-out-quart
```

具体的使用可以用demo自己跑一跑

## 源码解读

```js
// aos.js
const init = function init(settings) {
  // 复制全局配置
  options = Object.assign(options, settings);

  // 内部实现即querySelectorAll 查处所有的带data-aos的元素
  $aosElements = elements();

  //....
   
  //disabled 方法 即删除所有带aos的元素属性
  if (isDisabled(options.disable) || browserNotSupported) {
    return disable();
  }

  /**
   * Disable mutation observing if not supported
   */
  if (!options.disableMutationObserver && !observer.isSupported()) {
    console.info(`
      aos: MutationObserver is not supported on this browser,
      code mutations observing has been disabled.
      You may have to call "refreshHard()" by yourself.
    `);
    options.disableMutationObserver = true;
  }

  /**
   * Set global settings on body, based on options
   * so CSS can use it
   */
  document.querySelector('body').setAttribute('data-aos-easing', options.easing);
  document.querySelector('body').setAttribute('data-aos-duration', options.duration);
  document.querySelector('body').setAttribute('data-aos-delay', options.delay);

  /**
   * Handle initializing
   */
  if (options.startEvent === 'DOMContentLoaded' &&
    ['complete', 'interactive'].indexOf(document.readyState) > -1) {
    // Initialize AOS if default startEvent was already fired
    refresh(true);
  } else if (options.startEvent === 'load') {
    // If start event is 'Load' - attach listener to window
    window.addEventListener(options.startEvent, function() {
      refresh(true);
    });
  } else {
    // Listen to options.startEvent and initialize AOS
    document.addEventListener(options.startEvent, function() {
      refresh(true);
    });
  }

  /**
   * Refresh plugin on window resize or orientation change
   */
  window.addEventListener('resize', debounce(refresh, options.debounceDelay, true));
  window.addEventListener('orientationchange', debounce(refresh, options.debounceDelay, true));

  /**
   * Handle scroll event to animate elements on scroll
   */
  window.addEventListener('scroll', throttle(() => {
    handleScroll($aosElements, options.once);
  }, options.throttleDelay));

  /**
   * Observe [aos] elements
   * If something is loaded by AJAX
   * it'll refresh plugin automatically
   */
  if (!options.disableMutationObserver) {
    observer.ready('[data-aos]', refreshHard);
  }

  return $aosElements;
};
```

以上最重要的就是`handleScroll`这个方法了， 通过`throttle`函数控制出发频率

```js
const setState = function (el, top, once) {
  const attrOnce = el.node.getAttribute('data-aos-once');
  // 通过计算滚动条的滚动距离 和 元素位置做对比
  if (top > el.position) {
    el.node.classList.add('aos-animate');
  } else if (typeof attrOnce !== 'undefined') {
    if (attrOnce === 'false' || (!once && attrOnce !== 'true')) {
      el.node.classList.remove('aos-animate');
    }
  }
};


const handleScroll = function ($elements, once) {
  const scrollTop = window.pageYOffset;
  const windowHeight = window.innerHeight;
  
  // 遍历， 通过控制class样式来控制动画
  $elements.forEach((el, i) => {
    setState(el, windowHeight + scrollTop, once);
  });
};
```

这里有一段

```js
if (!options.disableMutationObserver) {
    observer.ready('[data-aos]', refreshHard);
}
```

看看这个`observer.ready`具体做了些什么

```js
function ready(selector, fn) {
  const doc = window.document;
  const MutationObserver = getMutationObserver();

  const observer = new MutationObserver(check);
  callback = fn;

  observer.observe(doc.documentElement, {
    childList: true,
    subtree: true,
    removedNodes: true
  });
}
```

可以看到内部的实现就是用`new MutationObsever`来监听dom元素的变化，这里是兼容如果dom元素是异步生成的，就会强制刷新dom元素上的动画属性


## 常见问题

1. 一些情况下禁用AOS动画

[https://github.com/michalsnik/aos/issues/646#issuecomment-861782982](https://github.com/michalsnik/aos/issues/646#issuecomment-861782982)

```js
AOS.init({
  disable: window.innerWidth < 768,
  ...
});
```
> When you set the 'disable' prop it seems AOS will add pointer-events: none and opacity: 0 to your data-aos=* elements, so you need to overwrite the AOS styles in a media query.


```css
@media screen and (max-width: 768px) {
  [data-aos] {
    pointer-events: auto !important;
  }

  html:not(.no-js) [data-aos^=fade][data-aos^=fade] {
    opacity: 1 !important;
  }

  html:not(.no-js) [data-aos=fade-up] {
    transform: none !important;
  }
}
```


