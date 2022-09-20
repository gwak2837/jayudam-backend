/* @name getMyCertAgreement */
SELECT cert_agreement,
  cherry
FROM "user"
WHERE id = $1;