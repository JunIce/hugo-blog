---
title: "小程序 -- 内部使用webview绑定微信公众号openId"
date: 2023-04-12T16:39:17+08:00
tags: ["小程序", "openId"]
categories: ["小程序"]
draft: false
---









# 小程序 -- 内部使用webview绑定微信公众号openId



### 小程序内部



```vue
<template>
	<web-view :src="url"></web-view>
</template>
<script setup>
    // 最后路径
const url = computed(() => `${baseURL}/chat-list?token=${userStore.switchToken}&officialIsBind=${official.value}&schema=${userStore.schema}&userInfo=${JSON.stringify(userStore.wxUserInfo)}`)
</script>
```



### h5内部



```js

router.beforeEach(() => {
    if(query.officialIsBind === 'false') {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa40d62540ee5255f&redirect_uri=http://xxxxxxxxxx/login&response_type=code&scope=snsapi_base&connect_redirect=1#wechat_redirect`
    }
})

```



这里`redirect_uri`要设置另外一个页面，比如说login

微信会在回调时调用这个login页面



> /login?code=xxxxx&state=xxxx



这里code是微信回调的，state可以在上面这个链接中附带，128个字节



在login页面调用后端接口绑定小程序和公众号两边的openId
