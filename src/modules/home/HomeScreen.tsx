/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, TouchableOpacity, Dimensions, Vibration, Linking, Text } from 'react-native';
import { Icons } from 'assets/icons';
import MapView, { Details, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Colors } from 'assets/Colors';
import HeaderHome from './components/HeaderHome';
import { listStatus } from './constants';
import NewOrder from './components/NewOrder';
import { navigate } from 'navigation/utils/navigationUtils';
import { EventBus, EventBusType } from 'observer';
import { SocketEvents, SocketService } from 'socketIO';
import Geolocation from '@react-native-community/geolocation';
import CommonButton from 'components/Button';
import { StatusUpdateOrder } from 'services/src/typings';
import { useGetOnlineStatus, useUpdateActiveStatus, useUpdateStatusOrder } from 'services/src/serveRequest/serveService';
import { appStore } from 'state/app';
import { serveRequestStore } from 'state/serveRequest/serveRequestStore';
import { calculateTimeDifferenceV2, renderTextModalHomeScreen, showMessageError } from 'utils/index';
import ModalSuccess from './components/ModalSuccess';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import CommonText from 'components/CommonText';
import FastImage from 'react-native-fast-image';
import { API_KEY_GOOGLE, s3Url } from 'services/src/APIConfig';
// import BackgroundService from 'react-native-background-actions'
import { userStore } from 'state/user';
import * as Sentry from '@sentry/react-native';
import { RouteProp } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/typings';
import OpenGoogleMapsDirections from 'components/GoogleMapDiections';
import MapViewDirections from 'react-native-maps-directions';

// const sleep = (time: number) =>
//   new Promise(resolve => setTimeout(() => resolve(time), time))

Sound.setCategory('Playback');

const soundOrder = new Sound('order.wav', Sound.MAIN_BUNDLE);

soundOrder.setVolume(1);
soundOrder.setPan(0);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapView: {
    flex: 1,
  },
  btCurrentLocation: {
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  btCurrentLocationRelative: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  headerHome: {
    position: 'absolute',
    top: 30,
    backgroundColor: 'cyan',
    width: 300,
    height: 20,
  },
  actionBottom: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    paddingLeft: 16,
    paddingVertical: 12,
    borderRadius: 16,
    position: 'absolute',
    borderWidth: 1,
    borderColor: Colors.border,
    bottom: 8,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  boxBtnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  btAction: {
    flex: 1,
  },
  wrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  phoneNumber: {
    marginTop: 4,
    color: Colors.textSecondary,
  },
  wrapperInformation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftAction: {
    flex: 1,
    flexWrap: 'wrap',
  },
});

const { width, height } = Dimensions.get('screen');
const LIMIT_TIME = 55;

// const DELAY = 7000

export const LATITUDE_DELTA = 0.005;
export const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

// const options = {
//   taskName: 'Taker Fast',
//   taskTitle: 'Đang cập nhật dữ liệu',
//   taskDesc: '',
//   taskIcon: {
//     name: 'ic_notification',
//     type: 'drawable',
//   },
//   parameters: {
//     delay: DELAY,
//   },
// }

interface Props {
  route: RouteProp<RootNavigatorParamList, 'Home'>;
}

const HomeScreen = ({ route }: Props) => {
  const { id: userID } = userStore(state => state?.user);
  let socketService = SocketService.getInstance();
  // console.log('🚀 ~ HomeScreen ~ socketService:', socketService);
  const token = userStore(state => state.token);
  const location = serveRequestStore(state => state?.currentLocation);
  const setLoading = appStore(state => state.setLoading);
  const orderInProgress = serveRequestStore(state => state.orderInProgress);
  const { triggerGetOnlineStatus } = useGetOnlineStatus();
  const { triggerUpdateActiveStatus } = useUpdateActiveStatus();
  const { triggerUpdateStatusOrder } = useUpdateStatusOrder();
  const updateOrderInprogress = serveRequestStore(state => state.updateOrderInprogress);
  const [havePermission, setHavePermission] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isPressAcceptOrder, setIsPressAcceptOrder] = useState(false);
  const [status, setStatus] = useState<components.ItemDropdown>(listStatus[0]);
  const [showModalNewOrder, setShowModalNewOrder] = useState<boolean>(false);
  const [informationOrder, setInformationOrder] = useState<home.InformationOrder | null>(null);

  const [countDown, setCountDown] = useState<number>(0);

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: location?.lat ?? 0,
    longitude: location?.long ?? 0,
  });
  // console.log('🚀 ~ HomeScreen ~ currentLocation:', currentLocation);

  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [showModalCancel, setShowModalCancel] = useState<{
    value: boolean;
    type: 'SUCCESS' | 'FAIL' | 'TIMEOUT';
  }>({ value: false, type: 'SUCCESS' });

  const onMapViewLayout = (_event: LayoutChangeEvent) => {
    //
  };
  const getCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(async res => {
        const { latitude, longitude } = res.coords;

        // Update current location when entering the app for the first time and when location changes
        if ((currentLocation.latitude == 0 && currentLocation.longitude == 0) || currentLocation.latitude !== latitude || currentLocation.longitude !== longitude) {
          socketService.emit(SocketEvents.SHOE_MAKER_UPDATE_LOCATION, {
            lat: latitude,
            lng: longitude,
          });
          if (orderInProgress) {
            socketService.emit(SocketEvents.SHOE_MAKER_UPDATE_LOCATION, {
              lat: latitude,
              lng: longitude,
            });
          }
          setCurrentLocation({ latitude, longitude });
          setRegion({
            ...region,
            latitude: latitude,
            longitude: longitude,
          });
        }

        // Move the map to the current location regardless of whether it changed or not
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.01, // You can adjust these values based on your desired zoom level
              longitudeDelta: 0.01,
            },
            1000,
          ); // Animation duration (in milliseconds)
        }
      });
    } catch (err) {
      console.log('Error when get current location ===>', err);
    }
  };

  const onPressCurrentLocation = () => {
    // setRegion({
    //   ...region,
    //   latitude: currentLocation.latitude,
    //   longitude: currentLocation.longitude,
    // });
    // Nhattm update get current location
    getCurrentLocation();
  };

  const onPressItemStatus = async (item: components.ItemDropdown) => {
    setLoading(true);
    try {
      const response = await triggerUpdateActiveStatus();
      if (response?.data === 'SUCCESS') {
        setStatus(item);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const onPressReceiveOrder = async (isAccept: boolean) => {
    // console.log('🚀 ~ onPressReceiveOrder ~ isAccept:', isAccept);
    soundOrder.stop();
    setIsPressAcceptOrder(true);
    socketService.emit(SocketEvents.SHOE_MAKER_RESPONSE_TRIP, {
      tripId: informationOrder?.tripId,
      accepted: isAccept,
    });
    setShowModalNewOrder(false);

    if (isAccept) {
      EventBus.emit(EventBusType.RECEIVE_NEW_ORDER);
      EventBus.on(EventBusType.COMPLETED_ORDER, () => {
        setShowModalCancel({ value: true, type: 'SUCCESS' });
      });

      socketService.on(SocketEvents.TRIP_UPDATE, res => {
        if (res?.type === SocketEvents.CUSTOMER_CANCEL) {
          setShowModalCancel({ value: true, type: 'FAIL' });
          EventBus.emit(EventBusType.CUSTOMER_CANCEL);
          updateOrderInprogress(null);
        } else if (res?.type === SocketEvents.TIME_OUT) {
          // console.log('Timeoutttttttttttt');
          setShowModalCancel({ value: true, type: 'TIMEOUT' });
          EventBus.emit(EventBusType.TIME_OUT_ORDER);
          updateOrderInprogress(null);
        }
      });
    }
  };

  const getOnlineStatus = async () => {
    setLoading(true);
    try {
      const response = await triggerGetOnlineStatus();
      if (response?.type?.toUpperCase() === 'SUCCESS' && !response?.data) {
        setStatus(listStatus[1]);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModalNewOrder && countDown < LIMIT_TIME) {
      const intervalId = BackgroundTimer.setInterval(() => {
        setCountDown(oldCountDown => {
          if (oldCountDown < LIMIT_TIME) {
            return oldCountDown + 1;
          } else {
            BackgroundTimer.clearInterval(intervalId);
            setShowModalNewOrder(false);
            return oldCountDown;
          }
        });
      }, 1000);

      return () => {
        BackgroundTimer.clearInterval(intervalId);
      };
    } else {
      soundOrder.stop();
      setShowModalNewOrder(false);
      setCountDown(0);
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [showModalNewOrder, countDown]);

  useEffect(() => {
    if (!isPressAcceptOrder && orderInProgress) {
      socketService.on(SocketEvents.TRIP_UPDATE, res => {
        if (res?.type === SocketEvents.CUSTOMER_CANCEL) {
          // console.log('Customer canceledddddđ');
          setShowModalCancel({ value: true, type: 'FAIL' });
          EventBus.emit(EventBusType.CANCEL_ORDER_SUCCESS);
          updateOrderInprogress(null);
        }
      });
      EventBus.on(EventBusType.COMPLETED_ORDER, () => {
        setShowModalCancel({ value: true, type: 'SUCCESS' });
      });
    }
  }, [orderInProgress]);

  const sendUpdateLocationToServer = (latitude: number, longitude: number) => {
    socketService.emit(SocketEvents.ONLINE, { userID });
    socketService.emit(SocketEvents.SHOE_MAKER_UPDATE_LOCATION, {
      lat: latitude,
      lng: longitude,
    });
  };

  useEffect(() => {
    // When there is a customer order in the params screen and no new order is displayed
    if (route?.params?.order && !showModalNewOrder) {
      updateWhenReceiveOrder(route?.params?.order);
    }
  }, [route]);

  useEffect(() => {
    if (!havePermission || !socketConnected) {
      return;
    }
    getCurrentLocation();

    const watchId = Geolocation.watchPosition(
      async success => {
        Sentry.configureScope(scope => {
          scope.setTag('location-update-group', `${userID} - background-location-update `);
        });
        Sentry.captureMessage('Success when updating location');
        console.error('Update location ==>', {
          socket: socketService,
        });
        const { latitude, longitude } = success.coords;
        console.log('🚀 ~ useEffect ~ latitude, longitude:', latitude, longitude);
        console.log(`Update location: ${latitude}, ${longitude}`);
        setCurrentLocation({ latitude, longitude });
        setRegion({
          ...region,
          latitude: latitude,
          longitude: longitude,
        });
        // TODO:
        if (!socketService.isConnected()) {
          Sentry.captureMessage('Reconnecting socket...');
          console.error('Reconnecting socket...');
          socketService = SocketService.getInstance(token);
          try {
            await socketService.waitForConnection();
            Sentry.captureMessage('Reconnected socket...', {
              extra: {
                id: socketService.getId(),
              },
            });
            console.error('Reconnected socket...', {
              id: socketService.getId(),
            });
            sendUpdateLocationToServer(latitude, longitude);
          } catch (err) {
            Sentry.captureException(err);
          }
        } else {
          console.error('Success update location when still connect socket ==>', {
            latitude,
            longitude,
          });
          sendUpdateLocationToServer(latitude, longitude);
        }
      },
      error => {
        Sentry.captureException(error);
        console.log('Error when update location ==>', error);
      },
      {
        interval: 5000, //Only for Android
        timeout: 10000, // 5 minutes
        // timeout: 300000, // 5 minutes
        enableHighAccuracy: true,
        distanceFilter: 5, //default is 100m before
        maximumAge: 0,
      },
    );
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [havePermission, socketConnected]);

  useEffect(() => {
    getOnlineStatus();
    socketService.on(SocketEvents.CONNECT, () => {
      setSocketConnected(true);
    });
    EventBus.on(EventBusType.HAVE_PERMISSION_LOCATION, () => {
      setHavePermission(true);
    });
  }, []);

  const updateWhenReceiveOrder = (res: any) => {
    soundOrder.play().setNumberOfLoops(-1);
    Vibration.vibrate(LIMIT_TIME);
    const response = res as unknown as home.InformationOrder;
    setInformationOrder(response);
    setShowModalNewOrder(true);
  };

  useEffect(() => {
    if (socketConnected) {
      socketService.on(SocketEvents.SHOE_MAKER_REQUEST_TRIP, res => {
        // TODO:
        console.log('SHOE_MAKER_REQUEST_TRIP ==>', res);
        updateWhenReceiveOrder(res);
        navigate('Home');
      });
    }
    return () => {
      socketService.off(SocketEvents.SHOE_MAKER_REQUEST_TRIP); // Clean up the event listener
      // soundOrder.release()
    };
  }, [socketConnected, socketService]);

  // const updateLocationToServer = () => {
  //   Geolocation.getCurrentPosition(async res => {
  //     const {latitude, longitude} = res.coords
  //     console.error('Success when get current location ==>', {
  //       socketService,
  //       latitude,
  //       longitude,
  //     })
  //     socketService.emit(SocketEvents.ONLINE, {userID})
  //     socketService.emit(SocketEvents.SHOE_MAKER_UPDATE_LOCATION, {
  //       lat: latitude,
  //       lng: longitude,
  //     })
  //   })
  // }

  // const veryIntensiveTask = async (taskDataArguments: any) => {
  //   const {delay} = taskDataArguments
  //   await new Promise(async () => {
  //     for (let i = 0; BackgroundService.isRunning(); i++) {
  //       await sleep(delay)
  //       updateLocationToServer()
  //     }
  //   })
  // }

  // useEffect(() => {
  //   // if (Platform.OS === 'android') {
  //   //   BackgroundService.start(veryIntensiveTask, options)
  //   //   return () => {
  //   //     BackgroundService.stop()
  //   //   }
  //   // } else {
  //   //   BackgroundTimer.runBackgroundTimer(() => {
  //   //     updateLocationToServer()
  //   //   }, DELAY)
  //   //   return () => {
  //   //     BackgroundTimer.stopBackgroundTimer()
  //   //   }
  //   // }
  // }, [])

  const renderTextNextStatus = (statusOrder: StatusUpdateOrder) => {
    switch (statusOrder) {
      case StatusUpdateOrder.ACCEPTED:
      case StatusUpdateOrder.MEETING:
        return 'Đã gặp khách';
      case StatusUpdateOrder.INPROGRESS:
        return 'Đã hoàn thành';
      default:
        return '';
    }
  };

  const onRegionChangeComplete = (newRegion: Region, _details: Details) => {
    if (_details?.isGesture) {
      setRegion(newRegion);
    }
  };

  const onRegionChange = (newRegion: Region, details: Details) => {
    if (details?.isGesture) {
      if (newRegion.longitude !== currentLocation.longitude) {
        //
      }
    }
  };

  const renderButtonCurrentLocation = () => {
    return (
      <TouchableOpacity style={styles.btCurrentLocationRelative} onPress={onPressCurrentLocation}>
        <Icons.CurrentLocation />
      </TouchableOpacity>
    );
  };

  const onBackdropPress = () => setShowModalCancel({ value: false, type: 'SUCCESS' });

  const goToProcessOrder = () => {
    navigate('TakePictures', {
      type: [StatusUpdateOrder.INPROGRESS].includes(orderInProgress?.status) ? 'OUT' : 'IN',
      tripId: orderInProgress?.id ?? '',
    });
  };

  const onPressUpdateStatusOrder = async () => {
    const isAccepted = orderInProgress?.status === StatusUpdateOrder.ACCEPTED;
    if (isAccepted) {
      setLoading(true);
      try {
        // Check location customer and shoemaker <= 150m
        const { distance } = calculateTimeDifferenceV2(currentLocation.latitude, currentLocation.longitude, +orderInProgress.latitude, +orderInProgress.longitude);
        if (distance > 0.15) {
          showMessageError('Địa điểm gặp khách quá xa!');
          return;
        }

        // Update status
        const response = await triggerUpdateStatusOrder({
          tripId: orderInProgress?.id,
          status: StatusUpdateOrder.MEETING,
        });
        if (response?.data === 'SUCCESS') {
          updateOrderInprogress({
            ...orderInProgress,
            status: StatusUpdateOrder.MEETING,
          });
          goToProcessOrder();
        }
      } catch (err) {
        showMessageError('Có lỗi xảy ra!');
      } finally {
        setLoading(false);
      }
    } else {
      goToProcessOrder();
    }
  };

  const onMakeCall = () => Linking.openURL(`tel:${orderInProgress?.customer?.phone}`);

  const renderActionBottom = () => {
    return (
      <View style={styles.actionBottom}>
        <View style={styles.leftAction}>
          <View style={styles.wrapperInfo}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: s3Url + orderInProgress?.customer?.avatar,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.wrapperInformation}>
              <View>
                <CommonText text={orderInProgress?.customer?.fullName ?? ''} />
                <CommonText text={orderInProgress?.customer?.phone ?? ''} styles={styles.phoneNumber} />
              </View>
              <TouchableOpacity onPress={onMakeCall}>
                <Icons.Phone />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.boxBtnAction}>
            <CommonButton text={renderTextNextStatus(orderInProgress?.status ?? '')} onPress={onPressUpdateStatusOrder} buttonStyles={styles.btAction} />

            {orderInProgress?.status == StatusUpdateOrder.ACCEPTED && (
              <OpenGoogleMapsDirections
                origin={currentLocation}
                destination={{
                  latitude: Number(orderInProgress?.latitude || 0),
                  longitude: Number(orderInProgress?.longitude || 0),
                }}
              />
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.btCurrentLocation} onPress={onPressCurrentLocation}>
          <Icons.CurrentLocation />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderHome itemActive={status} onPress={onPressItemStatus} />
      <MapView
        ref={mapRef}
        onLayout={onMapViewLayout}
        provider={PROVIDER_GOOGLE}
        region={region}
        style={styles.mapView}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        mapType="standard"
        // showsUserLocation
        scrollDuringRotateOrZoomEnabled={false}>
        {/* <MapViewDirections
          //
          apikey={API_KEY_GOOGLE}
          origin={currentLocation}
          destination={{ latitude: 37.771707, longitude: -122.4053769 }}
        /> */}

        <Marker coordinate={currentLocation} tracksViewChanges={false}>
          <Icons.Marker />
        </Marker>
        {orderInProgress && (
          <Marker
            coordinate={{
              latitude: +orderInProgress?.latitude,
              longitude: +orderInProgress?.longitude,
            }}
            tracksViewChanges={false}>
            <Icons.CustomerLocation />
          </Marker>
        )}
      </MapView>

      {orderInProgress ? renderActionBottom() : renderButtonCurrentLocation()}

      {/* <TouchableOpacity
        onPress={() => sendUpdateLocationToServer(21.0033963, 105.8196413)}
        style={{
          position: 'absolute',
          left: 20,
          top: 100,
          backgroundColor: '#000000aa',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: Colors.white }}>Demo update location</Text>
      </TouchableOpacity> */}
      <NewOrder showModal={showModalNewOrder} onPressReceive={onPressReceiveOrder} item={informationOrder!} />
      <ModalSuccess onBackdropPress={onBackdropPress} isVisible={showModalCancel.value} type={showModalCancel.type} title={renderTextModalHomeScreen(showModalCancel.type).title} desc={renderTextModalHomeScreen(showModalCancel.type).desc} />
    </View>
  );
};

export default HomeScreen;
