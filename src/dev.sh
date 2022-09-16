#!/bin/sh
graphql-codegen --config codegen.yml --watch --errors-only &
export $(grep -v '^#' .env.development.local | xargs) && pgtyped --watch --config pgtyped.config.json &
sleep 5 && NODE_ENV=development node esbuild.js &
sleep 5 && NODE_ENV=development nodemon -r dotenv/config out/index.cjs dotenv_config_path=.env.development.local
