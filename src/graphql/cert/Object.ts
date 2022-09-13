import { InternalServerError } from '../../fastify/errors'
import { CertType } from '../generated/graphql'

export function decodeCertType(encodedCertType: number | null) {
  if (encodedCertType === null) return null

  if (typeof encodedCertType !== 'number') throw InternalServerError('서버 오류')

  switch (encodedCertType) {
    case 0:
      return CertType.ClinicalLaboratoryTest
    case 1:
      return CertType.StdTest
    case 2:
      return CertType.Immunization
    default:
      return CertType.SexualCrime
  }
}
