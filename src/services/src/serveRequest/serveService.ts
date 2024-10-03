import {fetcher} from '../fetcher'
import {
  Methods,
  ParamGetDetailOrder,
  ParamsGetListService,
  ParamsGetListWalletTransaction,
  ParamsUpdateStatusOrder,
  ResponseGetBalance,
  ResponseGetDetailOrder,
  ResponseListHistoryActivity,
  ResponseServiceInProgress,
  ResponseUpdateActiveStatus,
  ResponseUpdateStatusOrder,
  ResponseWalletHistoryTransaction,
} from '../typings'
import useSWRMutation from 'swr/dist/mutation'
import Endpoint from '../Endpoint'

export const useUpdateActiveStatus = () => {
  const {trigger} = useSWRMutation<ResponseUpdateActiveStatus, any, string>(
    Endpoint.Profile.UPDATE_STATUS_ACTIVE,
    (url: string) => {
      return fetcher(`${url}`, Methods.POST)
    },
  )
  return {
    triggerUpdateActiveStatus: trigger,
  }
}

export const useGetOnlineStatus = () => {
  const {trigger} = useSWRMutation<ResponseUpdateActiveStatus, any, string>(
    Endpoint.Profile.GET_ONLINE_STATUS,
    (url: string) => {
      return fetcher(`${url}`, Methods.GET)
    },
  )
  return {
    triggerGetOnlineStatus: trigger,
  }
}

export const useUpdateStatusOrder = () => {
  const {trigger} = useSWRMutation<
    ResponseUpdateStatusOrder,
    any,
    string,
    ParamsUpdateStatusOrder
  >(
    Endpoint.Trip.UPDATE,
    (url: string, {arg}: {arg: ParamsUpdateStatusOrder}) => {
      return fetcher(`${url}`, Methods.POST, {...arg})
    },
  )
  return {
    triggerUpdateStatusOrder: trigger,
  }
}

export const useGetServiceInProgress = () => {
  const {trigger} = useSWRMutation<ResponseServiceInProgress, any, string>(
    Endpoint.Activities.IN_PROGRESS,
    (url: string) => {
      return fetcher(`${url}`, Methods.GET)
    },
  )
  return {
    triggerServiceInProgress: trigger,
  }
}

export const useGetListHistoryActivity = () => {
  const {trigger} = useSWRMutation<
    ResponseListHistoryActivity,
    any,
    string,
    ParamsGetListService
  >(
    Endpoint.Activities.HISTORY,
    (url: string, {arg}: {arg: ParamsGetListService}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerListHistory: trigger,
  }
}

export const useGetListHistoryWalletTransaction = () => {
  const {trigger} = useSWRMutation<
    ResponseWalletHistoryTransaction,
    any,
    string,
    ParamsGetListWalletTransaction
  >(
    Endpoint.Wallet.HISTORY_TRANSACTIONS,
    (url: string, {arg}: {arg: ParamsGetListWalletTransaction}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerGetWalletHistory: trigger,
  }
}

export const useGetBalance = () => {
  const {trigger, data} = useSWRMutation<ResponseGetBalance, any, string>(
    Endpoint.Wallet.BALANCE,
    (url: string) => {
      return fetcher(`${url}`, Methods.GET)
    },
  )
  return {
    balance: data?.data ?? 0,
    triggerGetBalance: trigger,
  }
}

export const useGetDetailOrder = () => {
  const {trigger} = useSWRMutation<
    ResponseGetDetailOrder,
    any,
    string,
    ParamGetDetailOrder
  >(Endpoint.Trip.DETAIL, (url: string, {arg}: {arg: ParamGetDetailOrder}) => {
    return fetcher(`${url}/${arg?.id}`, Methods.GET)
  })
  return {
    triggerGetDetailOrder: trigger,
  }
}
