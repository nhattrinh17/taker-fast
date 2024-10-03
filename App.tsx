import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SWRConfig, SWRConfiguration} from 'swr';
import CodePush, {CodePushOptions} from 'react-native-code-push';
import {LogBox} from 'react-native';
import * as Sentry from '@sentry/react-native';
import RootNavigation from 'navigation/views/RootNavigation';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const configuration: SWRConfiguration = {
  shouldRetryOnError: false,
  dedupingInterval: 100,
  focusThrottleInterval: 500,
};

const isDebugMode = __DEV__;

const configCodePush: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
};

// Khởi tạo Sentry ngay tại vị trí thích hợp
if (!isDebugMode) {
  Sentry.init({
    dsn: 'https://3a13166cb72000966c6bdd40fd6a03e3@o4504056571232256.ingest.us.sentry.io/4507371515281408',
    environment: 'production',
    tracesSampleRate: 1.0,
    attachScreenshot: true,
    appHangTimeoutInterval: 5,
    _experiments: {
      profilesSampleRate: 1.0,
    },
  });
}

function App() {
  const connectToRemoteDebugger = () => {
    // NativeDevSettings.setIsDebuggingRemotely(true)
  };

  useEffect(() => {
    connectToRemoteDebugger();
  }, []);

  return (
    <SWRConfig value={configuration}>
      <RootNavigation />
    </SWRConfig>
  );
}

// Bọc ứng dụng sau khi đã khởi tạo Sentry
const AppWithCodePush = isDebugMode ? App : CodePush(configCodePush)(App);

export default isDebugMode ? AppWithCodePush : Sentry.wrap(AppWithCodePush);
