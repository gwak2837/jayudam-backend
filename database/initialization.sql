-- public 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public AUTHORIZATION jayudam;

COMMENT ON SCHEMA public IS 'standard public schema';

GRANT ALL ON SCHEMA public TO jayudam;

-- deleted 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS deleted CASCADE;

CREATE SCHEMA deleted AUTHORIZATION jayudam;

COMMENT ON SCHEMA deleted IS 'deleted records history';

GRANT ALL ON SCHEMA deleted TO jayudam;

-- validation_time 이전 JWT 토큰은 유효하지 않음
-- gender: 0=미확인, 1=남성, 2=여성
CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email varchar(50) UNIQUE,
  nickname varchar(20) UNIQUE,
  phone_number varchar(20) UNIQUE,
  birthyear char(4),
  birthday char(4),
  gender int,
  bio varchar(100),
  image_url text,
  --
  kakao_oauth text UNIQUE,
  validation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 그룹 삭제 시 creation_time 등 삭제되기 때문에 nullable
CREATE TABLE "group" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  name varchar(20) NOT NULL,
  description varchar(100),
  image_url text,
  --
  leader_id uuid REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE user_x_group (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  group_id bigint REFERENCES "group" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, group_id)
);

CREATE TABLE post (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  contents text NOT NULL,
  image_urls text [],
  --
  user_id uuid REFERENCES "user" ON DELETE
  SET NULL,
    group_id bigint REFERENCES "group" ON DELETE
  SET NULL
);

CREATE TABLE zoom (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  description varchar(200) NOT NULL,
  image_url text NOT NULL,
  start_time timestamptz NOT NULL,
  when_where text NOT NULL,
  when_what text [] NOT NULL,
  tags varchar(20) []
);

CREATE TABLE user_x_joined_zoom (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  zoom_id bigint REFERENCES zoom ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, zoom_id)
);

CREATE TABLE zoom_review (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  --
  zoom_id bigint NOT NULL REFERENCES zoom ON DELETE CASCADE,
  user_id uuid REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE user_x_liked_zoom_review (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  zoom_review_id bigint REFERENCES zoom_review ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, zoom_review_id)
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

CREATE TABLE "comment" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  contents text,
  image_urls text [],
  --
  comment_id bigint REFERENCES "comment" ON DELETE
  SET NULL,
    post_id bigint REFERENCES post ON DELETE
  SET NULL,
    user_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE user_x_liked_comment (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE poll (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closing_time timestamptz,
  title varchar(100) NOT NULL,
  "status" int NOT NULL DEFAULT 0,
  contents text
);

CREATE TABLE poll_selection (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  "count" int,
  --
  poll_id bigint REFERENCES poll ON DELETE CASCADE
);

CREATE TABLE poll_selection_x_user (
  poll_selection_id bigint REFERENCES poll_selection ON DELETE CASCADE,
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (poll_selection_id, user_id)
);

CREATE TABLE poll_comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  contents text,
  image_urls text [],
  --
  poll_comment_id bigint REFERENCES poll_comment ON DELETE
  SET NULL,
    poll_id bigint REFERENCES poll ON DELETE
  SET NULL,
    user_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE user_x_liked_poll_comment (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  poll_comment_id bigint REFERENCES poll_comment ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, poll_comment_id)
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
  gender int,
  image_url text,
  --
  kakao_oauth text
);

CREATE TABLE deleted.group (
  id bigint PRIMARY KEY,
  creation_time timestamptz NOT NULL,
  modification_time timestamptz NOT NULL,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(20) NOT NULL,
  description varchar(100) NOT NULL,
  image_url text
);

CREATE TABLE deleted.post (
  id bigint PRIMARY KEY,
  creation_time timestamptz NOT NULL,
  modification_time timestamptz NOT NULL,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  contents text [] NOT NULL,
  image_urls text [],
  --
  user_id uuid NOT NULL,
  group_id bigint NOT NULL
);

CREATE TABLE deleted.comment (
  id bigint PRIMARY KEY,
  creation_time timestamptz NOT NULL,
  modification_time timestamptz NOT NULL,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  image_urls text [],
  --
  comment_id bigint,
  post_id bigint,
  user_id uuid
);

CREATE TABLE deleted.poll_comment (
  id bigint PRIMARY KEY,
  creation_time timestamptz NOT NULL,
  modification_time timestamptz NOT NULL,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  image_urls text [],
  --
  poll_comment_id bigint,
  poll_id bigint,
  user_id uuid
);

CREATE FUNCTION delete_user () RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO deleted.user(
    id,
    creation_time,
    modification_time,
    email,
    nickname,
    phone_number,
    birthyear,
    birthday,
    gender,
    bio,
    image_url,
    kakao_oauth
  )
VALUES(
    OLD.id,
    OLD.creation_time,
    OLD.modification_time,
    OLD.email,
    OLD.nickname,
    OLD.phone_number,
    OLD.birthyear,
    OLD.birthday,
    OLD.gender,
    OLD.bio,
    OLD.image_url,
    OLD.kakao_oauth
  );

RETURN OLD;

END $$;

CREATE TRIGGER delete_user BEFORE DELETE ON "user" FOR EACH ROW EXECUTE FUNCTION delete_user();

CREATE FUNCTION create_group(
  user_id uuid,
  name varchar(20),
  description varchar(100) DEFAULT NULL,
  image_url text DEFAULT NULL,
  out group_id bigint
) LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO "group" (name, description, image_url)
VALUES (name, description, image_url)
RETURNING id INTO group_id;

INSERT INTO user_x_group(user_id, group_id)
VALUES(create_group.user_id, create_group.group_id);

END $$;

CREATE FUNCTION delete_comment (
  comment_id bigint,
  user_id uuid,
  out deleted_comment_id bigint
) LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO deleted.comment (
    id,
    creation_time,
    modification_time,
    contents,
    image_urls,
    comment_id,
    post_id,
    user_id
  )
SELECT *
FROM "comment"
WHERE id = delete_comment.comment_id
  AND "comment".user_id = delete_comment.user_id;

UPDATE "comment"
SET modification_time = CURRENT_TIMESTAMP,
  contents = NULL,
  image_urls = NULL
WHERE id = delete_comment.comment_id
  AND "comment".user_id = delete_comment.user_id
RETURNING id INTO deleted_comment_id;

DELETE FROM user_x_liked_comment
WHERE user_x_liked_comment.comment_id = delete_comment.comment_id;

END $$;

CREATE FUNCTION toggle_liking_comment (
  user_id uuid,
  comment_id bigint,
  out result boolean,
  out liked_count int
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_comment
WHERE user_x_liked_comment.user_id = toggle_liking_comment.user_id
  AND user_x_liked_comment.comment_id = toggle_liking_comment.comment_id;

IF FOUND THEN
DELETE FROM user_x_liked_comment
WHERE user_x_liked_comment.user_id = toggle_liking_comment.user_id
  AND user_x_liked_comment.comment_id = toggle_liking_comment.comment_id;

result = FALSE;

ELSE
INSERT INTO user_x_liked_comment (user_id, comment_id)
VALUES (
    toggle_liking_comment.user_id,
    toggle_liking_comment.comment_id
  );

result = TRUE;

END IF;

SELECT COUNT(user_x_liked_comment.user_id) INTO liked_count
FROM user_x_liked_comment
WHERE user_x_liked_comment.comment_id = toggle_liking_comment.comment_id;

END $$;

CREATE FUNCTION toggle_joining_group (
  user_id uuid,
  group_id bigint,
  out is_joined boolean
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_group
WHERE user_x_group.user_id = toggle_joining_group.user_id
  AND user_x_group.group_id = toggle_joining_group.group_id;

IF FOUND THEN
DELETE FROM user_x_group
WHERE user_x_group.user_id = toggle_joining_group.user_id
  AND user_x_group.group_id = toggle_joining_group.group_id;

is_joined = FALSE;

ELSE
INSERT INTO user_x_group (user_id, group_id)
VALUES (
    toggle_joining_group.user_id,
    toggle_joining_group.group_id
  );

is_joined = TRUE;

END IF;

END $$;

CREATE FUNCTION toggle_joining_zoom (
  user_id uuid,
  zoom_id bigint,
  out result boolean,
  out nickname varchar(20),
  out phone_number varchar(20),
  out title text
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_joined_zoom
WHERE user_x_joined_zoom.user_id = toggle_joining_zoom.user_id
  AND user_x_joined_zoom.zoom_id = toggle_joining_zoom.zoom_id;

IF FOUND THEN
DELETE FROM user_x_joined_zoom
WHERE user_x_joined_zoom.user_id = toggle_joining_zoom.user_id
  AND user_x_joined_zoom.zoom_id = toggle_joining_zoom.zoom_id;

result = FALSE;

ELSE
INSERT INTO user_x_joined_zoom (user_id, zoom_id)
VALUES (
    toggle_joining_zoom.user_id,
    toggle_joining_zoom.zoom_id
  );

result = TRUE;

END IF;

SELECT zoom.title INTO toggle_joining_zoom.title
FROM zoom
WHERE id = zoom_id;

SELECT "user".nickname,
  "user".phone_number INTO toggle_joining_zoom.nickname,
  toggle_joining_zoom.phone_number
FROM "user"
WHERE id = user_id;

END $$;

CREATE FUNCTION search_post (keywords text []) RETURNS TABLE (id bigint) LANGUAGE plpgsql STABLE AS $$ BEGIN RETURN QUERY
SELECT post.id
FROM post
WHERE title LIKE ANY (keywords)
  OR contents LIKE ANY (keywords);

END $$;

CREATE FUNCTION toggle_liking_zoom_review (
  user_id uuid,
  zoom_review_id bigint,
  out result boolean,
  out likes_count int
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_zoom_review
WHERE user_x_liked_zoom_review.user_id = toggle_liking_zoom_review.user_id
  AND user_x_liked_zoom_review.zoom_review_id = toggle_liking_zoom_review.zoom_review_id;

IF FOUND THEN
DELETE FROM user_x_liked_zoom_review
WHERE user_x_liked_zoom_review.user_id = toggle_liking_zoom_review.user_id
  AND user_x_liked_zoom_review.zoom_review_id = toggle_liking_zoom_review.zoom_review_id;

result = FALSE;

ELSE
INSERT INTO user_x_liked_zoom_review (user_id, zoom_review_id)
VALUES (
    toggle_liking_zoom_review.user_id,
    toggle_liking_zoom_review.zoom_review_id
  );

result = TRUE;

END IF;

SELECT COUNT(user_x_liked_zoom_review.user_id) INTO likes_count
FROM user_x_liked_zoom_review
WHERE user_x_liked_zoom_review.zoom_review_id = toggle_liking_zoom_review.zoom_review_id;

END $$;