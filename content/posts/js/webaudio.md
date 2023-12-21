---
title: "WebAudio笔记"
date: 2023-12-21T08:35:32+08:00
tags: ["webaudio"]
categories: ["js"]
draft: false
---

# WebAudio 笔记

### MediaElementAudioSourceNode

用于传入媒体元素，可以通过代码调整媒体元素播放的参数，和`audioCtx.createMediaElementSource` 行为类似

```ts
const ac = new AudioContext();
const el = document.querySelector('audio')
const s = new MediaElementAudioSourceNode(ac, {
  mediaElement: el,
});
s.connect(ac.destination);
```
