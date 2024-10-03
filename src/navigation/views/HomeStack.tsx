import React, {useEffect, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from 'navigation/typings';
import Home from 'modules/home/HomeScreen';
import {userStore} from 'state/user';
import {SocketEvents, SocketService} from 'socketIO';
import {AppState, Linking, Platform} from 'react-native';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import {PermissionStatus} from 'react-native-permissions';
import usePermission from 'hooks/locationPermission';
import PopupOpenSetting from 'components/PopupOpenSetting';
import {ActionSheetRef} from 'react-native-actions-sheet';
import {EventBus, EventBusType} from 'observer';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();
const isIOS = Platform.OS === 'ios';

const HomePageStack = () => {
  useKeepAwake();
  const {checkPermissionLocation, requestPermissionLocation} = usePermission();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const token = userStore(state => state.token);
  const socketService = SocketService.getInstance(token);
  const [granted, setGranted] = useState<PermissionStatus>();
  const appState = useRef(AppState.currentState);

  const checkEnableGPSAndroid = async () => {
    try {
      const isEnableLocation = await isLocationEnabled();
      if (isEnableLocation) {
        return true;
      }
      const response = await promptForEnableLocationIfNeeded({
        interval: 10000,
        waitForAccurate: true,
      });
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const checkPermission = async () => {
    try {
      const response = await checkPermissionLocation();
      setGranted(response);
      if (response === 'granted') {
        actionSheetRef?.current?.hide();
        if (isIOS) {
          EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
        } else {
          const enableGPSAndroid = await checkEnableGPSAndroid();
          if (enableGPSAndroid) {
            EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
          }
        }
      } else if (response === 'denied' || response === 'blocked') {
        actionSheetRef?.current?.show();
      }
    } catch (err) {
      actionSheetRef?.current?.show();
    }
  };

  useEffect(() => {
    checkPermission();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkPermission();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onPressContinue = async () => {
    if (isIOS) {
      if (granted === 'denied') {
        const responseRequest = await requestPermissionLocation();
        if (responseRequest === 'granted') {
          actionSheetRef?.current?.hide();
          EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
        }
      } else if (granted === 'blocked') {
        Linking.openSettings();
      }
    } else {
      if (granted === 'denied') {
        const responseRequest = await requestPermissionLocation();
        if (responseRequest === 'granted') {
          const enableGPSAndroid = await checkEnableGPSAndroid();
          if (enableGPSAndroid) {
            EventBus.emit(EventBusType.HAVE_PERMISSION_LOCATION);
          }
        } else {
          actionSheetRef?.current?.hide();
          Linking.openSettings();
        }
      } else if (granted === 'blocked') {
        Linking.openSettings();
      }
    }
  };

  useEffect(() => {
    socketService.on(SocketEvents.CONNECT, () => {
      console.error('Socket connected', {id: socketService.getId()});
    });

    socketService.on(SocketEvents.CLOSE, () => {
      console.error('Socket closed', {
        id: socketService.getId(),
      });
    });

    socketService.on(SocketEvents.DISCONNECT, (reason, details) => {
      console.error('Socket disconnected', {
        id: socketService.getId(),
        reason,
        details,
      });
    });
  }, [socketService]);

  return (
    <>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
      <PopupOpenSetting
        granted={granted}
        ref={actionSheetRef}
        onPressContinue={onPressContinue}
      />
    </>
  );
};

export default HomePageStack;
