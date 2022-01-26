---
title: "ArcGIS -- 结合 百度坐标系 转换到 WGS84坐标"
date: 2022-01-25T20:29:00+08:00
draft: true
tags: ["Javascript", "ArcGIS", "ArcGIS-V4"]
categories: ["ArcGIS"]
---

## 地球坐标 (WGS84)

- 国际标准，从 GPS 设备中取出的数据的坐标系
- 国际地图提供商使用的坐标系

## 火星坐标 (GCJ-02)也叫国测局坐标系

- 中国标准，从国行移动设备中定位获取的坐标数据使用这个坐标系
- 国家规定： 国内出版的各种地图系统（包括电子形式），必须至少采用 GCJ-02 对地理位置进行首次加密。

## 百度坐标 (BD-09)

- 百度标准，百度 SDK，百度地图，Geocoding 使用
- (本来就乱了，百度又在火星坐标上来个二次加密)

### 转换类库

这是原作者的[https://github.com/wandergis/coordtransform](https://github.com/wandergis/coordtransform)

```js
/**
 * 提供了百度坐标（BD-09）、国测局坐标（火星坐标，GCJ-02）、和 WGS-84 坐标系之间的转换
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.coordtransform = factory();
  }
})(this, function () {
  // 定义一些常量
  var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lng
   * @param bd_lat
   * @returns {*[]}
   */
  var bd09togcj02 = function bd09togcj02(bd_lng, bd_lat) {
    var bd_lng = +bd_lng;
    var bd_lat = +bd_lat;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
  };

  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即 谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  var gcj02tobd09 = function gcj02tobd09(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
  };

  /**
   * WGS-84 转 GCJ-02
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  var wgs84togcj02 = function wgs84togcj02(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    if (out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat];
    }
  };

  /**
   * GCJ-02 转换为 WGS-84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  var gcj02towgs84 = function gcj02towgs84(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    if (out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat];
    }
  };

  var transformlat = function transformlat(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret =
      -100.0 +
      2.0 * lng +
      3.0 * lat +
      0.2 * lat * lat +
      0.1 * lng * lat +
      0.2 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((lat / 12.0) * PI) +
        320 * Math.sin((lat * PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  };

  var transformlng = function transformlng(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret =
      300.0 +
      lng +
      2.0 * lat +
      0.1 * lng * lng +
      0.1 * lng * lat +
      0.1 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((lng / 12.0) * PI) +
        300.0 * Math.sin((lng / 30.0) * PI)) *
        2.0) /
      3.0;
    return ret;
  };

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  var out_of_china = function out_of_china(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    // 纬度 3.86~53.55, 经度 73.66~135.05
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  };

  return {
    bd09togcj02: bd09togcj02,
    gcj02tobd09: gcj02tobd09,
    wgs84togcj02: wgs84togcj02,
    gcj02towgs84: gcj02towgs84,
  };
});
```

### 结合 MapView 使用

```js
var geolocation = new BMapGL.Geolocation();
// 开启SDK辅助定位
geolocation.enableSDKLocation();

function getLocation() {
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == 0) {
        let [longitude, latitude] = coordtransform.bd09togcj02(
          r.point.lng,
          r.point.lat
        );
        console.log("bdMap: ", r, longitude, latitude);
        resolve({
          longitude: longitude,
          latitude: latitude,
        });
      } else {
        reject("定位失败，请稍后重试");
      }
    });
  });
}

// ...
// ...
// ...
// ...

const view = new MapView({
  // ....
});

view.watch("ready", function () {
  // 定位
  getLocation().then((res) => {
    // 自定义图标
    let imageMaker = new Graphic({
      symbol: {
        type: "picture-marker",
        url: "./images/location.png",
        width: "26px",
        height: "26px",
      },
      geometry: {
        type: "point",
        longitude: res.longitude,
        latitude: res.latitude,
      },
    });
    // 添加图标到图层
    view.graphics.add(imageMaker);
    // 移动到中心
    view.goTo({
      target: imageMaker,
      zoom: 13,
    });
  });
});
```
