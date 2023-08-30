---
title: "鼠标事件判断 单击还是双击"
date: 2023-08-30T14:15:10+08:00
draft: true
tags: ["js"]
---



### 鼠标事件判断 单击还是双击

通过`event.detail`去判断单双击


```javascript
element.onclick = event => {
   if (event.detail === 1) {
     // it was a single click
   } else if (event.detail === 2) {
     // it was a double click
   }
};
```


### jq模拟事件
```javascript
jQuery.fn.single_double_click = function(single_click_callback, double_click_callback, timeout) {
  return this.each(function(){
    var clicks = 0, self = this;
    jQuery(this).click(function(event){
      clicks++;
      if (clicks == 1) {
        setTimeout(function(){
          if(clicks == 1) {
            single_click_callback.call(self, event);
          } else {
            double_click_callback.call(self, event);
          }
          clicks = 0;
        }, timeout || 300);
      }
    });
  });
}
```


## References

[https://stackoverflow.com/questions/5497073/how-to-differentiate-single-click-event-and-double-click-event](https://stackoverflow.com/questions/5497073/how-to-differentiate-single-click-event-and-double-click-event)