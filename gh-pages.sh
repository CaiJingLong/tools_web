#!/bin/bash

# The shell is run in github workflow
export MY_GIT_URL=https://github.com/CaiJingLong/tools_web.git

pnpm install
pnpm run build

export work_dir=$(pwd)
export dist_dir=$work_dir/dist

cd /tmp
if [ -d "gh-pages" ]; then
    rm -rf gh-pages
fi
mkdir gh-pages

cd gh-pages

cp -r $dist_dir/* .

git init

git checkout --orphan gh-pages
git remote add origin $MY_GIT_URL

git config user.email cjl_spy@163.com
git config user.name CaiJingLong

git add .
git commit -m "update gh-pages"
git push origin gh-pages --force
