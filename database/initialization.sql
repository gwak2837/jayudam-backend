-- public 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public AUTHORIZATION jayudam_admin;

COMMENT ON SCHEMA public IS 'standard public schema';

GRANT ALL ON SCHEMA public TO jayudam_admin;

-- deleted 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS deleted CASCADE;

CREATE SCHEMA deleted AUTHORIZATION jayudam_admin;

COMMENT ON SCHEMA deleted IS 'deleted records history';

GRANT ALL ON SCHEMA deleted TO jayudam_admin;

-- sex: 0=미확인, 1=남성, 2=여성
CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email varchar(50) UNIQUE,
  nickname varchar(20) UNIQUE,
  phone_number varchar(20) UNIQUE,
  birthyear char(4),
  birthday char(4),
  sex int,
  bio varchar(100),
  image_url text,
  --
  kakao_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  bbaton_oauth text UNIQUE,
  google_oauth text UNIQUE
);

CREATE TABLE notification (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "type" int NOT NULL,
  contents text NOT NULL,
  link text NOT NULL,
  is_read boolean NOT NULL DEFAULT FALSE,
  --
  receiver_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE,
  sender_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE deleted.user (
  id uuid PRIMARY KEY,
  creation_time timestamptz NOT NULL,
  modification_time timestamptz NOT NULL,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email varchar(50),
  phone_number varchar(20),
  nickname varchar(20),
  bio varchar(100),
  birthyear char(4),
  birthday char(4),
  sex int,
  image_url text,
  --
  kakao_oauth text
);