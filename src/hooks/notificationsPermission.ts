import { navigate } from 'navigation/utils/navigationUtils';
import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { useSetFCMToken, useSetFCMTokenUserPending } from 'services/src/profile';
import { NOTIFICATIONS_SCREEN } from 'utils/index';
import { useGetDetailOrder } from 'services/src/serveRequest/serveService';
import { EventBus, EventBusType } from 'observer';

export default function useFirebaseNotifications(userPending?: boolean, userId?: string) {
  const { triggerUpdateFCMToken } = useSetFCMToken();
  const { triggerUpdateFCMTokenUserPending } = useSetFCMTokenUserPending();
  const { triggerGetDetailOrder } = useGetDetailOrder();

  const openHomeScreen = (remoteMessage: any) => {
    const dataOrder: home.InformationOrder = remoteMessage?.data as unknown as home.InformationOrder;
    const newOrder: home.InformationOrder = {
      ...dataOrder,
      services: JSON.parse(remoteMessage?.data?.services as string),
    };
    return navigate('Home', { order: newOrder });
  };

  // Cập nhật FCM token lên server
  const updateFCMToken = async (token: string) => {
    if (token) {
      try {
        const updateFCM = userPending && userId ? triggerUpdateFCMTokenUserPending({ fcmToken: token, userId }) : await triggerUpdateFCMToken({ fcmToken: token });
        console.log('FCM Token đã cập nhật lên server:', token);
      } catch (err) {
        console.log('Lỗi cập nhật token lên server:', err);
      }
    }
  };

  const setFCMTokenUser = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const isDeviceRegisteredForRemoteMessages = messaging().isDeviceRegisteredForRemoteMessages;
      console.log('🚀 ~ setFCMTokenUser ~ isDeviceRegisteredForRemoteMessages:', isDeviceRegisteredForRemoteMessages);

      if (isDeviceRegisteredForRemoteMessages) {
        const permission = await messaging().hasPermission();
        if (permission === 1) {
          // Xóa token cũ trước khi lấy token mới
          await messaging().deleteToken();
          const token = await messaging().getToken();
          console.log('FCM Token mới:', token);
          await updateFCMToken(token); // Cập nhật token mới
        }
      }
    } catch (err) {
      console.log('Error ==>', err);
    }
  };

  // Lắng nghe sự kiện khi token FCM thay đổi
  const listenForTokenRefresh = () => {
    const unsubscribe = messaging().onTokenRefresh(async newToken => {
      console.log('FCM Token refreshed:', newToken);
      await updateFCMToken(newToken); // Cập nhật token mới khi nó thay đổi
    });
    return unsubscribe;
  };

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      console.log('authStatus ==>', authStatus);
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        setFCMTokenUser();
      }
    } else {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      setFCMTokenUser();
    }
  };

  useEffect(() => {
    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    const unsubscribeTokenRefresh = listenForTokenRefresh(); // Lắng nghe token thay đổi

    return () => {
      unsubscribeMessage();
      unsubscribeTokenRefresh(); // Dọn dẹp sự kiện lắng nghe token thay đổi
    };
  }, []);

  const goToDetail = async (tripId: string) => {
    try {
      const response = await triggerGetDetailOrder({ id: tripId });
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
          case NOTIFICATIONS_SCREEN.UPLOAD_AVATAR:
            navigate('UploadAvatar');
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
      console.log('Notification caused app to open from background state:', remoteMessage);
      openNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          EventBus.emit(EventBusType.RECEIVE_NOTIFICATION);
          console.log('Notification caused app to open from quit state:', remoteMessage);
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
