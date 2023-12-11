---
title: canvas 播放视频demo
date: 2023-12-11T13:41:27+08:00
draft: true
tags: ["canvas"]
categories: ["canvas"]
---


# canvas 播放视频demo

```tsx
import { ChangeEvent, useEffect, useRef } from 'react'

function VideoContainer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const fileRef = useRef<File | null>(null)

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      fileRef.current = e.target?.files?.[0]
    }
  }

  const handlePlay = () => {
    const video = document.createElement('video')
    video.src = URL.createObjectURL(fileRef.current!)
    video.addEventListener('play', draw)
    video.addEventListener(
      'loadedmetadata',
      function () {
        const width = this.videoWidth,
          height = this.videoHeight
        if (canvasRef.current) {
          canvasRef.current.width = width
          canvasRef.current.height = height
        }
      },
      false
    )
    videoRef.current = video
    video.play()
  }

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current?.getContext('2d')
    }
  }, [])

  const draw = () => {
    if (!videoRef.current) return
    if (!canvasRef.current) return
    ctxRef.current?.clearRect(
      0,
      0,
      canvasRef.current?.width,
      canvasRef.current?.height
    )

    const scale = 1
    const vidH = videoRef.current?.videoHeight
    const vidW = videoRef.current?.videoWidth
    const top = canvasRef.current?.height / 2 - (vidH / 2) * scale
    const left = canvasRef.current?.width / 2 - (vidW / 2) * scale

    ctxRef.current?.drawImage(
      videoRef.current,
      left,
      top,
      vidW * scale,
      vidH * scale
    )

    requestAnimationFrame(draw)
  }

  return (
    <div className="relative overflow-hidden bg-white">
      <input type="file" onChange={handleOnChange} accept="media/*" />
      <button onClick={handlePlay}>play</button>
      <canvas ref={canvasRef} className="h-[660px] w-[1000px]"></canvas>
    </div>
  )
}

export default VideoContainer

```


## References

[https://stackoverflow.com/questions/4429440/html5-display-video-inside-canvas](https://stackoverflow.com/questions/4429440/html5-display-video-inside-canvas)