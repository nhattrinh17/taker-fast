export interface ResponseAuth {
  data: any
  type: string
}

export interface Error {
  type: string
  code: string
}

export interface ParamsVerifyPhone {
  phone: string
}

export interface ParamsCreateAccount {
  phone: string
}

export interface ParamsUpdatePassword {
  userId: string
  password: string
  otp: string
}

export interface ParamsLogin {
  phone: string
  password: string
}

export interface ParamsForgotPassword {
  phone: string
}

export interface ParamsVerifyOTP {
  userId: string
  otp: string
}

export interface ParamsUpdate {
  params: {
    userId: string
    fullName?: string
    dateOfBirth?: string
    identityCard?: string
    placeOfOrigin?: string
    placeOfResidence?: string
    frontOfCardImage?: string
    backOfCardImage?: string
    workRegistrationArea?: string
    maritalStatus?: string
    accountNumber?: string
    accountName?: string
    bankName?: string
    referralCode?: string
  }
}

export interface ParamsUploadAvatar {
  userId: string
  avatar: string
}

export interface ParamsGetStatus {
  userId: string
}
