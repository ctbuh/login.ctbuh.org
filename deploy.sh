#!/bin/sh

npm run forever-stop

# run at least once
# git config credential.helper store
git pull

npm install --production
npm prune --production

npm run build
npm run forever