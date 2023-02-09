---
title: "jenkins 配置模板代码"
date: 2023-02-08T21:26:52+08:00
draft: false
tags: ["jenkins", "linux"]
categories: ["jenkins"]
---

```jenkinsfile
node {
  stage('project clone') {
    checkout([$class: 'GitSCM', branches: [[name: '$branch']], extensions: [], userRemoteConfigs: [[credentialsId: '1e3f22cb-0e4d-46a4-b34c-5b5296c1ff0d', url: 'git url']]])
  }

  stage('install and build') {
    sh 'yarn install'
    sh 'yarn run build:prod'
  }

  stage('send to remote server') {
    sshPublisher(
      publishers: [
        sshPublisherDesc(
          configName: 'ip',
          transfers: [
            sshTransfer(
              cleanRemote: false,
              excludes: '',
              execCommand: '',
              execTimeout: 120000,
              flatten: false,
              makeEmptyDirs: false,
              noDefaultExcludes: false,
              patternSeparator: '[, ]+',
              remoteDirectory: '/data/vue/xxxx/xxxx/land',
              remoteDirectorySDF: false,
              removePrefix: '',
              sourceFiles: 'main.tar.gz'
            )
          ],
      usePromotionTimestamp: false,
      useWorkspaceInPromotion: false,
      verbose: false
      )
      ]
      )
  }
}
```
