#!/bin/sh
export $(grep -v '^#' .env.local | xargs) && pgtyped --config pgtyped.config.json
