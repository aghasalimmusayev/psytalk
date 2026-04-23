export enum UserRole {
  PATIENT = 'patient',
  PSYCHOLOGIST = 'psychologist',
  ADMIN = 'admin',
  CENTER = 'center'
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export enum TokenType {
  REFRESH = 'refresh',
  EMAIL_VERIFY = 'email_verify',
  PASSWORD_RESET = 'password_reset'
}

export type JwtPayload = {
  id: number,
  email: string,
  firstName: string,
  role: UserRole
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum DocumentType {
  DIPLOMA = 'diploma',
  CERTIFICATE = 'certificate',
  LICENSE = 'license',
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}