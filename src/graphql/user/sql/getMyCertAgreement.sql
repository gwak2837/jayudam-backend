/* @name getMyCertAgreement */
SELECT cert_agreement
FROM "user"
WHERE id = $1;