---
title: "ArcGIS Js V4 -- 字体下载"
date: 2022-01-19T20:13:50+08:00
draft: true
categories: ["ArcGIS"]
---

# 字体

正常我们在开发`ArcGIS Javascript`应用的时候，都会把 js 部署在本地服务器上，
但是我们在使用像`FeatureLayer`的时候，`label`属性会去`https://static.arcgis.com`下载字体

因为字体服务器是在国外，所以下载也很慢，这里我们把字体下载到本地服务器进行部署

### 已有的字体资源

| family           | weight | ESRI 命名规范             |
| :--------------- | :----: | :----------------------- |
| family           | weight | ESRI 命名规范              |
| sans-serif       | normal | arial-unicode-ms-regular |
| sans-serif       |  bold  | arial-unicode-ms-bold    |
| serif            | normal | noto-serif-regular       |
| serif            |  bold  | noto-serif-bold          |
| Playfair Display | normal | playfair-display-regular |
| Playfair Display |  bold  | playfair-display-bold    |
| Microsoft YaHei  | normal | microsoft-yahei-regular  |
| Microsoft YaHei  |  bold  | microsoft-yahei-bold     |
| SimSun           | normal | simsun-regular           |
| SimSun           |  bold  | simsun-bold              |

### 下载

以`arial-unicode-ms-regular`为例

这是最终下载链接例子

> https://static.arcgis.com/fonts/arial-unicode-ms-regular/0-255.pbf

```js
for (let i = 0; i <= 256; i++) {
  let start = i * 256;
  let end = (i + 1) * 256 - 1;

  let fileName = `https://static.arcgis.com/fonts/arial-unicode-ms-regular/${start}-${end}.pbf`;
  // download logic
}
```

这里我们可以用`node.js`分文件夹下载

```js
const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");

const baseUrl = "https://static.arcgis.com/fonts";

const fontFamilyConfig = [
  "arial-unicode-ms",
  "noto-serif",
  "Playfair Display",
  "Microsoft YaHei",
  "SimSun",
];

const saveDir = path.resolve(__dirname, "./fonts");

// 发起请求
function doRequest(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        res.on("data", (data) => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// 数据写入文件
function saveDataToFile(filePath, data) {
  let pathResult = path.parse(filePath);

  fs.mkdir(pathResult.dir, { recursive: true }, (err) => {
    if (err) {
      console.log("create dir error", err);
      return;
    }

    fs.access(filePath, (err) => {
      // 文件不存在
      if (err) {
        // 写入文件
        fs.writeFile(filePath, data, (err) => {
          if (err) throw err;
          console.log("save file success");
        });
      }
    });
  });
}

const queue = [];
let familys = fontFamilyConfig.map((item) =>
  item.toLowerCase().replace(" ", "-")
);

familys.forEach((f) => {
  let normal = `${f}-regular`;
  let bold = `${f}-bold`;
  loopFileFamily(normal);
  loopFileFamily(bold);
});

function loopFileFamily(family) {
  let familyDir = path.resolve(saveDir, `./${family}`);
  for (let i = 0; i < 257; i++) {
    let start = i * 256;
    let end = (i + 1) * 256 - 1;

    let name = `${start}-${end}`;

    let filePath = path.format({
      dir: familyDir,
      name: name,
      ext: ".pbf",
    });
    let url = `${baseUrl}/${family}/${name}.pbf`;
    queue.push({
      url,
      filePath,
      fn: requestItem(url, filePath),
    });
  }
}

function flush() {
  queue.forEach((item) => {
    item.fn();
  });
}

flush();

function requestItem(url, filepath) {
  return (fn) => {
    // 判断是否存在
    fs.access(filepath, fs.constants.F_OK, (err) => {
      // 不存在
      if (err) {
        doRequest(url).then((res) => {
          saveDataToFile(filepath, res, fn);
        });
      }
    });
  };
}
```

这里有个[`gitee`](https://gitee.com/volcanoss/arc-gis-fonts) 下载地址
