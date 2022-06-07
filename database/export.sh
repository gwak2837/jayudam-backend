#!/bin/sh
if [[ $1 == "prod" ]]; then
  ENV_FILE_PATH=.env.local
  FOLDER=prod
elif [[ $1 == "dev" ]]; then
  ENV_FILE_PATH=.env.development
  FOLDER=dev
else
  ENV_FILE_PATH=.env.development.local
  FOLDER=local
fi

if [ ! -f $ENV_FILE_PATH ]; then
  echo "$ENV_FILE_PATH 파일이 존재하지 않습니다. $ENV_FILE_PATH 파일을 생성한 후 다시 시도해주세요."
  exit 1
fi

export $(grep -v '^#' $ENV_FILE_PATH | xargs)

if [[ $1 == "prod" ]]; then
  PGURI_WITH_SSL=$PGURI?sslmode=require
elif [[ $1 == "dev" ]]; then
  PGURI_WITH_SSL=$PGURI?sslmode=require
else
  PGURI_WITH_SSL=$PGURI
fi

echo $PGURI_WITH_SSL

rm -rf database/data/$FOLDER
mkdir -p database/data/$FOLDER

psql -Atc "SELECT schema_name FROM information_schema.schemata" $PGURI_WITH_SSL |
  while read SCHEMA; do
    if [[ "$SCHEMA" != "pg_catalog" && "$SCHEMA" != "information_schema" ]]; then
      psql -Atc "SELECT tablename FROM pg_tables WHERE schemaname='$SCHEMA'" $PGURI_WITH_SSL |
        while read TABLE; do
          echo $SCHEMA.$TABLE.csv
          psql -c "COPY $SCHEMA.$TABLE TO STDOUT WITH CSV DELIMITER ',' HEADER ENCODING 'UTF-8'" $PGURI_WITH_SSL >database/data/$FOLDER/$SCHEMA.$TABLE.csv
        done
    fi
  done
