import {Colors} from 'assets/Colors'
import React from 'react'
import {useState} from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  ActionSheetIOS,
  Alert,
  PermissionsAndroid,
  Image,
} from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import CommonText from './CommonText'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import {useUploadS3} from 'utils/useUploadS3'

const styles = StyleSheet.create({
  boxUpload: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  boxUploadText: {
    flex: 0.5,
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
    paddingRight: 16,
    flexDirection: 'row',
  },
  boxUploadButton: {
    flex: 0.4,
  },
  boxUploadContainer: {
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 8,
  },
  boxUploadLabel: {
    marginTop: 8,
  },
  image: {
    width: 140,
    height: 90,
    borderRadius: 6,
  },
  required: {
    color: Colors.red,
    marginTop: 2,
  },
})

interface CardImageProps {
  onCardChange: (url: string) => void
  label: string
}

const CardImage: React.FC<CardImageProps> = ({onCardChange, label}) => {
  const [uri, setUri] = useState('')
  const {uploadImageToS3} = useUploadS3(false)

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
      onCardChange(publicUrl)
      console.log('publicUrl', publicUrl)
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
        'Chọn ảnh',
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
    <View style={styles.boxUpload}>
      <View style={styles.boxUploadText}>
        <CommonText text={label} styles={styles.label} />
        <CommonText text="*" styles={styles.required} />
      </View>
      <TouchableOpacity
        style={styles.boxUploadButton}
        onPress={showActionSheet}>
        {uri !== '' ? (
          <Image
            style={styles.image}
            source={{
              uri: uri,
            }}
          />
        ) : (
          <View style={styles.boxUploadContainer}>
            <Icons.Camera />
            <CommonText text="Chọn ảnh" styles={styles.boxUploadLabel} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default CardImage
