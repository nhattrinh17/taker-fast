import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonButton from 'components/Button'
import CommonText from 'components/CommonText'
import React, {useState} from 'react'
import {StyleSheet, View, Platform, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CommonTextField from 'components/CommonTextField'
import {navigate} from 'navigation/utils/navigationUtils'
import {appStore} from 'state/app'
import {userStore} from 'state/user'
import {useUpdate} from 'services/src/auth'
import {userInfo} from 'state/user/typings'
import HeaderAuth from 'components/HeaderAuth'
import DateSelection from 'components/DateSelection'
import MaritalSelect from 'components/MaritalSelect'
import ListBank from 'components/ListBank'
import CardImage from 'components/CardImage'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: Fonts.fontSize[20],
    fontWeight: '600',
    marginTop: 20,
  },
  label: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 20,
  },
  required: {
    color: Colors.red,
    marginTop: 2,
  },

  //Bottom Button
  buttonContainer: {
    backgroundColor: Colors.white,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#22313F',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
})

const RegisterInfo = () => {
  const user = userStore(state => state.user)
  const setUser = userStore(state => state.setUser)
  const setLoading = appStore(state => state.setLoading)
  const {triggerUpdate} = useUpdate()

  const [params, setParams] = useState({
    userId: user.id,
    fullName: '',
    dateOfBirth: new Date(),
    identityCard: '',
    placeOfOrigin: '',
    placeOfResidence: '',
    frontOfCardImage: '',
    backOfCardImage: '',
    workRegistrationArea: '',
    maritalStatus: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
    referralCode: '',
  })

  const onPressContinue = async () => {
    try {
      setLoading(true)
      const response = await triggerUpdate(params)
      console.log('response', response)
      if (response.type === 'success') {
        const newUser: userInfo = {
          ...user,
          step: 'REGISTER_INFO_SUCCESS',
        }
        setUser(newUser)
        navigate('Pending')
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <HeaderAuth />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={false}
          enableAutomaticScroll={Platform.OS === 'ios'}
          contentContainerStyle={styles.container}>
          <ScrollView
            style={styles.wrapper}
            showsVerticalScrollIndicator={false}>
            <CommonText styles={styles.title} text="Đăng ký thợ giày mới" />
            <CommonText
              styles={styles.label}
              text="Vui lòng cho chúng tôi biết thông tin của bạn"
            />
            <CommonTextField
              label="Họ tên"
              value={params.fullName}
              onChangeText={value => setParams({...params, fullName: value})}
              isRequired={true}
              placeholder="Nhập họ tên của bạn"
            />

            <DateSelection
              onDateChange={date => setParams({...params, dateOfBirth: date})}
            />

            <CommonTextField
              label="Nơi sinh"
              value={params.placeOfOrigin}
              onChangeText={value =>
                setParams({...params, placeOfOrigin: value})
              }
              isRequired={true}
              placeholder="Nhập nơi sinh (Theo căn cước công dân)"
            />

            <MaritalSelect
              onMaritalStatusChange={status =>
                setParams({...params, maritalStatus: status})
              }
            />

            <CommonTextField
              label="Nơi ở hiện tại"
              value={params.placeOfResidence}
              onChangeText={value =>
                setParams({...params, placeOfResidence: value})
              }
              isRequired={true}
              placeholder="(Phường/Xã, Quận/Huyện, Tỉnh/Thành phố)"
            />
            <CommonTextField
              label="Nơi đăng ký làm việc"
              value={params.workRegistrationArea}
              onChangeText={value =>
                setParams({...params, workRegistrationArea: value})
              }
              isRequired={true}
              placeholder="(Phường/Xã, Quận/Huyện, Tỉnh/Thành phố)"
            />

            <CommonText
              styles={styles.title}
              text="CMND/Thẻ căn cước/Hộ chiếu"
            />
            <CommonTextField
              label="Số CMND/CCCD"
              value={params.identityCard}
              onChangeText={value =>
                setParams({...params, identityCard: value})
              }
              isRequired={true}
              placeholder="Nhập số CMND/CCCD của bạn"
              keyboardType="numeric"
            />

            <CardImage
              onCardChange={url =>
                setParams({...params, frontOfCardImage: url})
              }
              label="CMND/CCCD/Hộ chiếu Mặt trước"
            />

            <CardImage
              onCardChange={url => setParams({...params, backOfCardImage: url})}
              label="CMND/CCCD/Hộ chiếu Mặt sau"
            />

            <CommonText styles={styles.title} text="Thông tin nhận thu nhập" />
            <CommonText
              styles={styles.label}
              text="Nhập thông tin tài khoản ngân hàng để nhận thu nhập từ Taker"
            />
            <CommonTextField
              label="Số tài khoản ngân hàng"
              value={params.accountNumber}
              onChangeText={value =>
                setParams({...params, accountNumber: value})
              }
              isRequired={true}
              placeholder="Nhập số tài khoản"
            />
            <CommonTextField
              label="Tên tài khoản"
              value={params.accountName}
              onChangeText={value => setParams({...params, accountName: value})}
              isRequired={true}
              placeholder="Trùng với tên trong căn cước công dân"
            />
            <ListBank
              onSelectBankValue={value =>
                setParams({...params, bankName: value})
              }
              bankName={params.bankName}
            />
            <CommonText styles={styles.title} text="Thông tin giới thiệu" />
            <CommonText
              styles={styles.label}
              text="Bạn biết đến Taker qua một người bạn ? Nhập mã giới thiệu để Taker gửi đến bạn và người giới thiệu các ưu đãi/quà tặng hấp dẫn nhé!"
            />
            <CommonTextField
              label="Mã giới thiệu"
              value={params.referralCode}
              onChangeText={value =>
                setParams({...params, referralCode: value})
              }
              placeholder="Nhập mã giới thiệu"
            />
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <CommonButton
          isDisable={
            !params.fullName ||
            !params.placeOfOrigin ||
            !params.placeOfResidence ||
            !params.workRegistrationArea ||
            !params.identityCard ||
            !params.accountNumber ||
            !params.accountName ||
            !params.bankName
          }
          text="Tiếp tục"
          onPress={onPressContinue}
        />
      </View>
    </>
  )
}

export default RegisterInfo
