
---
title: command ab
date: 2021-10-19T13:41:27+08:00
draft: true
---

## ab

```bash
ab参数翻译如下：-n 即requests，用于指定压力测试/总请求数。
-c 即concurrency，用于指定压力测试的并发数。
-t 即timelimit，测试执行最大秒数，它可以让测试限制在一个固定的总时间以内，默认值为50000。
-s 即timeout，请求最大等待时长，默认30s
-b 即windowsize，TCP发送/接收的缓冲大小(单位：字节)。
-p 即postfile，发送POST请求时需要上传的文件，文件格式如"p1=1&p2=2"。使用方法是 -p 123.txt 。 （配合-T）
-u 即putfile，发送PUT请求时需要上传的文件。（配合-T）
-T 即content-type，用于设置Content-Type请求头信息，如 -T "application/x-www-form-urlencoded”，默认值为text/plain。（配合-p）
-v 即verbosity，设置显示信息的详细程度 – 4或更大值会显示头信息， 3或更大值可以显示响应代码(404, 200等), 2或更大值可以显示警告和其他信息。
-w 以HTML表格形式打印结果。
-i 使用HEAD请求代替GET请求。
-x 插入字符串作为table标签的属性。
-y 插入字符串作为tr标签的属性。
-z 插入字符串作为td标签的属性。
-C 添加cookie信息，例如："Apache=1234"。此参数可以重复，用逗号分割。提示：可以借助session实现原理传递 JSESSIONID参数， 实现保持会话的功能，如-C "c1=1234,c2=2,c3=3, JSESSIONID=FF056CD16DA9D71CB131C1D56F0319F8"。
-H 添加任意的请求头，例如："Accept-Encoding: gzip"，请求头将会添加在现有的多个请求头之后(可以重复该参数选项以添加多个)。
-A 添加一个基本的网络认证信息，用户名和密码之间用英文冒号隔开。
-P 添加一个基本的代理认证信息，用户名和密码之间用英文冒号隔开。如-P proxy-auth-username:password
-X 指定使用的代理服务器和端口号，例如:"126.10.10.3:88"。
-V 显示版本号并退出。
-k 使用HTTP的KeepAlive特性。
-d 不显示百分比。
-S 不显示预估和警告信息。
-q 超过150个请求后不显示进度
-l 接受可变文档长度（用于动态页面）
-g filename 输出结果信息到gnuplot格式的文件中。
-e filename 输出结果信息到CSV格式的文件中。
-r 指定接收到错误信息时不退出程序。
-m method 方法名
-h 帮助
```


> ab -n 10000 -c 50 -C ww_token=4e82e7102baec028586a05c512e9b969 -p "put.txt" -T "multipart/form-data; boundary=----WebKitFormBoundaryCICCZksMPABLeATX"  https://voice-maker-pre.mobvoi.com/apis/tts-web-api/v1/articles/426687
