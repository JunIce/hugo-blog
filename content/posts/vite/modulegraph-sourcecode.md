---
title: "vite ModuleGraph源码解读"
date: 2022-06-09T07:40:43+08:00
tags: ["websocket"]
categories: ["vite"]
draft: false
---





# Vite -- moduleGraph源码解读



vite中使用moduleGraph去记录模块之间的引用关系



## 源码位置



`packages/vite/src/node/server/moduleGraph.ts`



>   "version": "3.0.0-alpha.9"





## ModuleNode



ModuleNode是moduleGraph中的最小颗粒，每个模块都会用一个node去表示，其中每个node中都记录了当前模块的所有信息，包括编译之后的结果



```typescript
class ModuleNode {
  /**
   * Public served url path, starts with /
   */
  url: string
  /**
   * Resolved file system path + query
   */
  id: string | null = null
  file: string | null = null
  type: 'js' | 'css'
  info?: ModuleInfo
  meta?: Record<string, any>
  importers = new Set<ModuleNode>()
  importedModules = new Set<ModuleNode>()
  acceptedHmrDeps = new Set<ModuleNode>()
  isSelfAccepting?: boolean
  transformResult: TransformResult | null = null
  ssrTransformResult: TransformResult | null = null
  ssrModule: Record<string, any> | null = null
  ssrError: Error | null = null
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0

  constructor(url: string) {
    this.url = url
    this.type = isDirectCSSRequest(url) ? 'css' : 'js'
    // #7870
    // The `isSelfAccepting` value is set by importAnalysis, but some
    // assets don't go through importAnalysis.
    if (isHTMLRequest(url) || canSkipImportAnalysis(url)) {
      this.isSelfAccepting = false
    }
  }
}
```





## ModuleGraph



模块依赖容器类



容器类有4个属性，分别用来记录url、id、文件和模块之间的对应关系

```js
  urlToModuleMap = new Map<string, ModuleNode>()
  idToModuleMap = new Map<string, ModuleNode>()
  // a single file may corresponds to multiple modules with different queries
  fileToModulesMap = new Map<string, Set<ModuleNode>>()
  safeModulesPath = new Set<string>()
```



### constructor

构造函数，这里从实例外部传入了一个resolveId函数，把解析id的能力留到外部去做

```js
constructor(
    private resolveId: (
      url: string,
      ssr: boolean
    ) => Promise<PartialResolvedId | null>
  ) {}
```



### resolveUrl

解析url参数

1. 去除url后面的查询参数，保证url最终指向的是同一个模块
2. 上下文推断可以知道，`this.resolveId` 最终肯定是个对象，有个`id`属性
3. 用node.extname去解析出扩展名
4. 用url.parseUrl解析url
5. 把url处理成统一格式并返回

```js
  // for incoming urls, it is important to:
  // 1. remove the HMR timestamp query (?t=xxxx)
  // 2. resolve its extension so that urls with or without extension all map to
  // the same module
  async resolveUrl(url: string, ssr?: boolean): Promise<ResolvedUrl> {
    url = removeImportQuery(removeTimestampQuery(url))
    const resolved = await this.resolveId(url, !!ssr)
    const resolvedId = resolved?.id || url
    const ext = extname(cleanUrl(resolvedId))
    const { pathname, search, hash } = parseUrl(url)
    if (ext && !pathname!.endsWith(ext)) {
      url = pathname + ext + (search || '') + (hash || '')
    }
    return [url, resolvedId, resolved?.meta]
  }
```



### ensureEntryFromUrl



解析url拿到对应的属性



添加到对应的urlToModuleMap、idToModuleMap、fileToModulesMap中，便于后续更新



```js
  async ensureEntryFromUrl(rawUrl: string, ssr?: boolean): Promise<ModuleNode> {
    const [url, resolvedId, meta] = await this.resolveUrl(rawUrl, ssr)
    let mod = this.urlToModuleMap.get(url)
    if (!mod) {
      // 模块不存在，记录依赖关系
      mod = new ModuleNode(url)
      if (meta) mod.meta = meta
      this.urlToModuleMap.set(url, mod)
      mod.id = resolvedId
      this.idToModuleMap.set(resolvedId, mod)
      const file = (mod.file = cleanUrl(resolvedId))
      let fileMappedModules = this.fileToModulesMap.get(file)
      if (!fileMappedModules) {
        fileMappedModules = new Set()
        this.fileToModulesMap.set(file, fileMappedModules)
      }
      fileMappedModules.add(mod)
    }
    return mod
  }
```



### updateModuleInfo



用于更新模块之间依赖信息的



```js
/**
   * Update the module graph based on a module's updated imports information
   * If there are dependencies that no longer have any importers, they are
   * returned as a Set.
   */
  async updateModuleInfo(
    mod: ModuleNode,
    importedModules: Set<string | ModuleNode>,
    acceptedModules: Set<string | ModuleNode>,
    isSelfAccepting: boolean,
    ssr?: boolean
  ): Promise<Set<ModuleNode> | undefined> {
    mod.isSelfAccepting = isSelfAccepting
    // 之前的引入的依赖
    const prevImports = mod.importedModules
    // 重置依赖为一个set
    const nextImports = (mod.importedModules = new Set())
    // 这个变量用于保存那些不再有任何依赖的模块
    let noLongerImported: Set<ModuleNode> | undefined
    // update import graph
    for (const imported of importedModules) {
      const dep =
        typeof imported === 'string'
		      // 依赖是个字符串的时候，都会再去走一下获取文件的逻辑
          ? await this.ensureEntryFromUrl(imported, ssr)
          : imported
      // 加入到模块的importers中去
      dep.importers.add(mod)
      
      nextImports.add(dep)
    }
    // remove the importer from deps that were imported but no longer are.
    prevImports.forEach((dep) => {
      // 比对，新模块中没有就删除掉
      if (!nextImports.has(dep)) {
        dep.importers.delete(mod)
        if (!dep.importers.size) {
          // 加入到0依赖的set中
          // dependency no longer imported
          ;(noLongerImported || (noLongerImported = new Set())).add(dep)
        }
      }
    })
    // update accepted hmr deps
    // 遍历加入到模块acceptedHmrDeps队列中
    const deps = (mod.acceptedHmrDeps = new Set())
    for (const accepted of acceptedModules) {
      const dep =
        typeof accepted === 'string'
          ? await this.ensureEntryFromUrl(accepted, ssr)
          : accepted
      deps.add(dep)
    }
    return noLongerImported
  }
```



### createFileOnlyEntry



用于解决只记录文件依赖属性的文件， 类型于引入的css需要实现热更新



```js
  createFileOnlyEntry(file: string): ModuleNode {
    file = normalizePath(file)
    let fileMappedModules = this.fileToModulesMap.get(file)
    if (!fileMappedModules) {
      fileMappedModules = new Set()
      this.fileToModulesMap.set(file, fileMappedModules)
    }

    const url = `${FS_PREFIX}${file}`
    for (const m of fileMappedModules) {
      if (m.url === url || m.id === file) {
        return m
      }
    }

    const mod = new ModuleNode(url)
    mod.file = file
    fileMappedModules.add(mod)
    return mod
  }

```

