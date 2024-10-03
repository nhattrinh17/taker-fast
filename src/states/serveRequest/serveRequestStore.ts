import {create} from 'zustand'

type State = {
  orderInProgress: home.OrderInprogress | null
  updateOrderInprogress: (order: home.OrderInprogress | null) => void
  currentLocation: {lat: number; long: number}
  updateCurrentLocation: (location: {lat: number; long: number}) => void
}

export const serveRequestStore = create<State>(set => ({
  orderInProgress: null,
  updateOrderInprogress: order => set({orderInProgress: order}),
  currentLocation: {lat: 0, long: 0},
  updateCurrentLocation: location => set({currentLocation: location}),
}))
