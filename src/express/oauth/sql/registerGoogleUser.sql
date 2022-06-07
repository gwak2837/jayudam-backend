/* @name registerGoogleUser */
INSERT INTO "user" (
    email,
    nickname,
    phone_number,
    birthyear,
    birthday,
    sex,
    bio,
    image_url,
    google_oauth
  )
VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9
  )
RETURNING id;