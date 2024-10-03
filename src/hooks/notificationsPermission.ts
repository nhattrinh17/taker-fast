import {navigate} from 'navigation/utils/navigationUtils';
import {useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useSetFCMToken} from 'services/src/profile';
import {NOTIFICATIONS_SCREEN} from 'utils/index';
import {useGetDetailOrder} from 'services/src/serveRequest/serveService';
import {EventBus, EventBusType} from 'observer';

export default function useFirebaseNotifications() {
  const {triggerUpdateFCMToken} = useSetFCMToken();
  const {triggerGetDetailOrder} = useGetDetailOrder();

  const openHomeScreen = (remoteMessage: any) => {
    const dataOrder: home.InformationOrder =
      remoteMessage?.data as unknown as home.InformationOrder;
    const newOrder: home.InformationOrder = {
      ...dataOrder,
      services: JSON.parse(remoteMessage?.data?.services as string),
    };
    return navigate('Home', {order: newOrder});
  };

  const setFCMTokenUser = async () => {
    if (true) {
      //always update FCM token
      try {
        await messaging().registerDeviceForRemoteMessages();
        const isDeviceRegisteredForRemoteMessages =
          messaging().isDeviceRegisteredForRemoteMessages;
        if (isDeviceRegisteredForRemoteMessages) {
          const permission = await messaging().hasPermission();
          if (permission === 1) {
            await messaging().deleteToken();
            const token = await messaging().getToken();
            console.log('FCM Token ==>', token);
            if (token) {
              try {
                await triggerUpdateFCMToken({fcmToken: token});
              } catch (err) {
                //
              }
            }
          }
        }
      } catch (err) {
        console.log('Error ==>', err);
      }
    }
  };

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      console.log('authStatus ==>', authStatus);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        setFCMTokenUser();
      }
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      setFCMTokenUser();
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  const goToDetail = async (tripId: string) => {
    try {
      const response = await triggerGetDetailOrder({id: tripId});
      if (response?.data) {
        navigate('DetailOrder', {
          itemDetail: response?.data,
          status: 'COMPLETED',
        });
      }
    } catch (err) {
      //
    } finally {
    }
  };

  const openNotification = (message: FirebaseMessagingTypes.RemoteMessage) => {
    if (message?.data) {
      if (message?.data?.tripId && !message?.data?.services) {
        console.log('GO TO DETAIL');
        return goToDetail(`${message.data.tripId}`);
      }
      if (message?.data?.screen) {
        switch (message?.data?.screen) {
          case NOTIFICATIONS_SCREEN.CUSTOMER_CARE:
            break;
          case NOTIFICATIONS_SCREEN.DETAIL_NOTIFICATION:
            break;
          case NOTIFICATIONS_SCREEN.HOME:
            navigate('Home');
            break;
          case NOTIFICATIONS_SCREEN.WALLET:
            navigate('Wallet');
            break;
          default:
            navigate('NotificationStack');
            break;
        }
      }
    }
  };

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      openNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          EventBus.emit(EventBusType.RECEIVE_NOTIFICATION);
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          if (remoteMessage?.data?.services) {
            openHomeScreen(remoteMessage);
          }
        }
      });
  }, []);

  return {
    requestUserPermission,
  };
}
