---
title: "dependencies / devdependencies / peerdependencies 异同点"
date: 2026-06-22T11:15:04+08:00
draft: true
tags: ["js", "npm"]
categories: ["package.json"]
---



# dependencies / devdependencies / peerdependencies 异同点





|                       **Dependencies**                       |                     **devDependencies**                      |                     **peerDependencies**                     |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| A dependency is a library that a project needs to function effectively. | DevDependencies are the packages a developer needs during development. | A peer dependency specifies that our package is compatible with a particular version of an npm package.对等依赖关系指定我们的包与 npm 包的特定版本兼容。 |
| If a package doesn’t already exist in the node_modules directory, then it is automatically added. | As you install a package, npm will automatically install the dev dependencies. | peerDependencies are not automatically installed. You need to manually modify your package.json file in order to add a Peer Dependency.只能手动添加 |
|   These are the libraries you need when you run your code.   | These dependencies may be needed at some point during the development process, but not during execution. | Peer dependencies are only encountered when you publish your own package, that is, when you develop code that will be used by other programs. |
|              Included in the final code bundle.              |             Included in the final code bundle .              | Can be included only when you are publishing your own package. |
| Dependencies can be added to your project by running :`npm install <package_name>` | Dev dependencies can be added to your project by running :`npm install <package_name> --save-dev` |        Change the package.json file manually.手动修改        |
