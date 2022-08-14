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

-- 함수 생성
CREATE extension IF NOT EXISTS pgcrypto;

CREATE FUNCTION random_string(len int) RETURNS text AS $$
DECLARE chars text [] = '{3,4,5,6,7,8,9,a,b,c,d,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z}';

result text = '';

i int = 0;

rand bytea;

BEGIN -- generate secure random bytes and convert them to a string of chars.
rand = gen_random_bytes($1);

FOR i IN 0..len -1 loop -- rand indexing is zero-based, chars is 1-based.
result = result || chars [1 + (get_byte(rand, i) % array_length(chars, 1))];

END loop;

RETURN result;

END;

$$ language plpgsql;

CREATE FUNCTION unique_random(len int, _table text, _col text) RETURNS text AS $$
DECLARE result text;

numrows int;

BEGIN result = random_string(len);

loop EXECUTE format(
  'select 1 from %I where %I = %L',
  _table,
  _col,
  result
);

get diagnostics numrows = row_count;

IF numrows = 0 THEN RETURN result;

END IF;

result = random_string(len);

END loop;

END;

$$ language plpgsql;

CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  update_time timestamptz,
  bio varchar(100),
  birthyear int,
  birthday char(4),
  blocking_start_time timestamptz,
  blocking_end_time timestamptz,
  cert_agreement text,
  cherry int NOT NULL DEFAULT 10 CHECK (cherry >= 0),
  deactivation_time timestamptz,
  email varchar(50) UNIQUE,
  grade int DEFAULT 0,
  legal_name varchar(30),
  image_urls text [],
  invitation_code char(8) UNIQUE DEFAULT unique_random(8, 'user', 'invitation_code'),
  is_verified_birthyear boolean NOT NULL DEFAULT FALSE,
  is_verified_birthday boolean NOT NULL DEFAULT FALSE,
  is_verified_email boolean NOT NULL DEFAULT FALSE,
  is_verified_legal_name boolean NOT NULL DEFAULT FALSE,
  is_verified_phone_number boolean NOT NULL DEFAULT FALSE,
  is_verified_sex boolean NOT NULL DEFAULT FALSE,
  last_attendance timestamptz,
  name varchar(30),
  nickname varchar(30) UNIQUE,
  oauth_bbaton varchar(100) NOT NULL UNIQUE,
  oauth_google varchar(100) UNIQUE,
  oauth_kakao varchar(100) UNIQUE,
  oauth_naver varchar(100) UNIQUE,
  personal_data_storing_year int NOT NULL DEFAULT 1,
  phone_number varchar(20) UNIQUE,
  service_agreement text,
  sex int,
  sleeping_time timestamptz,
  town1_count int NOT NULL DEFAULT 0,
  town1_name varchar(50),
  town2_count int NOT NULL DEFAULT 0,
  town2_name varchar(50)
  /* CHECK (town1_name != town2_name) */
);

-- 인증서 검증 요청용
CREATE TABLE cert_pending (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  birthdate timestamptz NOT NULL,
  issue_date timestamptz NOT NULL,
  legal_name varchar(30) NOT NULL,
  sex int NOT NULL,
  verification_code varchar(100) NOT NULL,
  --
  user_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE cert (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  birthdate timestamptz NOT NULL,
  content text NOT NULL,
  effective_date timestamptz NOT NULL,
  issue_date timestamptz NOT NULL,
  legal_name varchar(30) NOT NULL,
  location varchar(100) NOT NULL,
  name varchar(50) NOT NULL,
  sex int NOT NULL,
  "type" int NOT NULL,
  verification_code varchar(100) NOT NULL,
  --
  user_id uuid REFERENCES "user" ON DELETE
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
  content text NOT NULL,
  link_url text NOT NULL,
  is_read boolean NOT NULL DEFAULT FALSE,
  --
  receiver_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE,
  sender_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE post (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  update_time timestamptz,
  deletion_time timestamptz,
  content varchar(200),
  image_urls text [],
  --
  parent_post_id bigint REFERENCES post ON DELETE
  SET NULL,
    sharing_post_id bigint REFERENCES post ON DELETE
  SET NULL,
    user_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE verification_history (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content text NOT NULL,
  user_id uuid REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE hashtag_x_post (
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  post_id bigint REFERENCES post ON DELETE CASCADE,
  --
  PRIMARY KEY (hashtag_id, post_id)
);

CREATE TABLE hashtag_x_user (
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  --
  PRIMARY KEY (hashtag_id, user_id)
);

-- like
CREATE TABLE post_x_user (
  post_id bigint REFERENCES post ON DELETE CASCADE,
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  --
  PRIMARY KEY (post_id, user_id)
);