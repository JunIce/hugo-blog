---
title: "threejs 笔记"
date: 2024-03-18T21:32:35+08:00
tags: ["threejs"]
categories: ["threejs"]
draft: false
---

## 162 → r163

- WebGLRenderer不再支持WebGL 1。您必须将应用程序迁移到WebGL 2，以便更新到新版本的three.js。
- 出于性能原因，WebGLRenderer的stencil context属性现在默认为false。如果您在应用中使用与模具相关的逻辑，则必须现在显式启用模具。WebGPURenderer对应的stencil属性现在默认也是false。

```md
- WebGLRenderer does not support WebGL 1 anymore. You have to migrate your application to WebGL 2 in order to update to newer versions of three.js.

- The stencil context attribute of WebGLRenderer is now false by default for performance reasons. If you use stencil related logic in your app, you have to enable stencil explicitly now. The corresponding stencil property of WebGPURenderer is now false by default as well.
```


# r161 → r162

- WebGLMultipleRenderTargets已删除。使用渲染目标类的新count属性进行MRT使用。
- 默认情况下，手跟踪不再被要求作为可选功能。你现在必须在应用程序级别手动执行此操作，如相关示例中所示。
- InteractiveGroup的API已更改。您必须使用新的方法RectoXRControllerEvents（）和RectoToPointerEvents（）来注册内部事件侦听器。
- 当为纹理使用HTMLImageElement的实例时，渲染器现在使用naturalWidth和naturalHeight而不是width和height来计算图像尺寸。如果图像是DOM的一部分并使用CSS调整大小，则可以在应用程序级别上进行简化。

```md
- WebGLMultipleRenderTargets has been removed. Use the new count property of the render target classes for MRT usage.
- Hand-Tracking is not requested as an optional feature by default anymore. You have to do this manually on app level now like demonstrated in the related examples.
- The API of InteractiveGroup has been changed. You have to use the new methods listenToXRControllerEvents() and listenToPointerEvents() to register the internal event listeners.
- When using an instance of HTMLImageElement for a texture, the renderer uses now naturalWidth and naturalHeight instead of width and height for computing the image dimensions. This enables simplifications on app level if the images are part of the DOM and resized with CSS.
```

## r160 → r161

- 构建文件build/three.js和build/three.min.js已被删除。请使用ES模块或替代品：https://threejs.org/docs/index.html#manual/en/introduction/Installation
- WebGLRenderer现在为所有GLSL采样器类型指定精度限定符。
- GroundProjectedSkybox被GroundedSkybox取代。
- 当使用等距矩形环境贴图时，WebGLRenderer现在自动转换为具有更大纹理大小的立方体贴图格式。这可以避免采样不足导致模糊输出，但需要更多内存。如果遇到性能问题，请降低等距矩形环境贴图的分辨率。

```md
- The build files build/three.js and build/three.min.js have been removed. Please use ES Modules or alternatives: https://threejs.org/docs/index.html#manual/en/introduction/Installation
- WebGLRenderer now specifies precision qualifiers for all GLSL sampler types.
- GroundProjectedSkybox has been replaced with GroundedSkybox.
- When using equirectangular environment maps, WebGLRenderer automatically converts to the cube map format with a larger texture size now. This avoids undersampling resulting in blurry output but it requires more memory. If you encounter performance issues, decrease the resolution of your equirectangular environment map.
```

## r112 → r113
- Math已重命名为MathUtils，并且/examples/js/utils/MathUtils. js已提升为核心。
- WebGLRenderTargetCube已重命名为WebGLCubeRenderTarget，构造函数签名现在为WebGLCubeRenderTarget（size，options）。
- 已将Geometry.applyMatrix（）重命名为Geometry.applyMatrix4（）。
- BufferGeometry.applyMatrix（）已重命名为BufferGeometry. applyMatrix 4（）。
- Object3D.applyMatrix（）已重命名为Object3D.applyMatrix 4（）。
- LineSegmentsGeometry.applyMatrix（）已重命名为LineSegmentsGeometry. applyMatrix 4（）。
- Frustum.setFromMatrix（）已重命名为Frustum.setFromProjectionMatrix（）。
- 已删除RaytracingRenderer。
- WebGLDeferredRenderer已删除。
- GammaCorrectionShader现在转换为sRGB。
- 网格、点、线和所有派生类的默认材质的颜色现在为白色。

## r111 → r112

- PMREMGenerator有一个新的实现，现在是核心库的一部分。查看webgl_loader_gltf示例以了解新的工作流。
- WebGLRenderer.gammaInput已删除。通过Texture.encoding设置纹理的编码。
- WebGLRenderer.gammaOutput已删除。请改用WebGLRenderer.outputEncoding。
- MeshToonMaterial不再支持环境贴图。
- 删除了mesh.drawMode和mesh.setDrawMode（）。WebGLRenderer现在总是使用THREE.TrianglesDrawMode渲染网格。请使用BufferGeometryUtils.toTrianglesDrawMode（）将现有几何的THREE.TriangleStripDrawMode和THREE.TriangleFanDrawMode转换为THREE. TrianglesDrawMode。
- TerrainShader，SkinShader和CarControls已被删除。
- WebVR支持已被移除。请使用WebXR。
- MeshStandardMaterial.roughness的默认值已从0.5更改为1。
- MeshStandardMaterial.metalness的默认值已从0.5更改为0。
- FaceNormalsHelper、LightProbeHelper、PositionalAudioHelper、PunctureAreaLightHelper、VertexNormalsHelper和VertexTangentsHelper现在是示例的一部分。
- BufferGeometry的重命名现在至少需要一个位置属性或索引。