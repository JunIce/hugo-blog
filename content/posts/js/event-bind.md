---
title: "简易的事件监听EventBus"
date: 2023-06-17T09:39:16+08:00
draft: false
tags: ["js", "events"]
categories: ["js"]
---

# 简易的事件监听

```typescript
const createEvent = () => ({
  events: {} as any,
  on(eventName: string, callback: Function) {
    this.events[eventName]?.push(callback) ||
      (this.events[eventName] = [callback]);

    return () => {
      this.events[eventName] = this.events[eventName].filter(
        (e: any) => e !== callback
      );
    };
  },
  emit(eventName: string, ...args: any[]) {
    const callbacks = this.events[eventName];
    callbacks.forEach((callback: Function) => callback(...args));
  },
});
```

## usage

```javascript
const events = createEvent();
events.on("say", function () {
  console.log("say hello");
});

events.emit("say");
```
