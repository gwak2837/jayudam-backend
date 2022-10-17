/* @name myLeaderIds */
SELECT leader_id
FROM user_x_user
WHERE follower_id = $1;