#!/bin/bash

# The shell is run in github workflow
export MY_GIT_URL=https://github.com/CaiJingLong/tools_web.git

pnpm install
pnpm run dist

export work_dir=$(pwd)
export dist_dir=$work_dir/dist

cd /tmp
git clone $MY_GIT_URL gh-pages
cd gh-pages
git checkout gh-pages

rm -rf *.js
rm -rf *.css
rm -rf *.map
rm -rf *.html

rm **/*.js
rm **/*.css
rm **/*.map
rm **/*.html

cp -r $dist_dir/* .

git add .
git commit -m "update gh-pages"
git push origin gh-pages --force
