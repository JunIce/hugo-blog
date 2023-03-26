---
title: "MSE -- MediaSource 的前端使用"
date: 2023-03-25T20:31:50+08:00
tags: ["MediaSource", "SourceBuffer"]
categories: ["js"]
draft: false
---



## Media Source Extensions



Media Source Extensions，缩写 **MSE** https://w3c.github.io/media-source/



平时我们开发中加入视频或者音频，都是使用video、audio组件，附加一个src属性

这种形式开发一般的没有问题，但是如果要做到动态改变清晰度、动态增加视频广告、等等的功能，就做不了了



看看b站

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b597cd4a5c24d3185628d20fbb500b7~tplv-k3u1fbpfcp-watermark.image?)



是一个blob url

平时在开发的时候，也遇到过blob url的情况

`URL.createObjectURL`最终返回的也是一个blob url

```js
 const blob = URL.createObjectURL(file.value.files[0]);
```



右键打开，啥也没有

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d42edd0292bd4ba4905a624557bf5d57~tplv-k3u1fbpfcp-watermark.image?)





这里就用到`MediaSource`了



### 原理



具体的内部实现我也不理解，这里给一个官方的原理图





![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e5cc0472faa40de960f9ed93fcac489~tplv-k3u1fbpfcp-watermark.image?)



### 实现

已知我们有个按钮按一下，需要播放对应音频



用vue3写一个demo

```js
const audioRef = ref(document.createElement("audio"));
const mediaSource = new MediaSource();

onMounted(() => {
  audioRef.value.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener("sourceopen", onSourceOpen);
});
function onSourceOpen() {
      //
}
```



这里在mounted之后在进行监听回调



**sourceBuffer**

声明一个全局变量`sourceBuffer`

```js
let sourceBuffer

const mimeCodec = 'audio/mpeg'

function onSourceOpen() {
    //
    sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    sourceBuffer.addEventListener("updateend", function (_) {
      // ...

      console.log(mediaSource.readyState); // ended
    });
    sourceBuffer.addEventListener("error", function (error) {
      console.log(error);
    });
}

```

只有在`mediaSource`状态是`open`的情况下才能调用`addSourceBuffer`方法



**mimeCodec**这里定义的是`audio/mpeg`, 具体依情况来设定

https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types



模版中声明一个button, 并写出对应的play方法

```vue
<template>
  <button @click="play">play</button>
</template>
```



play执行时我们获取远程的音频文件

```js
function play(){
  fetch("http://127.0.0.1:8081/1111.mp3", {})
    .then((res) => {
      console.log("res", res);

    });
}
```



在获取到流文件的时候，我们需要加入到`sourceBuffer`中，`sourceBuffer`有个`appendBuffer`方法

需要加入`ArrayBuffer`格式的返回



fetch重新写一下

```js
fetch("http://127.0.0.1:8081/1111.mp3", {})
      .then((res) => res.arrayBuffer())
      .then((res) => {
        sourceBuffer.appendBuffer(res);
      });
```



在sourceBuffer添加完毕的时候播放音频

```js
sourceBuffer.addEventListener("updateend", function (_) {
        mediaSource.endOfStream();
        audioRef.value.play();
});
```



`mediaSource.endOfStream`方法用于结束当前`mediaSource`，表示流已经结束，不再添加数据



### codecs

codecs时媒体源的编码格式，视频中mp4和avi肯定不是一个格式，音频中mp3和ogg等也不是一个编码格式



https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter



这里会出现格式不支持的情况，但是直接使用文件url的时候又可以

MSE中支持的格式和直接播放时支持的格式会不一样，可能MSE作为一个扩展，有版权问题吧



### 全部代码

```vue
<template>
  <div>
    <!-- <audio ref="audioRef"></audio> -->
    <button @click="play">play</button>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
  name: "DemoInput",
  setup() {
    const audioRef = ref(document.createElement("audio"));

    const mediaSource = new MediaSource();
    let mimeCodec = `audio/mpeg`;

    onMounted(() => {
      audioRef.value.muted = true;
      audioRef.value.autoplay = true;
      audioRef.value.controls = true;
      audioRef.value.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener("sourceopen", onSourceOpen);
    });

    const getRemoteFile = () => {
      const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

      fetch("http://127.0.0.1:8081/1111.mp3", {})
        .then((res) => res.arrayBuffer())
        .then((res) => {
          console.log("res", res);
          sourceBuffer.addEventListener("updateend", function (_) {
            mediaSource.endOfStream();

            audioRef.value.play();
            audioRef.value.muted = false;

            console.log(mediaSource.readyState); // ended
          });
          sourceBuffer.addEventListener("error", function (error) {
            console.log(error);
          });

          sourceBuffer.appendBuffer(res);
        });
    };

    function play() {
      getRemoteFile();
    }

    function onSourceOpen() {
      //
    }

    return {
      audioRef,
      play,
    };
  },
});
</script>

```





## References



https://w3c.github.io/media-source/

https://developer.mozilla.org/en-US/docs/Web/API/MediaSource

https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer

https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

https://joshuatz.com/posts/2020/appending-videos-in-javascript-with-mediasource-buffers/

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#response_objects









## Issues



#### 1. play() failed because the user didn't interact with the document first



代码中不能出现加载页面后直接播放的逻辑，浏览器防止开发者打断用户，需要用户进行手动操作播放，除非设置媒体实例为muted = true时，可以播放

https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide





#### 2. Failed to execute 'appendBuffer' on 'SourceBuffer': Overload resolution failed.



buffer格式不对



https://stackoverflow.com/questions/71488781/uncaught-typeerror-failed-to-execute-appendbuffer-on-sourcebuffer-overload



