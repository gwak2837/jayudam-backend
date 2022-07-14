/* @name verifyTown */
UPDATE "user"
SET town1_count = CASE
    WHEN $2 = town1_name THEN town1_count + 1
    ELSE town1_count
  END,
  town2_count = CASE
    WHEN $2 = town2_name THEN town2_count + 1
    ELSE town2_count
  END
WHERE id = $1
RETURNING town1_count,
  town1_name,
  town2_count,
  town2_name;