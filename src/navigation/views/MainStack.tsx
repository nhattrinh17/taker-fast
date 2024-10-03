import React, {useEffect} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {RootNavigatorParamList} from 'navigation/typings'
import BottomStack from './BottomStack'
import Camera from 'components/Camera'
import TakePictures from 'modules/home/TakePictures'
import ProfileStack from './ProfileStack'
import NewsStack from './NewsStack'
import Income from 'modules/profile/Income'
import Wallet from 'modules/profile/Wallet'
import Referral from 'modules/profile/Referral'
import ChangePassword from 'modules/profile/ChangePassword'
import Support from 'modules/profile/Support'
import Infomation from 'modules/profile/Infomation'
import AccountSetting from 'modules/profile/AccountSetting'
import Privacy from 'modules/profile/Privacy'
import CommonWebView from 'components/CommonWebView'
import Deposit from 'modules/profile/Deposit'
import {userStore} from 'state/user'
import {useGetProfile} from 'services/src/profile'
import {userInfo} from 'state/user/typings'
import Withdraw from 'modules/profile/Withdraw'
import useFirebaseNotifications from 'hooks/notificationsPermission'
import DetailOrder from 'modules/activity/DetailOrder'

const Stack = createNativeStackNavigator<RootNavigatorParamList>()

const MainStack = () => {
  const {requestUserPermission} = useFirebaseNotifications()
  const setUser = userStore(state => state.setUser)
  const user = userStore(state => state.user)
  const {triggerGetProfile} = useGetProfile()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await triggerGetProfile()
        if (response?.data) {
          const newUser: userInfo = {
            ...user,
            fullName: response.data.fullName,
            avatar: response.data.avatar,
            phone: response.data.phone,
          }
          setUser(newUser)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [triggerGetProfile])

  useEffect(() => {
    requestUserPermission()
  }, [])

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="BottomStack">
      <Stack.Screen name="BottomStack" component={BottomStack} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="TakePictures" component={TakePictures} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="NewsStack" component={NewsStack} />
      <Stack.Screen name="Income" component={Income} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Referral" component={Referral} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Infomation" component={Infomation} />
      <Stack.Screen name="AccountSetting" component={AccountSetting} />
      <Stack.Screen name="CommonWebView" component={CommonWebView} />
      <Stack.Screen name="Deposit" component={Deposit} />
      <Stack.Screen name="Withdraw" component={Withdraw} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="DetailOrder" component={DetailOrder} />
    </Stack.Navigator>
  )
}

export default MainStack
