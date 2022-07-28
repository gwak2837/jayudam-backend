/* @name updateCertAgreement */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  cert_agreement = $2
WHERE id = $1;