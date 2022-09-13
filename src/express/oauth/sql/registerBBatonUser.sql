/* @name registerBBatonUser */
INSERT INTO "user" (
    is_verified_sex,
    oauth_bbaton,
    sex
  )
VALUES(TRUE, $1, $2)
RETURNING id;