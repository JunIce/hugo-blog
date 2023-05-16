---
title: "vue -- transformElement源码"
date: 2023-05-08T15:26:32+08:00
tags: ["vue3", "transformElement", "@vue/compiler-core"]
categories: ["vue"]
draft: false
---



# vue transformElement



## transformElement



```ts
export const transformElement: NodeTransform = (node, context) => {
    return function postTransformElement() {
        // ...
        // 主函数，返回一个闭包函数
    }
}
```



## resolveComponentType



#### 动态组件



```ts
  const isProp = findProp(node, 'is')
```

并且这里的值是绑定的属性， 这里会调用`createCallExpression`， 传入的是动态组件函数

```ts
const exp =
        isProp.type === NodeTypes.ATTRIBUTE
          ? isProp.value && createSimpleExpression(isProp.value.content, true)
          : isProp.exp
if (exp) {
	return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT),			[ exp ]
	)
}
```

如果是属性值，并且以`vue:`开头， 这里会把tag重置成剪裁后的字符串

```ts
 if (
      isProp.type === NodeTypes.ATTRIBUTE &&
      isProp.value!.content.startsWith('vue:')
    ) {
      // <button is="vue:xxx">
      // if not <component>, only is value that starts with "vue:" will be
      // treated as component by the parse phase and reach here, unless it's
      // compat mode where all is values are considered components
      tag = isProp.value!.content.slice(4)
}
```



#### 非component组件，存在is属性



```ts
const isDir = !isExplicitDynamic && findDir(node, 'is')
```



调用动态组件，传入指令

```ts
if (isDir && isDir.exp) {
    return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT), [
      isDir.exp
    ])
  }
```



#### 内置组件名



```ts
 const builtIn = isCoreComponent(tag) || context.isBuiltInComponent(tag)
```

内置组件直接通过

```ts
if (builtIn) {
    // built-ins are simply fallthroughs / have special handling during ssr
    // so we don't need to import their runtime equivalents
    if (!ssr) context.helper(builtIn)
    return builtIn
  }
```



#### 如果是从setup中引用的组件

这里会先去解析context中 setup函数内的引用

```ts
const fromSetup = resolveSetupReference(tag, context)
if (fromSetup) {
  return fromSetup
}
const dotIndex = tag.indexOf('.')
if (dotIndex > 0) {
  const ns = resolveSetupReference(tag.slice(0, dotIndex), context)
  if (ns) {
    return ns + tag.slice(dotIndex)
  }
}
```



#### 如果是自引用组件

也就是在组件中自己引用自己



这里会增加一个`__self`尾缀的`tag`

```ts
 if (
    !__BROWSER__ &&
    context.selfName &&
    capitalize(camelize(tag)) === context.selfName
  ) {
    context.helper(RESOLVE_COMPONENT)
    // codegen.ts has special check for __self postfix when generating
    // component imports, which will pass additional `maybeSelfReference` flag
    // to `resolveComponent`.
    context.components.add(tag + `__self`)
    return toValidAssetId(tag, `component`)
  }
```



#### 用户组件

直接走用户组件引用逻辑

```ts
  context.helper(RESOLVE_COMPONENT)
  context.components.add(tag)
  return toValidAssetId(tag, `component`)
```





## buildProps

构建props属性结果



第一步对props进行遍历

```ts
for (let i = 0; i < props.length; i++) {
    // static attribute
    const prop = props[i]
    // ...
}
```



- type为属性

如果prop的name为ref



```ts
let isStatic = true
if (name === 'ref') {
hasRef = true
```

如果存在`v-for`

```ts
if (context.scopes.vFor > 0) {
          properties.push(
            createObjectProperty(
              createSimpleExpression('ref_for', true),
              createSimpleExpression('true')
            )
          )
}
```

构建`ref_for`语句



如果属性name是is或者是component 或者 是 `vue:`

这里会直接跳过

```ts
if (
        name === 'is' &&
        (isComponentTag(tag) ||
          (value && value.content.startsWith('vue:')) ||
          (__COMPAT__ &&
            isCompatEnabled(
              CompilerDeprecationTypes.COMPILER_IS_ON_ELEMENT,
              context
            )))
      ) {
        continue
      }
```

创建属性语句

```ts
properties.push(
    createObjectProperty(
      createSimpleExpression(
        name,
        true,
        getInnerRange(loc, 0, name.length)
      ),
      createSimpleExpression(
        value ? value.content : '',
        isStatic,
        value ? value.loc : loc
      )
    )
 )
```



- 如果是指令

```ts
const { name, arg, exp, loc } = prop
const isVBind = name === 'bind'
const isVOn = name === 'on'
```



slot会直接跳过

```ts
      if (name === 'slot') {
        if (!isComponent) {
          context.onError(
            createCompilerError(ErrorCodes.X_V_SLOT_MISPLACED, loc)
          )
        }
        continue
      }
```



once/memo也会直接跳过

```ts
if (name === 'once' || name === 'memo') {
        continue
}
```



is属性也会跳过

```ts
if (
        name === 'is' ||
        (isVBind &&
          isStaticArgOf(arg, 'is') &&
          (isComponentTag(tag) ||
            (__COMPAT__ &&
              isCompatEnabled(
                CompilerDeprecationTypes.COMPILER_IS_ON_ELEMENT,
                context
              ))))
) {
        continue
}
```



如果是动态的key，这里强制使用block

```ts
if (
        // #938: elements with dynamic keys should be forced into blocks
        (isVBind && isStaticArgOf(arg, 'key')) ||
        // inline before-update hooks need to force block so that it is invoked
        // before children
        (isVOn && hasChildren && isStaticArgOf(arg, 'vue:before-update'))
      ) {
        shouldUseBlock = true
      }
```



如果有动态绑定的参数， 这里会推入到`mergeArgs`中去

```ts
hasDynamicKeys = true
if (exp) {
  if (isVBind) {
    // have to merge early for compat build check
    pushMergeArg()

    mergeArgs.push(exp)
  } else {
    // v-on="obj" -> toHandlers(obj)
    pushMergeArg({
      type: NodeTypes.JS_CALL_EXPRESSION,
      loc,
      callee: context.helper(TO_HANDLERS),
      arguments: isComponent ? [exp] : [exp, `true`]
    })
  }
} 
```

如果有对应的指令的transform ， 这里还会进行指令的整合

```ts
const directiveTransform = context.directiveTransforms[name]
if (directiveTransform) {
        // has built-in directive transform.
        const { props, needRuntime } = directiveTransform(prop, node, context)
        !ssr && props.forEach(analyzePatchFlag)
        if (isVOn && arg && !isStaticExp(arg)) {
          pushMergeArg(createObjectExpression(props, elementLoc))
        } else {
          properties.push(...props)
        }
        if (needRuntime) {
          runtimeDirectives.push(prop)
          if (isSymbol(needRuntime)) {
            directiveImportMap.set(prop, needRuntime)
          }
        }
      } else if (!isBuiltInDirective(name)) {
        // no built-in transform, this is a user custom directive.
        runtimeDirectives.push(prop)
        // custom dirs may use beforeUpdate so they need to force blocks
        // to ensure before-update gets called before children update
        if (hasChildren) {
          shouldUseBlock = true
        }
}
```



构建propsExpression

```ts
// has v-bind="object" or v-on="object", wrap with mergeProps
  if (mergeArgs.length) {
    // close up any not-yet-merged props
    pushMergeArg()
    if (mergeArgs.length > 1) {
      propsExpression = createCallExpression(
        context.helper(MERGE_PROPS),
        mergeArgs,
        elementLoc
      )
    } else {
      // single v-bind with nothing else - no need for a mergeProps call
      propsExpression = mergeArgs[0]
    }
  } else if (properties.length) {
    propsExpression = createObjectExpression(
      dedupeProperties(properties),
      elementLoc
    )
  }
```





重写`PatchFlags`

```ts
  // patchFlag analysis
  if (hasDynamicKeys) {
    patchFlag |= PatchFlags.FULL_PROPS
  } else {
    if (hasClassBinding && !isComponent) {
      patchFlag |= PatchFlags.CLASS
    }
    if (hasStyleBinding && !isComponent) {
      patchFlag |= PatchFlags.STYLE
    }
    if (dynamicPropNames.length) {
      patchFlag |= PatchFlags.PROPS
    }
    if (hasHydrationEventBinding) {
      patchFlag |= PatchFlags.HYDRATE_EVENTS
    }
  }
  if (
    !shouldUseBlock &&
    (patchFlag === 0 || patchFlag === PatchFlags.HYDRATE_EVENTS) &&
    (hasRef || hasVnodeHook || runtimeDirectives.length > 0)
  ) {
    patchFlag |= PatchFlags.NEED_PATCH
  }
```



根据propsExpression 的type进行进一步处理

```ts
switch (propsExpression.type) {
  case NodeTypes.JS_OBJECT_EXPRESSION:
    // means that there is no v-bind,
    // but still need to deal with dynamic key binding
    let classKeyIndex = -1
    let styleKeyIndex = -1
    let hasDynamicKey = false

    for (let i = 0; i < propsExpression.properties.length; i++) {
      const key = propsExpression.properties[i].key
      if (isStaticExp(key)) {
        if (key.content === 'class') {
          classKeyIndex = i
        } else if (key.content === 'style') {
          styleKeyIndex = i
        }
      } else if (!key.isHandlerKey) {
        hasDynamicKey = true
      }
    }

    const classProp = propsExpression.properties[classKeyIndex]
    const styleProp = propsExpression.properties[styleKeyIndex]

    // no dynamic key
    if (!hasDynamicKey) {
      if (classProp && !isStaticExp(classProp.value)) {
        classProp.value = createCallExpression(
          context.helper(NORMALIZE_CLASS),
          [classProp.value]
        )
      }
      if (
        styleProp &&
        // the static style is compiled into an object,
        // so use `hasStyleBinding` to ensure that it is a dynamic style binding
        (hasStyleBinding ||
          (styleProp.value.type === NodeTypes.SIMPLE_EXPRESSION &&
            styleProp.value.content.trim()[0] === `[`) ||
          // v-bind:style and style both exist,
          // v-bind:style with static literal object
          styleProp.value.type === NodeTypes.JS_ARRAY_EXPRESSION)
      ) {
        styleProp.value = createCallExpression(
          context.helper(NORMALIZE_STYLE),
          [styleProp.value]
        )
      }
    } else {
      // dynamic key binding, wrap with `normalizeProps`
      propsExpression = createCallExpression(
        context.helper(NORMALIZE_PROPS),
        [propsExpression]
      )
    }
    break
  case NodeTypes.JS_CALL_EXPRESSION:
    // mergeProps call, do nothing
    break
  default:
    // single v-bind
    propsExpression = createCallExpression(
      context.helper(NORMALIZE_PROPS),
      [
        createCallExpression(context.helper(GUARD_REACTIVE_PROPS), [
          propsExpression
        ])
      ]
    )
    break
}
```

