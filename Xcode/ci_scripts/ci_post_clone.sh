#!/bin/sh

set -eo pipefail

brew install nodenv

pushd ..
nodenv install
nodenv exec npm ci
popd
