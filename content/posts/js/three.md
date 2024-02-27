---
title: "three 拼接货架"
date: 2024-02-24T08:35:32+08:00
tags: ["three", "demo"]
categories: ["js"]
draft: false
---

# three 拼接货架

```js
const PILLAR_WIDTH = 2;
const COLOR = 0x666666;
const SHELF_HEIGHT = 150;
const SHELF_LENGTH = 100;
const SHELF_WIDTH = 50;

function createshelve(scene) {
  // 柱子
  const pillar1 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, SHELF_HEIGHT, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar1.position.x = -SHELF_LENGTH / 2;
  pillar1.position.y = 0;
  scene.add(pillar1);

  const pillar2 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, SHELF_HEIGHT, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar2.position.x = -SHELF_LENGTH / 2;
  pillar2.position.z = -SHELF_WIDTH;
  scene.add(pillar2);

  const pillar3 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, SHELF_HEIGHT, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar3.position.x = SHELF_LENGTH / 2;
  pillar3.position.y = 0;
  scene.add(pillar3);

  const pillar4 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, SHELF_HEIGHT, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar4.position.x = SHELF_LENGTH / 2;
  pillar4.position.z = -SHELF_WIDTH;
  scene.add(pillar4);

  let HalfWidth = SHELF_HEIGHT / 2 - PILLAR_WIDTH / 2;
  // 边
  const pillar5 = new Mesh(
    new BoxGeometry(SHELF_LENGTH, PILLAR_WIDTH, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar5.position.x = 0;
  pillar5.position.z = 0;
  pillar5.position.y = HalfWidth;
  scene.add(pillar5);

  const pillar6 = new Mesh(
    new BoxGeometry(SHELF_LENGTH, PILLAR_WIDTH, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar6.position.x = 0;
  pillar6.position.z = 0;
  pillar6.position.y = -HalfWidth;
  scene.add(pillar6);

  const pillar7 = new Mesh(
    new BoxGeometry(SHELF_LENGTH, PILLAR_WIDTH, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar7.position.x = 0;
  pillar7.position.z = -SHELF_WIDTH;
  pillar7.position.y = -HalfWidth;
  scene.add(pillar7);

  const pillar8 = new Mesh(
    new BoxGeometry(SHELF_LENGTH, PILLAR_WIDTH, PILLAR_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar8.position.x = 0;
  pillar8.position.z = -SHELF_WIDTH;
  pillar8.position.y = HalfWidth;
  scene.add(pillar8);

  // 横边
  const pillar9 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, PILLAR_WIDTH, SHELF_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar9.position.x = -SHELF_LENGTH / 2;
  pillar9.position.z = -SHELF_WIDTH / 2;
  pillar9.position.y = HalfWidth;
  scene.add(pillar9);

  const pillar10 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, PILLAR_WIDTH, SHELF_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar10.position.x = SHELF_LENGTH / 2;
  pillar10.position.z = -SHELF_WIDTH / 2;
  pillar10.position.y = HalfWidth;
  scene.add(pillar10);

  const pillar11 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, PILLAR_WIDTH, SHELF_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar11.position.x = -SHELF_LENGTH / 2;
  pillar11.position.z = -SHELF_WIDTH / 2;
  pillar11.position.y = -HalfWidth;
  scene.add(pillar11);

  const pillar12 = new Mesh(
    new BoxGeometry(PILLAR_WIDTH, PILLAR_WIDTH, SHELF_WIDTH),
    new MeshLambertMaterial({ color: COLOR })
  );
  pillar12.position.x = SHELF_LENGTH / 2;
  pillar12.position.z = -SHELF_WIDTH / 2;
  pillar12.position.y = -HalfWidth;
  scene.add(pillar12);
}
```