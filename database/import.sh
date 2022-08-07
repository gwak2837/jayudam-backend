#!/bin/sh
if [[ $1 == "prod" ]]; then
  ENV_FILE_PATH=.env
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

do_not_print=$(PGOPTIONS='--client-min-messages=warning' psql -f database/initialization.sql $PGURI_WITH_SSL)
do_not_print=$(PGOPTIONS='--client-min-messages=warning' psql -f database/functions.sql $PGURI_WITH_SSL)

# 테이블 생성 순서와 동일하게
public_tables=(
  public.user
  public.cert_pending
  public.cert
  public.hashtag
  public.notification
  public.post
  public.verification_history
  public.hashtag_x_user
  public.hashtag_x_post
  public.post_x_user
)

# GENERATED ALWAYS AS IDENTITY 컬럼이 있는 테이블
sequence_tables=(
  cert_pending
  cert
  hashtag
  notification
  post
  verification_history
)

# 테이블 생성 순서와 동일하게
deleted_tables=(
  # deleted.user
)

for public_table in "${public_tables[@]}"; do
  echo ${public_table}
  columns=$(head -1 database/data/$FOLDER/${public_table}.csv)
  psql $PGURI_WITH_SSL -c "COPY ${public_table}(${columns}) FROM STDIN WITH CSV DELIMITER ',' HEADER ENCODING 'UTF-8'" <database/data/$FOLDER/${public_table}.csv
done

for sequence_table in "${sequence_tables[@]}"; do
  echo ${sequence_table} sequence
  psql -c "
    BEGIN;
    LOCK TABLE ${sequence_table} IN EXCLUSIVE MODE;
    SELECT setval(pg_get_serial_sequence('${sequence_table}', 'id'), COALESCE((SELECT MAX(id)+1 FROM ${sequence_table}), 1), false);
    COMMIT;
  " $PGURI_WITH_SSL
done

for deleted_table in "${deleted_tables[@]}"; do
  echo ${deleted_table}
  columns=$(head -1 database/data/$FOLDER/${deleted_table}.csv)
  psql $PGURI_WITH_SSL -c "COPY ${deleted_table}(${columns}) FROM STDIN WITH CSV DELIMITER ',' HEADER ENCODING 'UTF-8'" <database/data/$FOLDER/${deleted_table}.csv
done
