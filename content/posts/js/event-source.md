---
title: "EventSource"
date: 2023-06-21T09:39:16+08:00
draft: false
tags: ["eventsource", "服务端推送"]
categories: ["js"]
---



# Eventsource单向服务端推送





单向服务端推送



## 服务端部分

服务端需要设置返回头

```js
"Content-Type": "text/event-stream"
```



```javascript
const { createReadStream, createWriteStream } = require("fs")
const { createServer } = require("http")

const sendInterval = 2000

createServer((req, res) => {
  if (req.url === "/") {
    return createReadStream("./index.html").pipe(res)
  }
  if (req.url.indexOf("/chat") == 0) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    })

    setInterval(function () {
      writeServerSendEvent(res, new Date().toLocaleTimeString())
    }, sendInterval)

    writeServerSendEvent(res, new Date().toLocaleTimeString())
  }
}).listen(3011, () => {
  console.log("listening on http://localhost:3011")
})
function writeServerSendEvent(res, data) {
  res.write("data: " + data + "\n\n")
}
```







## 前端部分



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <pre id="code"></pre>
    <script>

        const code = document.querySelector('#code')

        const source = new EventSource("http://localhost:3011/chat", {withCredentials: true});

        source.addEventListener("message", (e) => {
            code.innerHTML = e.data
        })

        source.addEventListener("error", () => {
            console.log('on error');
        })
    </script>
</body>
</html>
```



