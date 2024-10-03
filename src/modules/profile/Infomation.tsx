import React, {useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native'
import {Colors} from 'assets/Colors'
import Header from 'components/Header'
import CommonTextField from 'components/CommonTextField'
import {useGetProfile} from 'services/src/profile'
import {appStore} from 'state/app'
import CommonText from 'components/CommonText'
import Avatar from 'components/Avatar'
import {Fonts} from 'assets/Fonts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  note: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[16],
    color: Colors.red,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
})

const Infomation = () => {
  const setLoading = appStore(state => state.setLoading)
  const [phone, setPhone] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [identityCard, setIdentityCard] = useState<string>('')
  const [placeOfOrigin, setPlaceOfOrigin] = useState<string>('')
  const [placeOfResidence, setPlaceOfResidence] = useState<string>('')
  const [workRegistrationArea, setWorkRegistrationArea] = useState<string>('')
  const [maritalStatus, setMaritalStatus] = useState<string>('')
  const [bankName, setBankName] = useState<string>('')
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('')
  const [bankAccountName, setBankAccountName] = useState<string>('')

  const {triggerGetProfile} = useGetProfile()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based, so we need to add 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await triggerGetProfile()
        if (response?.data) {
          setFullName(response.data.fullName)
          setPhone(response.data.phone)
          setBankName(response.data.bankName)
          setBankAccountNumber(response.data.accountNumber)
          setBankAccountName(response.data.accountName)
          setIdentityCard(response.data?.identityCard)
          setDateOfBirth(formatDate(response.data?.dateOfBirth))
          setPlaceOfOrigin(response.data?.placeOfOrigin)
          setPlaceOfResidence(response.data?.placeOfResidence)
          setWorkRegistrationArea(response.data?.workRegistrationArea)
          setMaritalStatus(response.data?.maritalStatus)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [triggerGetProfile])

  const onChange = () => {}

  return (
    <View style={styles.container}>
      <Header title="Thông tin cá nhân" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <Avatar container={100} />
          <TouchableOpacity onPress={() => Linking.openURL('tel:1900252262')}>
            <CommonText
              text="Bạn muốn thay đổi thông tin vui lòng gọi đến tổng đài 1900.252262"
              styles={styles.note}
            />
          </TouchableOpacity>
          <CommonTextField
            label="Họ tên"
            value={fullName}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Số điện thoại"
            value={phone}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Ngày sinh"
            value={dateOfBirth}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Nơi sinh"
            value={placeOfOrigin}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Tình trạng hôn nhân"
            value={maritalStatus}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Nơi ở hiện tại"
            value={placeOfResidence}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Nơi đăng ký làm việc"
            value={workRegistrationArea}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Số CMND/CCCD/Hộ chiếu"
            value={identityCard}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Số tài khoản"
            value={bankAccountNumber}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Tên chủ tài khoản"
            value={bankAccountName}
            onChangeText={onChange}
            editable={false}
          />
          <CommonTextField
            label="Tại ngân hàng"
            value={bankName}
            onChangeText={onChange}
            editable={false}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default Infomation
