---
title: "fetch RequestStreams"
date: 2023-11-25T08:08:24+08:00
draft: true
tags: ["fetch RequestStreams", "fetch"]
categories: ["js"]
---



# RequestStreams

```ts
const supportsRequestStreams = (() => {
  let duplexAccessed = false;

  const hasContentType = new Request('', {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
})();

if (supportsRequestStreams) {
  // …
} else {
  // …
}
```


## References
[https://developer.chrome.com/articles/fetch-streaming-requests/#feature-detection](https://developer.chrome.com/articles/fetch-streaming-requests/#feature-detection)