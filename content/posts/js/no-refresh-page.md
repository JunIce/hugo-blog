---
title: "防抖与节流"
date: 2021-10-12T15:16:45+08:00
draft: false
---

## no-refresh-page

>  history.pushState(
>    {},
>    null,
>    this.$route.path + '#' + encodeURIComponent(params)
>  )