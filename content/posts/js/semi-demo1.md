---
title: "Semi Design 源码解读1"
date: 2021-10-26T15:03:50+08:00
draft: true
---

## Semi design 源码解读

### Row

看到生命周期中有注册事件，看看`registerMediaQuery`是干什么用的
```js
const unRegisters: Array<() => void> = [];

componentDidMount() {
    this.unRegisters = Object.keys(responsiveMap).map(screen => registerMediaQuery(responsiveMap[screen], {
        match: () => {
            if (typeof this.props.gutter !== 'object') {
                return;
            }
            this.setState(prevState => ({
                screens: {
                    ...prevState.screens,
                    [screen]: true,
                },
            }));
        },
        unmatch: () => {
            if (typeof this.props.gutter !== 'object') {
                return;
            }
            this.setState(prevState => ({
                screens: {
                    ...prevState.screens,
                    [screen]: false,
                },
            }));
        },
    }));
}

componentWillUnmount() {
    this.unRegisters.forEach(unRegister => unRegister());
}

```

`registerMediaQuery`函数是动态监听视窗变化

> matchMedia() 返回一个新的 MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果。
> {
>    media,
>    matches: //true & false
> }

```js
export const registerMediaQuery = (media: string, { match, unmatch, callInInit = true }: RegisterMediaQueryOption): () => void => {
    if (typeof window !== 'undefined') {
        const mediaQueryList = window.matchMedia(media);
        function handlerMediaChange(e: MediaQueryList | MediaQueryListEvent): void {
            if (e.matches) {
                match && match(e);
            } else {
                unmatch && unmatch(e);
            }
        }
        callInInit && handlerMediaChange(mediaQueryList);
        mediaQueryList.addEventListener('change', handlerMediaChange);
        return (): void => mediaQueryList.removeEventListener('change', handlerMediaChange);
    }
    return null;
};
```
`getGutter` 根据不同的视窗，返回不同的`间距`
```js
getGutter() {
    const { gutter = 0 } = this.props;
    const results: [number, number] = [0, 0];
    const normalizedGutter = Array.isArray(gutter) ? gutter.slice(0, 2) : [gutter, 0];
    normalizedGutter.forEach((g, index) => {
        if (typeof g === 'object') {
            for (let i = 0; i < responsiveArray.length; i++) {
                const breakpoint = responsiveArray[i];
                if (this.state.screens[breakpoint] && g[breakpoint] !== undefined) {
                    results[index] = g[breakpoint];
                    break;
                }
            }
        } else {
            results[index] = g || 0;
        }
    });
    return results;
}
```


### Col

col组件整体没有什么难度，基本逻辑在常规画ui部分

```js
let sizeClassObj = {};

const prefix = `${prefixCls}-col`;
// 通过遍历已知数组构造出新className对象
['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
    let sizeProps: ColSize = {};
    if (typeof props[size] === 'number') {
        sizeProps.span = props[size];
    } else if (typeof props[size] === 'object') {
        sizeProps = props[size] || {};
    }

    delete others[size];

    sizeClassObj = {
        ...sizeClassObj,
        [`${prefix}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
        [`${prefix}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
        [`${prefix}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
        [`${prefix}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
        [`${prefix}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
    };
});
```

```js
let gutters;
try {
    // 获取外部context注入的gutters
    gutters = this.context.gutters;
} catch (error) {
    throw new Error('please make sure <Col> inside <Row>');
}
// ...
// 根据gutters动态计算出style对象
style = {
    ...(gutters[0] > 0 ?
        {
            paddingLeft: gutters[0] / 2,
            paddingRight: gutters[0] / 2,
        } :
        {}),
    ...(gutters[1] > 0 ?
        {
            paddingTop: gutters[1] / 2,
            paddingBottom: gutters[1] / 2,
        } :
        {}),
    ...style,
};
```
