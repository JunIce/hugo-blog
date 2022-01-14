---
title: "百度地图API使用方法 和 配合ArcGIS JS API 使用"
date: 2022-01-14T10:11:09+08:00
draft: true
---

### 百度地图 API 使用方法

- 1. 引入 js sdk

>  <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=your key"></script>

key 的话自己去申请就是了

- 2. 使用

```js

var geolocation = new BMap.Geolocation();
// 开启SDK辅助定位
geolocation.enableSDKLocation();

function getLocation() {
  return new Promise((resolve, reject) => {
    // 原生h5定位服务
    if (navigator.geolocation) {
      // 优先使用浏览器自带的定位功能，申请权限
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("navigator: ", position);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => bdMapGetLocation(resolve, reject),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      bdMapGetLocation(resolve, reject);
    }
  });
}

//百度api SDK辅助定位
function bdMapGetLocation(resolve, reject) {
  geolocation.getCurrentPosition(function (r) {
    if (this.getStatus() == 0) {
      console.log("bdMap: ", r);

      resolve({
        // 纬度
        latitude: r.point.lat,
        // 经度
        longitude: r.point.lng,
      });
    } else {
      reject("定位失败，请稍后重试");
    }
  });
}
```


- 3. 使用

```js
getLocation().then(({ latitude, longititude }) => {
  // 自己的业务
})
```

### 配合 ArcGIS JS API 使用


`ArcGIS` 业务中肯定经常会用到定位功能，自带的定位感觉不太行， 毕竟是国外的东西，国内要落地还是本土化的产品更接地气，百度应该获取个经纬度问题不大吧。


- 业务代码

这里以 `v4`版本为例

```js

let view = new MapView({
  // ...
})

getLocation().then((res) => {
  // 这里会自动移动到指定位置
  view.goTo({
    // 中心点
    center: new Point({
      latitude: res.latitude,
      longititude: res.longititude
    }),
    // 缩放
    zoom: 13
  })

  //
  // 加上定位标志。。
  // 加上你的业务
})

```

## 完毕

