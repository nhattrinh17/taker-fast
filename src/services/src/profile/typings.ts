export interface Response {
  type: string;
  data: any;
}

export interface ErrorProfile {
  type: string;
  code: string;
}

export interface ParamsUpdatePassword {
  password: string;
  id: string;
}

export interface ParamsUpdateInfomation {
  id: string;
  fullName?: string;
  email?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  avatar?: string;
}

export interface ParamsGetSignedUrl {
  fileName: string;
}

export interface urlUpdateAvatar {
  url: string;
}

export interface ParamsDeposit {
  amount: number;
}

export interface ResponseDeposit {
  data: any;
  type: string;
}

export interface ParamsSetFCMToken {
  userId?: string; // optional(when user pending)
  fcmToken: string;
}

export interface ResponseSetFCMToken {
  data: string;
  type: string;
}

export interface ParamsGetIncome {
  period: string;
}

export interface ParamsGetReferal {
  take: number;
  skip: number;
}
