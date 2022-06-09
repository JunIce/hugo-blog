---
title: "vite中env环境变量使用"
date: 2022-06-07T17:31:37+08:00
tags: ["vite", "env"]
categories: ["vite"]
draft: false
---



# vite中env环境变量使用





>   "version": "3.0.0-alpha.9"



vite中可以通过`loadEnv`函数去读取指定环境变量文件，可以方便在vite配置文件中动态的导入到配置中



```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV
    }
  }
})
```



## 源码路径



`packages/vite/src/node/env.ts`



默认会读取这4种类型的文件，都是以.env开头的， 其中后面的文件内容会覆盖前面的文件

```js
  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`
  ]
```



1. **声明一个空变量env，作为最后返回的结果**

2. **遍历process.env上的变量，写入到变量env上**

   ```js
     for (const key in process.env) {
       if (
         prefixes.some((prefix) => key.startsWith(prefix)) &&
         env[key] === undefined
       ) {
         env[key] = process.env[key] as string
       }
     }
   ```

   

3. 遍历读取配置文件上的数据，并且写到环境变量中

   1. 读取到单个文件的路径，并根据路径拿到文件内容
   2. 使用[dotenv](https://www.dotenv.org/get-started)这个第三方包解析
   3. 使用[dotenv-expand](https://www.npmjs.com/package/dotenv-expand)写入到系统环境变量上
   4. 把值写到变量env
   5. 返回env



```js
for (const file of envFiles) {
    const path = lookupFile(envDir, [file], { pathOnly: true, rootDir: envDir })
    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path), {
        debug: process.env.DEBUG?.includes('vite:dotenv') || undefined
      })

      // let environment variables use each other
      dotenvExpand({
        parsed,
        // prevent process.env mutation
        ignoreProcessEnv: true
      } as any)

      // only keys that start with prefix are exposed to client
      for (const [key, value] of Object.entries(parsed)) {
        if (
          prefixes.some((prefix) => key.startsWith(prefix)) &&
          env[key] === undefined
        ) {
          env[key] = value
        } else if (
          key === 'NODE_ENV' &&
          process.env.VITE_USER_NODE_ENV === undefined
        ) {
          // NODE_ENV override in .env file
          process.env.VITE_USER_NODE_ENV = value
        }
      }
    }
  }
```







