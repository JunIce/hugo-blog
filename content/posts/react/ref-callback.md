---
title: "React ref callback"
date: 2023-06-04T11:57:01+08:00
draft: true
tags: ["react"]
categories: ["React"]
---


# React ref callback

```javascript
import React, {useCallback, useRef} from 'react'

function useHookWithRefCallback() {
  const ref = useRef(null)
  const setRef = useCallback(node => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }
    
    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }
    
    // Save a reference to the node
    ref.current = node
  }, [])
  
  return [setRef]
}

function Component() {
  // In your component you'll still recieve a `ref`, but it 
  // will be a callback function instead of a Ref Object
  const [ref] = useHookWithRefCallback()
  
  return <div ref={ref}>Ref element</div>
}
```