import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import Header from 'components/Header'
import React from 'react'
import {Platform, StyleSheet, View, Dimensions} from 'react-native'
import {OtpInput} from 'react-native-otp-entry'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import {useLogin, useUpdatePassword} from 'services/src/auth'
import {userStore} from 'state/user'
import {appStore} from 'state/app'
import {userInfo} from 'state/user/typings'
import {navigate} from 'navigation/utils/navigationUtils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 0.5,
    backgroundColor: Colors.white,
  },
  desc: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[20],
    fontWeight: '600',
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 18,
  },
  inputOTP: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    width: (Dimensions.get('screen').width - 50 - 14) / 6,
    textAlign: 'center',
  },
  textValueOTP: {
    fontFamily: Fonts.fontFamily.AvertaRegular,
    fontSize: 60,
    lineHeight: 60,
    color: Colors.black,
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'RegisterPassword'>
}

const RegisterPassword = (props: Props) => {
  const {triggerLogin} = useLogin()
  const {triggerUpdatePassword} = useUpdatePassword()
  const setLoading = appStore(state => state.setLoading)
  const setUser = userStore(state => state.setUser)
  const {userId, phone, otp} = props?.route?.params

  const onFilledPassword = async (_value: string) => {
    try {
      setLoading(true)
      const response = await triggerUpdatePassword({
        userId,
        otp,
        password: _value,
      })
      if (response?.data) {
        const responseLogin = await triggerLogin({phone, password: _value})
        if (responseLogin.type === 'success') {
          const newUser: userInfo = {
            id: responseLogin.data.id,
            status: responseLogin.data.status,
            step: responseLogin.data.step,
          }
          setUser(newUser)
          navigate('RegisterInfo')
        }
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={false}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <CommonText text="Đặt mật khẩu" styles={styles.desc} />
          <OtpInput
            secureTextEntry={true}
            numberOfDigits={6}
            focusColor={Colors.main}
            onFilled={onFilledPassword}
            theme={{
              containerStyle: styles.rowInput,
              pinCodeContainerStyle: {
                ...styles.inputOTP,
                borderWidth: 0,
              },
              pinCodeTextStyle: {...styles.textValueOTP},
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default RegisterPassword
