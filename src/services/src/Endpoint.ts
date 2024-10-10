const Endpoint = {
  Auth: {
    COMMON: '/authentication',
    VERIFY_PHONE_NUMBER: '/authentication/verify-phone-number',
    CREATE_ACCOUNT: '/authentication',
    LOGIN: '/authentication/login',
    FORGOT_PASSWORD: 'authentication/forgot-password',
    VERIFY_OTP: 'authentication/verify-otp',
    LOGOUT: '/authentication/logout',
    SEND_SMS: '/authentication/send-sms',
    SET_FCM_TOKEN: '/authentication/set-fcm-token',
  },
  Profile: {
    COMMON: '/profile',
    UPDATE_INFOMATION: 'profile',
    UPDATE_STATUS_ACTIVE: '/profile/set-on-off',
    GET_ONLINE_STATUS: '/profile/online-status',
    REFERRAL: '/profile/referral',
    SIGNED_URL: 'profile/get-signed-url',
    SET_FCM_TOKEN: '/profile/set-fcm-token',
    INCOME: 'profile/my-income',
  },
  Search: {
    SHOE_MAKERS: '/search/shoemakers',
    PLACE_DETAIL: '/search/place-detail',
    SEARCH_SUGGESTION: '/search/suggestion',
    SEARCH_NEARBY: '/search/nearby',
  },
  Trip: {
    UPDATE: '/trips/update-status',
    DETAIL: '/trips',
  },
  Activities: {
    IN_PROGRESS: '/activities/in-progress',
    HISTORY: '/activities/histories',
  },
  Wallet: {
    DEPOSITS: '/wallets/deposit',
    WITHDRAW: '/wallets/withdraw',
    HISTORY_TRANSACTIONS: '/wallets/transactions',
    BALANCE: '/wallets/balance',
  },
  Notification: {
    GET_LIST: '/notifications',
  },
};

export default Endpoint;
