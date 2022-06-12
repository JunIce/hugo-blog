---
title: "vite -- pluginContainer插件容器源码解读"
date: 2022-06-11T14:29:21+08:00
tags: ["vite", "plugin"]
categories: ["vite"]
draft: false
---



# Vite 插件机制及实现原理



>   "version": "3.0.0-alpha.10"



## 源码位置



`packages/vite/src/node/server/pluginContainer.ts`



整个文件只有一个函数，通过一个多达700行的函数，最终返回一个container对象



```typescript
export async function createPluginContainer(
  { plugins, logger, root, build: { rollupOptions } }: ResolvedConfig,
  moduleGraph?: ModuleGraph,
  watcher?: FSWatcher
): Promise<PluginContainer> {
	// ....
	const conatiner = {
    //....
  }
  return container;
}
```







## container



代码太长，跳过一些影响阅读的部分，看结尾container返回了什么



### options

一个自执行函数， 遍历全部plugins，如果有options参数，就执行一次，这里也能看到插件的options需要是一个promise函数



### getModuleInfo

获取模块信息，其实走的是moduleGraph那个实例内的方法



### buildStart

通过promise.all等待所有插件的buildStart方法执行完毕， 插件传入了一个Context实例，下面再看



### resolveId



遍历全部插件，这里ctx其实就是Context实例对象



```typescript
let id: string | null = null
const partial: Partial<PartialResolvedId> = {}
for (const plugin of plugins) {
  if (!plugin.resolveId) continue
  if (skip?.has(plugin)) continue

  ctx._activePlugin = plugin

  const pluginResolveStart = isDebug ? performance.now() : 0
  const result = await plugin.resolveId.call(
    ctx as any,
    rawId,
    importer,
    { ssr, scan }
  )
  if (!result) continue

  if (typeof result === 'string') {
    id = result
  } else {
    id = result.id
    Object.assign(partial, result)
  }

  // resolveId() is hookFirst - first non-null result is returned.
  break
}
```



### load



循环调用插件的load方法，如有返回，就会去更新模块相关信息



```typescript
async load(id, options) {
    const ssr = options?.ssr
    const ctx = new Context()
    ctx.ssr = !!ssr
    for (const plugin of plugins) {
      if (!plugin.load) continue
      ctx._activePlugin = plugin
      const result = await plugin.load.call(ctx as any, id, { ssr })
      if (result != null) {
        if (isObject(result)) {
          updateModuleInfo(id, result)
        }
        return result
      }
    }
    return null
},
```



### transform



插件的转换方法，具体的编译应该就是在这个阶段完成的，最终返回的是转换后的代码和代码的sourcemap

```typescript
async transform(code, id, options) {
    const inMap = options?.inMap
    const ssr = options?.ssr
    const ctx = new TransformContext(id, code, inMap as SourceMap)
    ctx.ssr = !!ssr
    for (const plugin of plugins) {
      if (!plugin.transform) continue
      ctx._activePlugin = plugin
      ctx._activeId = id
      ctx._activeCode = code
      const start = isDebug ? performance.now() : 0
      let result: TransformResult | string | undefined
      try {
        // 调用插件的transform方法进行转换
        result = await plugin.transform.call(ctx as any, code, id, { ssr })
      } catch (e) {
        ctx.error(e)
      }
      if (!result) continue
      // 。。。
      if (isObject(result)) {
        if (result.code !== undefined) {
          // 转换结果是一个对象，切有.code属性
          code = result.code
          if (result.map) {
            if (isDebugSourcemapCombineFocused) {
              // @ts-expect-error inject plugin name for debug purpose
              result.map.name = plugin.name
            }
            ctx.sourcemapChain.push(result.map)
          }
        }
        updateModuleInfo(id, result)
      } else {
        code = result
      }
    }
  	// 
    return {
      code,
      map: ctx._getCombinedSourcemap()
    }
  },
```



### close

close方法循环调用插件的buildEnd方法和closeBundle方法，最后置flag为true

```typescript
async close() {
      if (closed) return
      const ctx = new Context()
      await Promise.all(
        plugins.map((p) => p.buildEnd && p.buildEnd.call(ctx as any))
      )
      await Promise.all(
        plugins.map((p) => p.closeBundle && p.closeBundle.call(ctx as any))
      )
      closed = true
}
```



## container完整代码

```typescript
const container: PluginContainer = {
    options: await (async () => {
      let options = rollupOptions
      for (const plugin of plugins) {
        if (!plugin.options) continue
        options =
          (await plugin.options.call(minimalContext, options)) || options
      }
      if (options.acornInjectPlugins) {
        parser = acorn.Parser.extend(
          ...(arraify(options.acornInjectPlugins) as any)
        )
      }
      return {
        acorn,
        acornInjectPlugins: [],
        ...options
      }
    })(),

    getModuleInfo,

    async buildStart() {
      await Promise.all(
        plugins.map((plugin) => {
          if (plugin.buildStart) {
            return plugin.buildStart.call(
              new Context(plugin) as any,
              container.options as NormalizedInputOptions
            )
          }
        })
      )
    },

    async resolveId(rawId, importer = join(root, 'index.html'), options) {
      const skip = options?.skip
      const ssr = options?.ssr
      const scan = !!options?.scan
      const ctx = new Context()
      ctx.ssr = !!ssr
      ctx._scan = scan
      ctx._resolveSkips = skip
      const resolveStart = isDebug ? performance.now() : 0

      let id: string | null = null
      const partial: Partial<PartialResolvedId> = {}
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue
        if (skip?.has(plugin)) continue

        ctx._activePlugin = plugin

        const pluginResolveStart = isDebug ? performance.now() : 0
        const result = await plugin.resolveId.call(
          ctx as any,
          rawId,
          importer,
          { ssr, scan }
        )
        if (!result) continue

        if (typeof result === 'string') {
          id = result
        } else {
          id = result.id
          Object.assign(partial, result)
        }

        isDebug &&
          debugPluginResolve(
            timeFrom(pluginResolveStart),
            plugin.name,
            prettifyUrl(id, root)
          )

        // resolveId() is hookFirst - first non-null result is returned.
        break
      }

      if (isDebug && rawId !== id && !rawId.startsWith(FS_PREFIX)) {
        const key = rawId + id
        // avoid spamming
        if (!seenResolves[key]) {
          seenResolves[key] = true
          debugResolve(
            `${timeFrom(resolveStart)} ${colors.cyan(rawId)} -> ${colors.dim(
              id
            )}`
          )
        }
      }

      if (id) {
        partial.id = isExternalUrl(id) ? id : normalizePath(id)
        return partial as PartialResolvedId
      } else {
        return null
      }
    },

    async load(id, options) {
      const ssr = options?.ssr
      const ctx = new Context()
      ctx.ssr = !!ssr
      for (const plugin of plugins) {
        if (!plugin.load) continue
        ctx._activePlugin = plugin
        const result = await plugin.load.call(ctx as any, id, { ssr })
        if (result != null) {
          if (isObject(result)) {
            updateModuleInfo(id, result)
          }
          return result
        }
      }
      return null
    },

    async transform(code, id, options) {
      const inMap = options?.inMap
      const ssr = options?.ssr
      const ctx = new TransformContext(id, code, inMap as SourceMap)
      ctx.ssr = !!ssr
      for (const plugin of plugins) {
        if (!plugin.transform) continue
        ctx._activePlugin = plugin
        ctx._activeId = id
        ctx._activeCode = code
        const start = isDebug ? performance.now() : 0
        let result: TransformResult | string | undefined
        try {
          result = await plugin.transform.call(ctx as any, code, id, { ssr })
        } catch (e) {
          ctx.error(e)
        }
        if (!result) continue
        isDebug &&
          debugPluginTransform(
            timeFrom(start),
            plugin.name,
            prettifyUrl(id, root)
          )
        if (isObject(result)) {
          if (result.code !== undefined) {
            code = result.code
            if (result.map) {
              if (isDebugSourcemapCombineFocused) {
                // @ts-expect-error inject plugin name for debug purpose
                result.map.name = plugin.name
              }
              ctx.sourcemapChain.push(result.map)
            }
          }
          updateModuleInfo(id, result)
        } else {
          code = result
        }
      }
      return {
        code,
        map: ctx._getCombinedSourcemap()
      }
    },

    async close() {
      if (closed) return
      const ctx = new Context()
      await Promise.all(
        plugins.map((p) => p.buildEnd && p.buildEnd.call(ctx as any))
      )
      await Promise.all(
        plugins.map((p) => p.closeBundle && p.closeBundle.call(ctx as any))
      )
      closed = true
    }
  }
```



## class Context



context在vite的插件中至关重要，vite实现编译vue文件和react文件，背后都是依赖于插件机制，vite并不只是为vue开发使用，也可以实现插件用于别的地方



pluginContext 其实是继承于rollup的PluginContext，这也就是为什么vite可以使用部分rollup的插件的原因，不得不说这种实现真的很聪明，一下子就扩大了自己的插件生态



### acorn

第三方npm包，用于javascript转换器

[https://github.com/acornjs/acorn.git](https://github.com/acornjs/acorn.git)







```typescript
class Context implements PluginContext {
    meta = minimalContext.meta
    ssr = false
    _scan = false
    _activePlugin: Plugin | null
    _activeId: string | null = null
    _activeCode: string | null = null
    _resolveSkips?: Set<Plugin>
    _addedImports: Set<string> | null = null

    constructor(initialPlugin?: Plugin) {
      this._activePlugin = initialPlugin || null
    }
		
  	// 解析代码
    parse(code: string, opts: any = {}) {
      return parser.parse(code, {
        sourceType: 'module',
        ecmaVersion: 'latest',
        locations: true,
        ...opts
      })
    }

    async resolve(
      id: string,
      importer?: string,
      options?: { skipSelf?: boolean }
    ) {
      let skip: Set<Plugin> | undefined
      if (options?.skipSelf && this._activePlugin) {
        skip = new Set(this._resolveSkips)
        skip.add(this._activePlugin)
      }
      let out = await container.resolveId(id, importer, {
        skip,
        ssr: this.ssr,
        scan: this._scan
      })
      if (typeof out === 'string') out = { id: out }
      return out as ResolvedId | null
    }

    getModuleInfo(id: string) {
      return getModuleInfo(id)
    }

    getModuleIds() {
      return moduleGraph
        ? moduleGraph.idToModuleMap.keys()
        : Array.prototype[Symbol.iterator]()
    }

    addWatchFile(id: string) {
      watchFiles.add(id)
      ;(this._addedImports || (this._addedImports = new Set())).add(id)
      if (watcher) ensureWatchedFile(watcher, id, root)
    }

    getWatchFiles() {
      return [...watchFiles]
    }

    emitFile(assetOrFile: EmittedFile) {
      warnIncompatibleMethod(`emitFile`, this._activePlugin!.name)
      return ''
    }

    setAssetSource() {
      warnIncompatibleMethod(`setAssetSource`, this._activePlugin!.name)
    }

    getFileName() {
      warnIncompatibleMethod(`getFileName`, this._activePlugin!.name)
      return ''
    }

    warn(
      e: string | RollupError,
      position?: number | { column: number; line: number }
    ) {
      const err = formatError(e, position, this)
      const msg = buildErrorMessage(
        err,
        [colors.yellow(`warning: ${err.message}`)],
        false
      )
      logger.warn(msg, {
        clear: true,
        timestamp: true
      })
    }

    error(
      e: string | RollupError,
      position?: number | { column: number; line: number }
    ): never {
      // error thrown here is caught by the transform middleware and passed on
      // the the error middleware.
      throw formatError(e, position, this)
    }
  }
```





## plugin json



以内置的json插件为例



vite在引用json文件时会使用这个插件进行代码转换，可以看到就是把json文件在插件的transform方法中进行了进一步的包装



```typescript
export function jsonPlugin(
  options: JsonOptions = {},
  isBuild: boolean
): Plugin {
  return {
    name: 'vite:json',

    transform(json, id) {
      if (!jsonExtRE.test(id)) return null
      if (SPECIAL_QUERY_RE.test(id)) return null

      try {
        if (options.stringify) {
          //....
            return `export default JSON.parse(${JSON.stringify(json)})`
        }

        const parsed = JSON.parse(json)
        return {
          code: dataToEsm(parsed, {
            preferConst: true,
            namedExports: options.namedExports
          }),
          map: { mappings: '' }
        }
      } catch (e) {
        //...
      }
    }
  }
}

```

