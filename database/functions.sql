CREATE FUNCTION toggle_liking_post (
  user_id uuid,
  post_id bigint,
  out result boolean,
  out like_count int
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM post_x_user
WHERE post_x_user.user_id = toggle_liking_post.user_id
  AND post_x_user.post_id = toggle_liking_post.post_id;

IF FOUND THEN
DELETE FROM post_x_user
WHERE post_x_user.user_id = toggle_liking_post.user_id
  AND post_x_user.post_id = toggle_liking_post.post_id;

result = FALSE;

ELSE
INSERT INTO post_x_user (user_id, post_id)
VALUES (
    toggle_liking_post.user_id,
    toggle_liking_post.post_id
  );

result = TRUE;

END IF;

SELECT COUNT(post_x_user.user_id) INTO like_count
FROM post_x_user
WHERE post_x_user.post_id = toggle_liking_post.post_id;

END $$;