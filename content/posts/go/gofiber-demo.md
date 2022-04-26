---
title: "gofiber 开发demo"
date: 2022-04-22T20:59:54+08:00
draft: true

---





# gofiber





## 初始化



初始搭建服务器， 其实引入以后`New`一个就可以实现



```go
func main() {

	app := fiber.New()
	
	// Middlewares
	app.Use()
    
    app.Get("/api", func(c *fiber.Ctx) error{
        // business
    })
    
    app.Listen(":3000")
	
}
```









## 获取Get方法参数



```go
app.Get("/api/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		return c.JSON(fiber.Map{
			"id":   id,
			"name": "jack",
		})
})
```





## 获取上传文件



### 单文件上传

可以使用`ctx.FormFile`方法获取文件



```go
app.Post("/upload", func(c *fiber.Ctx) error {
		file, _ := c.FormFile("file")

		fmt.Println(file.Filename)
		return c.SaveFile(file, fmt.Sprintf("./upload/%s", file.Filename))
})
```



### 多文件上传

用`MultipartForm`来接收文件，其实内部是使用`fasthttp.MultipartForm`来实现的



```go
app.Post("/mutilfile", func(c *fiber.Ctx) error {
		form, _ := c.MultipartForm()

		files := form.File["files"]

		for _, file := range files {
			fmt.Println(file.Filename)
			c.SaveFile(file, fmt.Sprintf("./upload/%s", file.Filename))
		}

		return c.SendString("ok")
})
```





## 获取cookie



`Cookies`方法获取相对应的`cookie`， 第2个参数其实是默认值



```go
app.Get("/getCookie", func(c *fiber.Ctx) error {

    token := c.Cookies("token", "12345")

    fmt.Println(token)

    return nil
})

```





## 获取`formData`数据



通过`ctx.FormValue(key)`获取单个值



```go
app.Post("/getformdata", func(c *fiber.Ctx) error {

    name := c.FormValue("name")
    value := c.FormValue("value")

    return c.JSON(fiber.Map{
        "name":  name,
        "value": value,
    })
})
```



## 404路由拦截



```go
// 404 Handler
app.Use(func(c *fiber.Ctx) error {
    return c.SendStatus(404) // => 404 "Not Found"
})
```



或者就是用*匹配



```go
app.Get("/*", func(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{
        "error": -1,
    })
})
```





