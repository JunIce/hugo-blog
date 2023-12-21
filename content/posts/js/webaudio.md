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





### AnalyserNode

https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

可以获得实时频率和时域分析，它不会改变输入输出的音频流，你可以获取生存音频可视化



#### fftSize

无符号值。必须是2^5和2^15之间的2的幂，为以下数字之一：32、64、128、256、512、1024、2048、4096、8192、16384和32768。默认2048



#### frequencyBinCount

只读属性，为fftSize的一半，因此是16、32、64、128、256、512、1024、2048、4096、8192和16384之一。



#### maxDecibels

最大分贝。音频默认最大分贝，默认30db，超出最大分贝时，getByteFrequencyData就会返回255

默认值`-30`



#### minDecibels

最小分贝。默认`-100`dB，当小于最小分贝时，返回0



#### smoothingTimeConstant

浮点数表示最新分析的帧的平均值。默认是0.8，范围0-1
