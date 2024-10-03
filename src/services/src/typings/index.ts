export enum StatusUpdateOrder {
  ACCEPTED = 'ACCEPTED',
  MEETING = 'MEETING',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCEL = 'CANCEL',
  CUSTOMER_CANCEL = 'CUSTOMER_CANCEL',
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface ParamsUpdateStatusOrder {
  tripId: string
  status: StatusUpdateOrder
  images?: string[]
}

export interface ResponseUpdateStatusOrder {
  data: any
  type: string
}
export interface ResponseServiceInProgress {
  type: string
  data: home.OrderInprogress[]
}

export interface ParamsGetListService {
  take: number
  skip: number
}

export interface ResponseListHistoryActivity {
  data: home.ItemOrderHistory[]
  type: string
}

export interface ResponseUpdateActiveStatus {
  data: any
  type: string
}

export interface ParamsGetListWalletTransaction {
  take: number
  skip: number
}

export interface ResponseWalletHistoryTransaction {
  data: ItemHistoryTransaction[]
  type: string
}

export interface ItemHistoryTransaction {
  amount: number
  description: string
  transactionDate: string
  transactionType: 'DEPOSIT' | 'WITHDRAW'
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
}

export interface ResponseGetBalance {
  data: number
  type: string
}

export interface ParamGetDetailOrder {
  id: string
}

export interface ResponseGetDetailOrder {
  data: DetailOrder
  type: string
}

interface Rating {
  rating: number
  comment: string
}

interface Service {
  price: number
  discountPrice: number
  discount: number | null
  quantity: number
  name: string
}

interface Customer {
  name: string
  phone: string
  avatar: string | null
}

export interface DetailOrder {
  rating: Rating
  services: Service[]
  customer: Customer
  orderId: string
  totalPrice: number
  images: string | null
  receiveImages: string[]
  completeImages: string[]
  paymentMethod: string
  paymentStatus: string
  address: string
  addressNote: string | null
  fee: number
  income: number
}

export interface ItemNotification {
  id: string
  createdAt: string
  title: string
  content: string
  data: null | string
  isRead: boolean
}

export interface ItemDataNotification {
  screen: string
  tripId: string
}

export interface ParamsGetNotification {
  take: number
  skip: number
}

export interface ResponseGetNotification {
  data: {
    notifications: ItemNotification[]
    total: number
  }
  type: string
}

export interface ParamsMakeReadNotification {
  id: string
}
