#!/usr/bin/env bash

set -e
set -o pipefail
set -v

curl -s -X POST https://api.stackbit.com/project/5e6478cc14b6920012730a0a/webhook/build/pull > /dev/null
if [[ -z "${STACKBIT_API_KEY}" ]]; then
    echo "WARNING: No STACKBIT_API_KEY environment variable set, skipping stackbit-pull"
else
    npx @stackbit/stackbit-pull --stackbit-pull-api-url=https://api.stackbit.com/pull/5e6478cc14b6920012730a0a
fi
curl -s -X POST https://api.stackbit.com/project/5e6478cc14b6920012730a0a/webhook/build/ssgbuild > /dev/null
npm run production
curl -s -X POST https://api.stackbit.com/project/5e6478cc14b6920012730a0a/webhook/build/publish > /dev/null
