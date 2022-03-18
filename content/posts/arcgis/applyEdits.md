---
title: "ArcGIS Js -- 操作Features"
date: 2022-03-18T20:13:50+08:00
draft: true
categories: ["ArcGIS"]
---


## 操作Features


### URL

`{layerUrl}/applyEdits`

### Methods

`POST`

### 请求体

```json
{
	"content-type": "application/www-form-urlencoded"
}
```

### body

```json
{
	"f": "json", // 写死传值json
	
	"adds": Array[], // 新增
	"updates": Array[], // 更新
	"deletes": String // 删除 2595,2596
}
```



### 数据格式： 

### 新增点

```json
    {
        "geometry": {
            "longitude": 120.81058692, // 经度
            "latitude": 32.01200913, // 纬度
            "spatialReference": {
                "wkid": 4490 // 写死4490, spatialReference一定要有
            }
        },
        "attributes": { // 表单
        }
    }

```

###  新增线

```json
// paths为一个三层的数组
[
    {
        "geometry": {
            "paths": [
                [	// 前面是经度，后面是纬度
                    [120.7846656075014, 31.98790163651901], // 起点经纬度
                    [120.80311569266851, 31.9625241911791] // 终点经纬度
                ]
            ],
            "spatialReference": {
                "wkid": 4490
            }
        },
        "attributes": {
        }
    }
]
```



### 更新

更新属性不需要`geometry`，直接传入`attributes`, 其中一定要有`OBJECTID` **大写**

```json
{
        "attributes": {
            "OBJECTID": 152, // 必传的属性
        }
    }
```



### 删除

`deletes`传入`objectId`， 多个中间用逗号分割

