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

if [[ $CONNECTION_STRING =~ "@localhost" ]]; then
  CONNECTION_STRING_WITH_SSL=$CONNECTION_STRING
else
  CONNECTION_STRING_WITH_SSL=$CONNECTION_STRING?sslmode=require
fi

echo $CONNECTION_STRING_WITH_SSL

# ./database/export $ENV_FILE_PATH

do_not_print=$(PGOPTIONS='--client-min-messages=warning' psql $CONNECTION_STRING_WITH_SSL -f database/initialization.sql)

# 테이블 생성 순서와 동일하게
public_tables=(
  public.user
  public.group
  public.user_x_group
  public.post
  public.zoom
  public.user_x_joined_zoom
  public.zoom_review
  public.user_x_liked_zoom_review
  public.notification
  public.comment
  public.user_x_liked_comment
  public.poll
  public.poll_selection
  public.poll_selection_x_user
  public.poll_comment
  public.user_x_liked_poll_comment
)

sequence_tables=(
  comment
  \"group\"
  notification
  poll_comment
  poll_selection
  poll
  post
  zoom_review
  zoom
)

# 테이블 생성 순서와 동일하게
deleted_tables=(
  deleted.user
  deleted.group
  deleted.post
  deleted.comment
  deleted.poll_comment
)

for public_table in "${public_tables[@]}"; do
  echo ${public_table}
  columns=$(head -1 database/data/$FOLDER/${public_table}.csv)
  psql $CONNECTION_STRING_WITH_SSL -c "COPY ${public_table}(${columns}) FROM STDIN WITH CSV DELIMITER ',' HEADER ENCODING 'UTF-8'" <database/data/$FOLDER/${public_table}.csv
done

for sequence_table in "${sequence_tables[@]}"; do
  echo ${sequence_table} sequence
  psql $CONNECTION_STRING_WITH_SSL -c "
    BEGIN;
    LOCK TABLE ${sequence_table} IN EXCLUSIVE MODE;
    SELECT setval(pg_get_serial_sequence('${sequence_table}', 'id'), COALESCE((SELECT MAX(id)+1 FROM ${sequence_table}), 1), false);
    COMMIT;
  "
done

for deleted_table in "${deleted_tables[@]}"; do
  echo ${deleted_table}
  columns=$(head -1 database/data/$FOLDER/${deleted_table}.csv)
  psql $CONNECTION_STRING_WITH_SSL -c "COPY ${deleted_table}(${columns}) FROM STDIN WITH CSV DELIMITER ',' HEADER ENCODING 'UTF-8'" <database/data/$FOLDER/${deleted_table}.csv
done
