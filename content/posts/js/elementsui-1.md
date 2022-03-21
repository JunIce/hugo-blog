---
title: "vue -- elementsUi 中使用echarts 绘制中国地图"
date: 2022-03-21T20:42:02+08:00
draft: true
---

# 最终效果图

![截屏2020-10-14 上午9.14.52.png](https://upload-images.jianshu.io/upload_images/9403487-fc1af008c4ae6d3b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 1. 安装`vue-echarts`第三方包

- 2. 全局引用
```js
import ECharts from 'vue-echarts'
Vue.component('v-chart', ECharts)
```
- 3. 组件中使用
```vue
<templete>
    <v-chart ref="mapChart" :options="renderOptions"  :autoresize="true"/>
</templete>
<script>
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/map/js/china.js'
export default{
   props: {
      list: {
          type: Array,
          default: () => []
      },
      mapType: {
          type: String,
          default: 'COM'
      },
  },
   computed: {
       renderOptions() {
          return {
            tooltip: {
              show: true,
              formatter: (params) => {
                  if (params.data) {
                      return this.genTooltip(params)
                  }
              }
        },
        series: [
          {
            type: 'map',
            mapType: 'china',
            zoom: 1.1,
            data: this.list.map((item) => this.genChartData(item)),
            label: {
              show: false
            },
            itemStyle: {
              areaColor: '#1D2A3C',
              borderWidth: 1,
              borderColor: '#060A13'
            }
          }
        ]
      }
    },
   },
methods: {
    genChartData(item) {
      const data = {
        ...item,
        itemStyle: {
          areaColor: '#3296E1'
        },
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            areaColor: '#32C7E1'
          }
        }
      }

      if (this.selectItem && item.name === this.selectItem.name) {
        data.itemStyle.areaColor = '#00FAFF'
      }
      return data
    },
    // 自定义tooltip
    genTooltip(params) {
      if (this.mapType === 'COM') {
        return `<div>tooltip1</div>`
      }
      if (this.mapType === 'SUP') {
        return `<div>>tooltip2</div>`
      }
    },
  }
}
</script>
```
