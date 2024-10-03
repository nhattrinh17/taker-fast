import React, {useState} from 'react'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  ActionSheetIOS,
  Alert,
} from 'react-native'
import {Icons} from 'assets/icons'
import HeaderAuth from 'components/HeaderAuth'
import {useUploadAvatar} from 'services/src/auth'
import {userStore} from 'state/user'
import {appStore} from 'state/app'
import CommonButton from 'components/Button'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {useUploadS3} from 'utils/useUploadS3'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flexGrow: 1,
  },
  wrapper: {
    flex: 0.8,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
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

  uploadAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadLabel: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    marginTop: 8,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
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

const UploadAvatar = () => {
  const user = userStore(state => state.user)
  const setUser = userStore(state => state.setUser)
  const setToken = userStore(state => state.setToken)
  const setLoading = appStore(state => state.setLoading)
  const {triggerUploadAvatar} = useUploadAvatar()
  const {uploadImageToS3} = useUploadS3(false)
  const [uri, setUri] = useState('')
  const [publicUrl, setPublicUrl] = useState('')

  const onPressContinue = async () => {
    try {
      setLoading(true)
      const response = await triggerUploadAvatar({
        userId: user.id,
        avatar: publicUrl,
      })
      if (response.type === 'success') {
        setToken(response.data.token)
        setUser({id: response.data.user.id})
      }
    } catch (error) {
      console.log('error update avatar: ', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAvatar = async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker')
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorCode)
    } else if (response.assets && response.assets.length > 0) {
      const source =
        Platform.OS === 'ios'
          ? response.assets[0].uri
          : `file://${response.assets[0].uri}`
      setUri(source)
      const publicUrl = await uploadImageToS3(source)
      setPublicUrl(publicUrl)
    }
  }

  const takePhoto = async () => {
    try {
      let granted
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        )
      }
      if (
        Platform.OS === 'ios' ||
        granted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        launchCamera({mediaType: 'photo'}, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker')
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage)
          } else {
            updateAvatar(response)
          }
        })
      } else {
        console.log('Camera permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const chooseFromLibrary = () => {
    launchImageLibrary({mediaType: 'photo'}, updateAvatar)
  }

  const showActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Huỷ', 'Chụp ảnh', 'Chọn ảnh có sẵn'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            takePhoto()
          } else if (buttonIndex === 2) {
            chooseFromLibrary()
          }
        },
      )
    } else {
      // For Android and other platforms
      Alert.alert(
        'Ảnh đại diện',
        '',
        [
          {text: 'Chụp ảnh', onPress: () => takePhoto()},
          {text: 'Chọn ảnh có sẵn', onPress: () => chooseFromLibrary()},
        ],
        {cancelable: true},
      )
    }
  }

  return (
    <>
      <View style={{...styles.container}}>
        <HeaderAuth />
        <View style={styles.wrapper}>
          <Icons.Info />
          <CommonText text="Chưa hoàn tất thông tin" styles={styles.title} />
          <CommonText
            text="Hiện tại bạn không thể nhận được đơn hàng mới. Vui lòng chụp ảnh mặc đồng phục và tải ảnh lên."
            styles={styles.label}
          />

          <TouchableOpacity onPress={showActionSheet}>
            {uri ? (
              <Image
                style={styles.image}
                source={{
                  uri: uri,
                }}
              />
            ) : (
              <View style={styles.uploadAvatar}>
                <Icons.Camera />
                <CommonText text="Tải ảnh lên" styles={styles.uploadLabel} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CommonButton
          isDisable={!uri}
          text="Tiếp tục"
          onPress={onPressContinue}
        />
      </View>
    </>
  )
}

export default UploadAvatar
