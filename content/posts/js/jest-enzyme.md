---
title: "React 组件搭建测试框架"
date: 2022-02-16T16:03:55+08:00
draft: true
tags: ["jest", "enyzme", "react-test"]
---


## 安装React

> npm i --save react@16 react-dom@16

## 安装enzyme

> npm i --save-dev enzyme enzyme-adapter-react-16

其中`enzyme-adapter-react-16`是`react`特定版本的适配器,具体的react版本需要不同的适配器

`tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "es6",
    "module": "commonjs",
    "jsx": "react",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

## `package.json`

```json
{
     "dependencies": {
    "jest": "^27.5.1",
    "react": "16.9.0",
    "react-dom": "16.9.0"
  },
  "devDependencies": {
    "@types/enzyme": "^3.10.11",
    "@types/jest": "^27.4.0",
    "@types/node": "12.7.2",
    "@types/react": "16.9.2",
    "@types/react-dom": "16.9.0",
    "css-loader": "3.2.0",
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.6",
    "html-webpack-plugin": "3.2.0",
    "identity-obj-proxy": "^3.0.0",
    "source-map-loader": "0.2.4",
    "style-loader": "1.0.0",
    "ts-jest": "^27.1.3",
    "ts-loader": "6.0.4",
    "typescript": "3.8.3",
    "webpack": "4.39.3",
    "webpack-cli": "3.3.7",
    "webpack-dev-server": "3.8.0"
  }
}
```

`setup.js`

```js
// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```
使用


```js
// test file
import { shallow, mount, render } from 'enzyme';

const wrapper = shallow(<Foo />);
```

## 其中我们使用的测试框架是jest


配置一下jest的配置文件 `jest.test.js`

```js
const path = require("path");
const absPath = (fileName) => path.resolve(__dirname, fileName);

module.exports = {
    moduleFileExtensions: ["ts", "tsx", "js"],
    setupFilesAfterEnv: [absPath("setupTest.js")],
    testMatch: ["**/__tests__/*.(ts|tsx)"],
    testPathIgnorePatterns: ['node_modules/'],
    testEnvironment: "jsdom",
    resetMocks: true,
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
};

```


最终我们的测试文件

`xxx.test.tsx`

```js
import React from "react";
import { mount, shallow } from "enzyme";
import { MultiCheck } from "../MultiCheck";
import { Option } from "..";

describe("MultiCheck", () => {
    describe("initialize", () => {
        it("renders the label if label provided", () => {
            const mutilCheck = shallow(
                <MultiCheck options={[]} label="MutilLabel" />
            );
            expect(mutilCheck.find(".mu-check--label").text()).toEqual(
                "MutilLabel"
            );
        });
    })
})
```