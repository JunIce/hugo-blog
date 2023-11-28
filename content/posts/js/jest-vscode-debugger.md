---
title: "Jest 配置vscode调试"
date: 2023-03-14T09:24:09+08:00
draft: true
tags: ["jest"]
---



## Jest 配置vscode debugger调试

```js
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"type": "node",
			"request": "launch",
			"name": "Jest",
			"program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
			"args": ["-i"],
			"skipFiles": ["<node_internals>/**/*.js", "node_modules"]
		}
	]
}

```


## windows 调试文件

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "--inspect-brk",
        "${workspaceRoot}/node_modules/jest/bin/jest.js",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```


### References

[https://jestjs.io/docs/troubleshooting.html#debugging-in-vs-code](https://jestjs.io/docs/troubleshooting.html#debugging-in-vs-code)