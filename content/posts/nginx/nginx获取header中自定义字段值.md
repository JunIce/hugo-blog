---
title: "nginx获取header中自定义字段值"
date: 2024-07-22T09:56:39+08:00
draft: true
tags: ["nginx"]
categories: ["nginx"]
---



# nginx获取header中自定义字段值



Nginx 使用 `$http_` 前缀加上字段名的小写形式来引用 HTTP 请求头中的字段。如果字段包含非字母数字字符，你需要使用下划线 `_` 替换它们



假设你有一个自定义的请求头 `X-Custom-Header`，你可以在 Nginx 的配置文件中使用 `$http_x_custom_header` 来引用它。



```conf
http {
    server {
        listen       80;
        server_name  example.com;

        location / {
            # 从请求头中获取 X-Custom-Header 的值
            set $custom_header $http_x_custom_header;

            # 根据 $custom_header 的值进行不同的处理
            if ($custom_header ~* "some_value") {
                return 200 "Custom header matched.";
            }

            # 如果自定义头部不存在或不匹配，则返回默认响应
            return 200 "Default response.";
        }
    }
}
```



使用了 `set` 指令来将 `$http_x_custom_header` 的值赋给一个名为 `$custom_header` 的变量



```nginx
http {
    map $http_x_custom_header $custom_response {
        "special_value" "Special response";
        default         "Default response";
    }

    server {
        listen       80;
        server_name  example.com;

        location / {
            return $custom_response;
        }
    }
}
```

