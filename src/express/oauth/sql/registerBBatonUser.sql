/* @name registerBBatonUser */
INSERT INTO "user" (
    is_verified_sex,
    oauth_bbaton,
    personal_data_storing_period,
    sex
  )
VALUES(TRUE, $1, $2, $3)
RETURNING id;