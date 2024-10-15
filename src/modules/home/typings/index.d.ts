declare namespace home {
  interface ImageProducts {
    name: string;
    url: string;
  }
  interface TripService {
    price: number;
    discountPrice: number | null;
    discount: number | null;
    quantity: number;
    name: string;
  }

  enum PaymentMethod {
    DIGITAL_WALLET = 'DIGITAL_WALLET',
    OFFLINE_PAYMENT = 'OFFLINE_PAYMENT',
    CREDIT_CARD = 'CREDIT_CARD',
  }

  interface InformationOrder {
    fullName: string | null;
    phone: string;
    location: string | null;
    avatar: string | null;
    tripId: string;
    time: number;
    services: TripService[];
    totalPrice: number;
    paymentMethod: PaymentMethod;
    distance: number;
    addressNote?: string;
    time: string;
    free: number;
  }

  interface Customer {
    phone: string;
    fullName: string;
    avatar: string;
  }

  interface OrderInprogress {
    id: string;
    status: StatusUpdateOrder;
    latitude: string;
    longitude: string;
    address: string | null;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    services: TripService[];
    customer: Customer;
    distance?: number;
    addressNote?: string;
    fee: number;
    income: number;
  }

  interface ItemOrderHistory {
    id: string;
    createdAt: string;
    status: StatusUpdateOrder;
    latitude: string;
    longitude: string;
    address: string | null;
    totalPrice: number;
    rating: Rating | null;
    customer: { id: string };
    fee: number;
    income: number;
  }

  interface Rating {
    rating: {
      rating: number;
    };
  }
}
