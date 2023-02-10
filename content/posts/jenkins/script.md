---
title: "jenkins 配置模板代码"
date: 2023-02-08T21:26:52+08:00
draft: false
tags: ["jenkins", "linux"]
categories: ["jenkins"]
---

```jenkinsfile
def pkgName = "pkgname"
node {
    properties([
        parameters([
            booleanParam(description: '是否发布生产', name: 'isprod')
        ])
    ])


    stage('clone') {
        checkout([$class: 'GitSCM', branches: [
            [name: '$branch']
        ], extensions: [], userRemoteConfigs: [
            [credentialsId: '1e3f22cb', url: 'git']
        ]])
    }

    stage('install&build') {
        sh 'yarn install --registry=https://registry.npmmirror.com'
        
        // 修改源码打包目录
        sh 'sed -i "s#../../html/modules/##g" vue.config.js'
        // 测试环境修改path路径
        if (params.isprod) {
            sh 'sed -i "s#shoreside/#shoreside/prod/#g" ./src/settings.js'
        } else {
            sh 'sed -i "s#shoreside/#shoreside/test/#g" ./src/settings.js'
        }

        sh 'yarn run build:prod'

        // 回退文件改动
        sh """
            git checkout ./vue.config.js
            git checkout ./src/settings.js
        """
        // 压缩目录
        sh "tar -zcvf ${pkgName}.tar.gz ${pkgName}/"
    }

    stage('deploy') {
        // oss
        def OSS_PATH = "/test/html/modules/${pkgName}"
        if (params.isprod) {
            OSS_PATH = "/prod/html/modules/${pkgName}"
        }
        aliyunOSSUpload accessKeyId: 'key', accessKeySecret: 'value', bucketName: 'ihaiking', endpoint: 'oss-cn-shanghai.aliyuncs.com', localPath: "/${pkgName}", maxRetries: '3', remotePath: OSS_PATH

        // ftp
        // 远程服务器地址
        def SERVER_PATH = "/data/vptest/land"
        if (params.isprod) {
            SERVER_PATH = '/data/vp/land'
        }

        def EXECUTE_SHELL = """
            source /etc/profile 
            cd ${SERVER_PATH}
            tar --overwrite -zxvf ${pkgName}.tar.gz -C ./html/modules
        """
        def SOURCE_FILE = "${pkgName}.tar.gz"
        sshPublisher(publishers: [sshPublisherDesc(configName: '(192.168.0.19_prd)', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: EXECUTE_SHELL, execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: SERVER_PATH, remoteDirectorySDF: false, removePrefix: '', sourceFiles: SOURCE_FILE)], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
    }
}
```
