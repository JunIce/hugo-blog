---
title: "threejs 笔记"
date: 2024-03-18T21:32:35+08:00
tags: ["threejs"]
categories: ["threejs"]
draft: false
---



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