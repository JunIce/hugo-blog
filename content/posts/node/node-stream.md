---
title: "nodejs -- stream"
date: 2022-04-19T08:56:39+08:00
draft: true
categories: ["node"]
---





# node stream



## 什么是stream



`stream`是用来读写文件、网络通信、端到端的有效数据交换方式。

`stream`的数据格式类似一个数组或者字符串，读或写时依次进行处理



## 为什么是stream



`stream`不像是传统的读写文件的形式，把整个文件读到内存中再进行操作，而是把大文件进行拆分读取，每读取一部分就触发监听函数进行处理

可以充分利用内存，提高时间效率



## Stream Types



node中的流有四种

1. Readable 可读流（fs.createReadStream）
2. Writable 可写流 (fs.createWriteStream)
3. Duplex 混合流，包括可读可写流 (TCP socket)
4. Transform streams 可转换流 



| Readable Stream                 | Writable Stream                |
| ------------------------------- | ------------------------------ |
| HTTP responses, on the client   | HTTP requests, on the client   |
| HTTP responses, on the server   | HTTP requests, on the server   |
| fs read streams                 | fs write streams               |
| zlib streams                    | zlib streams                   |
| crypto streams                  | crypto streams                 |
| TCP sockets                     | TCP sockets                    |
| child process stdout and stderr | child process stdin            |
| process.stdin                   | process.stdout, process.stderr |



## Readable Streams



```typescript
const Stream = require('stream')
const reader = Stream.Readable()

reader.push("hello")
reader.push("world")
```



可读流包括两种模式

1. **paused mode**
2. **flowing mode**



### paused mode



暂停模式下， 只能通过调用监听`readable`事件，手动触发`read`方法调用获取流的数据



```js
var fs = require('fs');
var readableStream = fs.createReadStream('file.txt');
var data = '';
var chunk;

readableStream.on('readable', function() {
    while ((chunk=readableStream.read()) != null) {
        data += chunk;
    }
});

readableStream.on('end', function() {
    console.log(data)
});
```



### flowing mode



流动模式下，需要监听流的`data`事件



```js
var fs = require("fs");
var data = '';

var readerStream = fs.createReadStream('file.txt'); //Create a readable stream

readerStream.setEncoding('UTF8'); // Set the encoding to be utf8. 

// Handle stream events --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function() {
   console.log(data);
});

readerStream.on('error', function(err) {
   console.log(err.stack);
});

console.log("Program Ended");
```



### paused  、flowing相互切换

###  

`paused mode` 切换为`flowing mode`的几种方式

1. 添加on `data`事件回调
2. 调用`stream.resume()`方法
3. 调用`stream.pipe()`方法把数据管道到写入流中



`flowing mode` 切换为`paused mode`的几种方式

1. 如果没有任何管道对象， 调用`stream.pause()`方法
2. 如果有管道对象，移除掉所有的管道对象。 即调用`stream.unpipe()`方法



## Writable Stream



可写流



```js
fs.createWriteStream(filePath)
```



```js
const fs = require('fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
```



当调用`end`方法时，表示没有更多数据写入了，同时会触发流的监听`finish`事件



### 迭代器



```typescript
import * as util from 'util';
import * as stream from 'stream';
import * as fs from 'fs';
import {once} from 'events';

const finished = util.promisify(stream.finished); // (A)

async function writeIterableToFile(iterable, filePath) {
  const writable = fs.createWriteStream(filePath, {encoding: 'utf8'});
  for await (const chunk of iterable) {
    if (!writable.write(chunk)) { // (B)
      // Handle backpressure
      await once(writable, 'drain');
    }
  }
  writable.end(); // (C)
  // Wait until done. Throws if there are errors.
  await finished(writable);
}

await writeIterableToFile(
  ['One', ' line of text.\n'], 'tmp/log.txt');
assert.equal(
  fs.readFileSync('tmp/log.txt', {encoding: 'utf8'}),
  'One line of text.\n');
```





## pipeline



`pipeline`是node `v10`中的一个方法，可以管道式的处理流数据



```typescript
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.
// A pipeline to gzip a potentially huge video file efficiently:

pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```



用`pipeline`替换`pipe`， 因为`pipe`是不安全的





