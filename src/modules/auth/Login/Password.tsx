import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import Header from 'components/Header'
import React, {useState} from 'react'
import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import {OtpInput} from 'react-native-otp-entry'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {navigate} from 'navigation/utils/navigationUtils'
import {userStore} from 'state/user'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import {useLogin, useForgotPassword} from 'services/src/auth'
import {appStore} from 'state/app'
import { showMessageError } from 'utils/index'

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
  inputPass: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    width: (Dimensions.get('screen').width - 50 - 14) / 6,
    textAlign: 'center',
  },
  textValuePass: {
    fontFamily: Fonts.fontFamily.AvertaRegular,
    fontSize: 60,
    lineHeight: 60,
    color: Colors.black,
  },
  forgetPassword: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[15],
    color: Colors.textPrimary,
    marginTop: 30,
  },
  error: {
    color: Colors.red,
    marginTop: 16,
    textAlign: 'center',
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'Password'>
}

const Password = (props: Props) => {
  const setLoading = appStore(state => state.setLoading)
  const {triggerLogin} = useLogin()
  const {triggerForgotPassword} = useForgotPassword()
  const {phone} = props?.route?.params
  const [error, setError] = useState<string>('')
  const setUser = userStore(state => state.setUser)
  const setToken = userStore(state => state.setToken)

  const onChangePass = (text: string) => {
    if (text) {
      setError('')
    }
  }
  const onFilledPass = async (_value: string) => {
    try {
      setLoading(true)
      const response = await triggerLogin({phone, password: _value})
      console.log('response', response)
      if (response.type !== 'success') return

      const {token, user, id, status, step} = response.data

      if (token) {
        setToken(token)
        setUser({id: user.id})
      } else {
        setUser({id, status, step})
        navigateToStep(step, status)
      }
    } catch (err) {
      console.error('Error fetching userId:', err)
      if (err?.data?.statusCode === 400) {
        return setError('Mật khẩu không đúng. Vui lòng nhập lại mật khẩu')
      }
      showMessageError('Có lỗi xảy ra, vui lòng thử lại sau')
    } finally {
      setLoading(false)
    }
  }

  const navigateToStep = (step: string, status: string) => {
    switch (step) {
      case 'REGISTER_INFO':
        navigate('RegisterInfo')
        break
      case 'REGISTER_INFO_SUCCESS':
        navigate(status === 'PENDING' ? 'Pending' : 'UploadAvatar')
        break
    }
  }

  const forgetPassword = async () => {
    try {
      setLoading(true)
      const response = await triggerForgotPassword({phone})
      if (response?.type === 'success') {
        navigate('ForgetPasswordOtp', {phone, userId: response.data.userId})
      }
    } catch (err) {
      console.error('Error fetching userId:', err)
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
          <CommonText text="Mật khẩu" styles={styles.desc} />
          <OtpInput
            secureTextEntry={true}
            numberOfDigits={6}
            focusColor={Colors.main}
            onFilled={onFilledPass}
            onTextChange={onChangePass}
            theme={{
              containerStyle: styles.rowInput,
              pinCodeContainerStyle: {
                ...styles.inputPass,
                borderWidth: 0,
              },
              pinCodeTextStyle: {...styles.textValuePass},
            }}
          />
          {error !== '' && <CommonText text={error} styles={styles.error} />}

          <TouchableOpacity onPress={forgetPassword}>
            <CommonText text="Quên mật khẩu" styles={styles.forgetPassword} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default Password
