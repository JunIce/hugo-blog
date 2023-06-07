---
title: "forwardRef 定义的组件添加静态属性"
date: 2023-06-06T07:00:28+08:00
tags: ["forwardRef", "typescript define"]
categories: ["react"]
draft: false
---


# forwardRef 定义的组件添加静态属性

```typescript
import React, { ReactNode, RefAttributes, ForwardRefExoticComponent } from 'react';

interface ModalProps {
    title: ReactNode;
}

interface ModalStaticProps {
    show(): void;
    hide(): void;
}

const STATIC_PROPS: ModalStaticProps = {
    show: () => { },
    hide: () => { }
}

const withStaticProps = <T,>(
    forwarded: ForwardRefExoticComponent<ModalProps & RefAttributes<HTMLDivElement>>,
    staticProps: T
) => Object.assign(forwarded, staticProps)


const Modal = React.forwardRef<
    HTMLDivElement,
    ModalProps
>(({ title }: ModalProps, ref) => <div ref={ref}>{title}</div>)

const ModalComponent = withStaticProps(Modal, STATIC_PROPS)

function Consumer() {
    return <div onClick={() => ModalComponent.show()} />
}

```