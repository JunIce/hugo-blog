---
title: "yarn 问题搜集"
date: 2022-07-30T15:47:33+08:00
tags: ["yarn", "issues"]
categories: ["npm", "issues"]
draft: false
---





### yarn install 报错：  [ERR_STREAM_PREMATURE_CLOSE]: Premature close

```shell
➤ YN0001: │ Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close
    at new NodeError (node:internal/errors:371:5)
    at PassThrough.onclose (node:internal/streams/end-of-stream:136:30)
    at PassThrough.emit (node:events:526:28)
    at emitCloseNT (node:internal/streams/destroy:145:10)
    at processTicksAndRejections (node:internal/process/task_queues:82:21)
```



**方案**

1. it has been fixed in latest yarn, so please upgrade: `yarn set version latest`.
2. As v17 is not a lts, please use node v16/v14 in production (`node:latest` => `node:lts`).