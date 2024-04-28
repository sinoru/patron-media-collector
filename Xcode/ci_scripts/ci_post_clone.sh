#!/bin/sh

set -eo pipefail

git clone --depth 1 --branch "v1.4.1" "https://github.com/nodenv/nodenv.git" ~/.nodenv
export PATH="$HOME/.nodenv/bin:$PATH"

mkdir -p "$(nodenv root)"/plugins
git clone --depth 1 "https://github.com/nodenv/node-build.git" "$(nodenv root)"/plugins/node-build

pushd ..
nodenv install
nodenv exec npm ci --no-fund
popd
