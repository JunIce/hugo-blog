---
title: "Jest config 配置文件参数"
date: 2022-02-18T09:24:09+08:00
draft: true
tags: ["jest"]
---


# jest V27.5

## jest.config.js 

以`ant-design`项目根目录下的 `.jest.js`为例

```js
const transformIgnorePatterns = [
  '/dist/',
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  'node_modules/(?!.*@(babel|ant-design))(?!array-move)[^/]+?/(?!(es|node_modules)/)',
];

function getTestRegex(libDir) {
  if (libDir === 'dist') {
    return 'demo\\.test\\.js$';
  }
  return '.*\\.test\\.(j|t)sx?$';
}

module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  setupFiles: ['./tests/setup.js'],
  setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'],
  modulePathIgnorePatterns: ['/_site/'],
  moduleNameMapper: {
    '^dnd-core$': 'dnd-core/dist/cjs',
    '^react-dnd$': 'react-dnd/dist/cjs',
    '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
    '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
    '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
    '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', 'dekko', 'node', 'image.test.js', 'image.test.ts'],
  transform: {
    '\\.tsx?$': './node_modules/@ant-design/tools/lib/jest/codePreprocessor',
    '\\.(m?)js$': './node_modules/@ant-design/tools/lib/jest/codePreprocessor',
    '\\.md$': './node_modules/@ant-design/tools/lib/jest/demoPreprocessor',
    '\\.(jpg|png|gif|svg)$': './node_modules/@ant-design/tools/lib/jest/imagePreprocessor',
  },
  testRegex: getTestRegex(process.env.LIB_DIR),
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    '!components/*/style/index.tsx',
    '!components/style/index.tsx',
    '!components/*/locale/index.tsx',
    '!components/*/__tests__/type.test.tsx',
    '!components/**/*/interface.{ts,tsx}',
    '!components/*/__tests__/image.test.{ts,tsx}',
  ],
  transformIgnorePatterns,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
  testURL: 'http://localhost',
};
```



## jest.config.js 各项配置详细说明

### automock: `false`

引入的模块自动添加 mock

### bail: 0 [number|boolean]

失败后自动重试的次数， `true`默认为1

### cacheDirectory `/tmp/<path>`

缓存路径

### clearMocks `false`

每次测试之前自动清除模拟调用、实例或者结果

相当于调用`jest.clearAllMocks()`


### collectCoverage `false`

搜集测试覆盖数据，会降低测试速度

### collectCoverageFrom `array`

配置需要搜集的正则

example

```json
{
    "collectCoverFrom": {
        "**/*.{js,jsx}",
        "!**/node_modules/**",
        "!**/vendor/**"
    }
}
```

### coverageDirectory `string`

搜集覆盖的目录

### coveragePathIgnorePatterns `array`

需要忽略的目录正则

### coverageProvider `string`

`babel` or `v8`

### coverageReporters `array | string`

`["clover", "json", "lcov", "text"]`

### coverageThreshold 

覆盖率阈值

```json
{
  ...
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 50,
        "functions": 50,
        "lines": 50,
        "statements": 50
      },
      "./src/components/": {
        "branches": 40,
        "statements": 40
      },
      "./src/reducers/**/*.js": {
        "statements": 90
      },
      "./src/api/very-important-module.js": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  }
}
```

### dependencyExtractor

自定义以来提取器

```js
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
  extract(code, filePath, defaultExtract) {
    const deps = defaultExtract(code, filePath);
    // Scan the file and add dependencies in `deps` (which is a `Set`)
    return deps;
  },
  getCacheKey() {
    return crypto
      .createHash('md5')
      .update(fs.readFileSync(__filename))
      .digest('hex');
  },
};
```

其中`extract`必须返回一个可遍历对象
`getCacheKey` 生成一个唯一的key值用作缓存


### displayName

测试过程中显示的名称

```js
{
    displayName: string
    // or

    displayName: {
        name: string,
        color: string // chalk 去标记颜色
    }
}
```


### errorOnDeprecated

### extensionsToTreatAsEsm 

已esm文件对待的模块

```js
"extensionsToTreatAsEsm": [".ts"]
```

### extraGlobals

全局模块

### forceCoverageMatch

强制覆盖匹配

```json
{
    "forceCoverageMatch": ["**/*.t.js"]
}
```

### globals

全局变量

```json
"globals": {
    "__DEV__": true
}
```


### globalSetup

全局启动文件，可以定义一个全局的配置并且引入

### globalTeardown

测试结束的时候需要释放的变量

### injectGlobals

注入的全局`api`，类似 `expect` `test` `describe` `beforeEach` ...

### maxConcurrency

最大并发数量

### maxWorkers

最大启动works

### moduleDirectories

模块目录

```js
["node_modules"]
```

### moduleFileExtensions

模块文件后缀

```js
["js", "jsx", "ts", "tsx", "json", "node"]
```
### moduleNameMapper 

提供模块名Mapper，清楚资源，类似图片或者css

### modulePathIgnorePatterns

模块忽略正则

### modulePaths `array`

模块数组 ["<rootDir>/app/"]

### notify `false`

测试通知

### notifyMode

通知模式 默认`failure-change`

- always
- failure
- success
- failure
- success-change
- failure-change

### preset 

默认初始配置

根目录下存在以下命名的文件即加载为初始配置文件
`jest-preset.json`、`jest-preset.js`、` jest-preset.cjs`、` jest-preset.mjs`


### prettierPath

代码格式化插件`prettier`

### projects

主项目目录

### reporters

报告脚本


```json
{
  "reporters": ["default", "<rootDir>/my-custom-reporter.js"]
}
```

### resetMocks

每次测试前重置mock， 默认false

### resetModules

重置模块依赖，默认false

### resolver

用户自定义解析器，默认为null


### restoreMocks

每次测试之前 重置mock state

### rootDir

根目录，默认是`package.json`所在的位置

### roots

搜索测试文件所在的根目录

### runner

用户自定义runner

### setupFiles `arrays`

初始配置文件，每个文件只会执行一次

### setupFilesAfterEnv `array`

运行在setupFiles之后，测试运行之前

### slowTestThreshold

默认值5s， 慢测试阈值

### testEnvironment（重要）

运行测试的环境，默认node

如果需要使用dom的api，需要设置为jsdom

### testMatch（重要）

需要匹配的测试文件的正则

> [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]


### testPathIgnorePatterns

测试忽略的正则匹配，默认node_modules


### testRegex

正则匹配

> (/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$


### testTimeout

测试超时配置， 默认5000

### timers

默认时间 `real`

`fake` or `modern`

### transform

文件转换插件

> {"\\.[jt]sx?$": "babel-jest"}

### transformIgnorePatterns

需要忽略转换的正则匹配

> ["/node_modules/", "\\.pnp\\.[^\\\/]+$"]

### unmockedModulePathPatterns



### verbose

默认false， 是否显示单个测试的测试结果


### watchman

默认true， 监听文件改动

### watchPlugins

监听插件

### watchPathIgnorePatterns

监听忽略正则















