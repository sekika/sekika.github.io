#!/bin/sh
# https://stackoverflow.com/questions/24098792/how-to-force-github-pages-build/61706020#61706020
# Settings > Developer settings > Personal access tokens > Generate new token.
echo "Make sure that token is saved and it is not expired. See source." 
token=`cat ~/.config/github/token`
user="sekika"
repo="sekika.github.io"
# https://docs.github.com/ja/rest/pages#request-a-github-pages-build
accept="Accept: application/vnd.github+json"
command="https://api.github.com/repos/$user/$repo/pages/builds"
curl -X POST -H "$accept" -H "Authorization: token $token" $command
