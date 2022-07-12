---
title: "shell脚本书写规则"
date: 2022-07-11T17:17:11+08:00
tags: ["shell"]
categories:
draft: false
---


```shell
#!/usr/bin/bash

dirs=("ba" "crew" "file" "knowledge" "main" "oils" "system" "voyageno" "certificate")


function toggleRef() {
    for dir in ${dirs[@]}
    do
        cd "./packages/shoreside-${dir}"

        # if ( $1 ) 
        # then
            if [ $1 = 'branch' ]
            then

                currentBranch=$(git rev-parse --abbrev-ref HEAD)

                if [ $currentBranch = $2 ]
                then
                    git pull
                    cd ../../
                    continue
                else
                    git checkout $2
                    git pull
                fi
                
            elif [ $1 = "build" ]
            then
                yarn install && yarn build
            else
                pwd;
            fi
        # else
        #     echo "参数缺失！"
        #     break
        # fi

        cd ../../
    done
}

toggleRef $1 $2
```