/* @name registerBBatonUser */
INSERT INTO "user" (
    is_verified_sex,
    sex,
    personal_data_storing_period,
    oauth_bbaton
  )
VALUES(TRUE, $1, $2, $3)
RETURNING id;