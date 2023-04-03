#!/bin/bash

rm -rf public

hugo --minify

git subtree push --prefix=public origin gh-pages