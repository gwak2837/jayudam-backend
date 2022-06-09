#!/bin/sh
NODE_ENV=development node esbuild.js &
graphql-codegen --config codegen.yml --watch --errors-only &
export $(grep -v '^#' .env.development.local | xargs) && pgtyped --watch --config pgtyped.config.json &
NODE_ENV=development nodemon -r dotenv/config out/index.cjs dotenv_config_path=.env.development.local
