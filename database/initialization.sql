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
-- 삭제 시 DELETE 사용하지 말고 oauth를 제외한 필드만 NULL로 초기화
CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  bio varchar(100),
  birthyear char(4),
  birthday char(4),
  blocking_start_time timestamptz,
  blocking_end_time timestamptz,
  deactivation_time timestamptz,
  email varchar(50) UNIQUE,
  image_urls text [],
  is_verified_birthyear boolean NOT NULL DEFAULT FALSE,
  is_verified_birthday boolean NOT NULL DEFAULT FALSE,
  is_verified_email boolean NOT NULL DEFAULT FALSE,
  is_verified_name boolean NOT NULL DEFAULT FALSE,
  is_verified_phone_number boolean NOT NULL DEFAULT FALSE,
  is_verified_sex boolean NOT NULL DEFAULT FALSE,
  name varchar(50),
  nickname varchar(20) UNIQUE,
  phone_number varchar(20) UNIQUE,
  sex int,
  sleeping_time timestamptz,
  -- option
  personal_data_storing_period int NOT NULL DEFAULT 1,
  -- oauth
  kakao_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  bbaton_oauth text NOT NULL UNIQUE,
  google_oauth text UNIQUE
);

-- 한 증명서에 effective_date이 여러 개면 가장 빠른 날짜가 기준
CREATE TABLE certificate (
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  birth_date date NOT NULL,
  certificate_id varchar(100) NOT NULL,
  contents text NOT NULL,
  effective_date date NOT NULL,
  issue_date date NOT NULL,
  name varchar(50) NOT NULL,
  sex int,
  verification_code varchar(200) NOT NULL,
  --
  user_id uuid PRIMARY KEY REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(50) NOT NULL
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

CREATE TABLE post (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  deletion_time timestamptz,
  contents text,
  image_urls text [],
  title varchar(100),
  --
  post_id bigint REFERENCES post ON DELETE
  SET NULL,
    user_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE hashtag_x_user (
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  --
  PRIMARY KEY (hashtag_id, user_id)
);

CREATE TABLE hashtag_x_post (
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  post_id bigint REFERENCES post ON DELETE CASCADE,
  --
  PRIMARY KEY (hashtag_id, post_id)
);