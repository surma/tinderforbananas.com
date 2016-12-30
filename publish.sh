#!/bin/bash

set -e 

git stash
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
npm run build
git branch -D gh-pages || true
git checkout -f --orphan gh-pages
rm .gitignore
git add dist/*
git mv dist/* .
git clean -f
git commit -am 'Website'
git checkout $CURRENT_BRANCH
git stash pop 

