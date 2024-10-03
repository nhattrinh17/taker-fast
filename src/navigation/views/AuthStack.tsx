import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from 'navigation/typings';
import Phone from 'modules/auth/Phone';
import Password from 'modules/auth/Login/Password';
import RegisterPassword from 'modules/auth/Register/RegisterPassword';
import Otp from 'modules/auth/Register/Otp';
import RegisterInfo from 'modules/auth/RegisterInfo';
import ForgetPasswordOtp from 'modules/auth/ForgetPassword/ForgetPasswordOtp';
import NewPassword from 'modules/auth/ForgetPassword/NewPassword';
import Pending from 'modules/auth/Pending';
import UploadAvatar from 'modules/auth/UploadAvatar';
import CommonWebView from 'components/CommonWebView';
import {userStore} from 'state/user';
import {useGetStatus} from 'services/src/auth';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const AuthStack = () => {
  const [initial, setInitial] = useState<string | null>(null);
  const user = userStore(state => state.user);
  const {triggerGetStatus} = useGetStatus();

  useEffect(() => {
    const fetchStatus = async () => {
      if (user?.id) {
        try {
          const response = await triggerGetStatus({userId: user.id});
          if (response?.type === 'success') {
            setInitial(getInitialRoute(response.data));
          }
        } catch (err) {
          console.error('Error fetching status:', err);
        }
      } else {
        setInitial('Phone');
      }
    };
    fetchStatus();
  }, [triggerGetStatus, user]);

  if (!initial) {
    return null;
  }

  console.log('initialRouteName', initial);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={initial}>
      <Stack.Screen name="Phone" component={Phone} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="RegisterPassword" component={RegisterPassword} />
      <Stack.Screen name="RegisterInfo" component={RegisterInfo} />
      <Stack.Screen name="Pending" component={Pending} />
      <Stack.Screen name="UploadAvatar" component={UploadAvatar} />
      <Stack.Screen name="ForgetPasswordOtp" component={ForgetPasswordOtp} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen name="CommonWebView" component={CommonWebView} />
    </Stack.Navigator>
  );
};

const getInitialRoute = data => {
  switch (data?.step) {
    case 'REGISTER_INFO':
      return 'RegisterInfo';
    case 'REGISTER_INFO_SUCCESS':
      return data.status === 'PENDING' ? 'Pending' : 'UploadAvatar';
    default:
      return 'Phone';
  }
};

export default AuthStack;
