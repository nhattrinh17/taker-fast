import { Colors } from 'assets/Colors';
import Toast from 'react-native-toast-message';
import { StatusUpdateOrder } from 'services/src/typings';
export * from './webSocketHandler';
export * from './time-calculator';

export const showMessageError = (desc: string) => {
  Toast.show({
    type: 'error',
    text1: '',
    text2: desc,
  });
};

export const showMessageSuccess = (desc: string) => {
  Toast.show({
    type: 'success',
    text1: '',
    text2: desc,
  });
};

export function formatCurrency(amount: number): string {
  // Convert number to string and split it into integer and decimal parts
  const parts = Number(amount)?.toFixed(0).split('.');

  const integerPart = parts?.[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine integer and decimal parts and add the Vietnamese currency symbol
  const formattedAmount = `${integerPart}`;

  return formattedAmount;
}

export const totalPrice = (products: home.TripService[]) => {
  return products?.reduce((total, item) => total + (item?.discountPrice ?? item?.price) * item?.quantity, 0);
};

export const renderStatusOrder = (status: StatusUpdateOrder) => {
  switch (status) {
    case StatusUpdateOrder.ACCEPTED:
      return 'Đã nhận đơn';
    case StatusUpdateOrder.MEETING:
      return 'Đã gặp khách';
    case StatusUpdateOrder.INPROGRESS:
      return 'Đang thực hiện';
    case StatusUpdateOrder.COMPLETED:
      return 'Đã hoàn thành';
    case StatusUpdateOrder.CUSTOMER_CANCEL:
      return 'Khách hàng đã hủy';
  }
};

export const renderTypePayment = (paymentMethod: string) => {
  switch (paymentMethod) {
    case 'OFFLINE_PAYMENT':
      return 'Thanh toán tiền mặt';
    case 'DIGITAL_WALLET':
      return 'Thanh toán qua thẻ';
    default:
      return '';
  }
};

export const renderColorStatusOrder = (status: StatusUpdateOrder) => {
  switch (status) {
    case StatusUpdateOrder.ACCEPTED:
    case StatusUpdateOrder.MEETING:
    case StatusUpdateOrder.COMPLETED:
    case StatusUpdateOrder.INPROGRESS:
      return Colors.main;
    case StatusUpdateOrder.CANCEL:
    case StatusUpdateOrder.CUSTOMER_CANCEL:
      return Colors.red;
    default:
      return Colors.textPrimary;
  }
};

// export const NOTIFICATIONS_SCREEN = {
//   REQUEST_TRIP: 'REQUEST_TRIP',
//   HOME: 'HOME',
//   CUSTOMER_CARE: 'CUSTOMER_CARE',
//   WALLET: 'WALLET',
//   DETAIL_NOTIFICATION: 'DETAIL_NOTIFICATION',
// }

export const NOTIFICATIONS_SCREEN = {
  REQUEST_TRIP: 'REQUEST_TRIP',
  HOME: 'HOME',
  CUSTOMER_CARE: 'CUSTOMER_CARE',
  WALLET: 'WALLET',
  DETAIL_NOTIFICATION: 'DETAIL_NOTIFICATION',
  ORDER: 'ORDER',
  RATING: 'RATING',
  UPLOAD_AVATAR: 'UploadAvatar',
};
