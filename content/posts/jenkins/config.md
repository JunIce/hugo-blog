---
title: "jenkinsfile 配置说明"
date: 2022-06-19T15:09:27+08:00
tags:
categories: ["Jenkins"]
draft: false
---



## agent



运行环境，每个pipeline都需要定义运行环境



在执行引擎中，`agent` 指令会引起以下操作的执行：

- 所有在块block中的步骤steps会被Jenkins保存在一个执行队列中。 一旦一个执行器 [executor](https://www.jenkins.io/zh/doc/pipeline/tour/agents/#../../book/glossary/#executor) 是可以利用的，这些步骤将会开始执行。
- 一个工作空间 [workspace](https://www.jenkins.io/zh/doc/pipeline/tour/agents/#../../book/glossary/#workspace) 将会被分配， 工作空间中会包含来自远程仓库的文件和一些用于Pipeline的工作文件



```bash
pipeline {
    agent {
        docker { image 'node:7-alpine' }
    }
    stages {
        stage('Test') {
            steps {
                sh 'node --version'
            }
        }
    }
}
```



## environment



环境变量，可以提供给下面脚本使用



环境变量可以像下面的示例设置为全局的，也可以是阶段（stage）级别的。 如你所想，阶段（stage）级别的环境变量只能在定义变量的阶段（stage）使用。



```bash
pipeline {
    agent any

    environment {
        DISABLE_AUTH = 'true'
        DB_ENGINE    = 'sqlite'
    }

    stages {
        stage('Build') {
            steps {
                sh 'printenv'
            }
        }
    }
}
```





## pipeline



Pipelines 由多个步骤（step）组成，允许你构建、测试和部署应用。 Jenkins Pipeline 允许您使用一种简单的方式组合多个步骤， 以帮助您实现多种类型的自动化构建过程。

可以把“步骤（step）”看作一个执行单一动作的单一的命令。 当一个步骤运行成功时继续运行下一个步骤。 当任何一个步骤执行失败时，Pipeline 的执行结果也为失败。

当所有的步骤都执行完成并且为成功时，Pipeline 的执行结果为成功。



每个stages中可以包含多个stage

```bash
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Hello World"'
                sh '''
                    echo "Multiline shell steps works too"
                    ls -lah
                '''
            }
        }
    }
}
```



- pipeline 流水线声明
- stages 阶段，内部可以包含多个stage, 其中内部stage可以自定义名称，方便日志时打印出来
  - steps 步骤， 就是具体脚本平台执行的命令，不同的系统平台有不同的命令
- post 完成时动作，可以用作清理数据
  - awalys 总是会执行
  - success 成功后执行
  - failure 失败后执行
  - unstable 未稳定构建后执行
  - changed 上次成功，这次失败，即状态变更后执行





### 重试和超时



```bash
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                retry(3) {
                    sh './flakey-deploy.sh'
                }

                timeout(time: 3, unit: 'MINUTES') {
                    sh './health-check.sh'
                }
            }
        }
    }
}
```



### 邮件



```sh
post {
    failure {
        mail to: 'team@example.com',
             subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
             body: "Something is wrong with ${env.BUILD_URL}"
    }
}
```



## post 完成时执行



```bash
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'echo "Fail!"; exit 1'
            }
        }
    }
    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
```


### dir 切换jenkins中工作目录

pipeline中用于切换目录


```bash
steps {
    sh "pwd"
    dir('your-sub-directory') {
      sh "pwd"
    }
    sh "pwd"
}
```

Use WORKSPACE environment variable to change workspace directory.

If doing using Jenkinsfile, use following code :

```bash
dir("${env.WORKSPACE}/aQA"){
    sh "pwd"
}
```
