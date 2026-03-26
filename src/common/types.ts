export enum UserRole {
  PATIENT = 'patient',
  PSYCHOLOGIST = 'psychologist',
  CENTER = 'center',
  ADMIN = 'admin'
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
