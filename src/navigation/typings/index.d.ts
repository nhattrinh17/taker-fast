export type RootNavigatorParamList = {
  BottomStack: undefined
  UserStack: undefined
  Main: undefined
  HomePageStack: undefined
  Home: {order?: home.InformationOrder}
  ChangePassword: undefined
  Camera: {
    onTakePicture: (item: PhotoFile) => void
  }
  TakePictures: {type: 'IN' | 'OUT'; tripId: string}
  Black: undefined
  FindMaker: {total: number}
  CancelOrder: undefined
  RateOrder: undefined

  // Profile stack
  Profile: undefined
  Income: undefined
  Wallet: undefined
  Referral: {profile: any}
  ProfileStack: undefined
  ChangePassword: undefined
  Support: undefined
  Infomation: undefined
  AccountSetting: undefined
  Privacy: undefined

  // Auth stack
  Intro: undefined
  Login: undefined
  Phone: undefined
  Password: {phone: string}
  Otp: {phone: string; userId: string}
  RegisterPassword: {userId: string; phone: string; otp: string}
  RegisterInfo: {userId: string; phone: string; otp: string}
  Pending: undefined
  UploadAvatar: undefined
  ForgetPasswordOtp: {phone: string; userId: string}
  NewPassword: {userId: string; phone: string; otp: string; password: string}
  CommonWebView: {title: string; url: string}
  Deposit: undefined
  Withdraw: undefined
  NotificationStack: undefined
  DetailOrder: {itemDetail: DetailOrder; status: StatusUpdateOrder}

  // News stack
  NewsStack: undefined
  News: undefined
}
