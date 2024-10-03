import React, {useState} from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import Header from 'components/Header'
import {Fonts} from 'assets/Fonts'
import {Camera, PhotoFile} from 'react-native-vision-camera'
import {goBack, navigate} from 'navigation/utils/navigationUtils'
import {showMessageError} from 'utils/index'
import {RootNavigatorParamList} from 'navigation/typings'
import {RouteProp} from '@react-navigation/native'
import CommonButton from 'components/Button'
import {useUpdateStatusOrder} from 'services/src/serveRequest/serveService'
import {appStore} from 'state/app'
import {StatusUpdateOrder} from 'services/src/typings'
import {serveRequestStore} from 'state/serveRequest/serveRequestStore'
import {EventBus, EventBusType} from 'observer'
import useUpload from 'utils/useUpload'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  containerImages: {
    paddingHorizontal: 16,
  },
  textImage: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[16],
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 152,
    height: 152,
    borderRadius: 12,
    marginRight: 16,
  },
  pdHz20: {
    paddingHorizontal: 20,
  },
  btCamera: {
    width: 152,
    height: 152,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderStyle: 'dotted',
  },
  bottomView: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'TakePictures'>
}

const TakePictures = ({route}: Props) => {
  const {type, tripId} = route?.params
  const {uploadImage} = useUpload()
  const {triggerUpdateStatusOrder} = useUpdateStatusOrder()
  const orderInProgress = serveRequestStore(state => state.orderInProgress)
  const updateOrderInprogress = serveRequestStore(
    state => state.updateOrderInprogress,
  )

  const setLoading = appStore(state => state.setLoading)
  const [images, setImages] = useState<home.ImageProducts[]>([])

  const onTake = async (picture: PhotoFile) => {
    try {
      if (picture?.path) {
        setImages([...images, {url: picture?.path, name: 'test'}])
        goBack()
      }
    } catch (err) {
      //
    }
  }

  const onTakeAPhoto = async () => {
    try {
      const permission = await Camera.requestCameraPermission()
      if (permission === 'granted') {
        navigate('Camera', {onTakePicture: onTake})
      } else {
        showMessageError('Không thể truy cập Camera')
      }
    } catch (err) {
      showMessageError('Không thể truy cập Camera')
    }
  }

  const onPress = async () => {
    setLoading(true)
    const uploadPromises: string[] = []
    for (const image of images) {
      const url = await uploadImage(image.url)
      if (url) {
        uploadPromises.push(url)
      }
    }
    try {
      const isMeeting = orderInProgress?.status === StatusUpdateOrder.MEETING
      const response = await triggerUpdateStatusOrder({
        tripId,
        status:
          type === 'IN'
            ? StatusUpdateOrder.INPROGRESS
            : StatusUpdateOrder.COMPLETED,
        images: uploadPromises,
      })
      if (response?.data === 'SUCCESS') {
        if (isMeeting) {
          updateOrderInprogress({
            ...orderInProgress,
            status: StatusUpdateOrder.INPROGRESS,
          })
        } else {
          EventBus.emit(EventBusType.COMPLETED_ORDER)
          updateOrderInprogress(null)
        }
        goBack()
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  const renderImages = () => {
    return (
      <View>
        <CommonText
          text="Cần chụp ảnh đúng đôi giầy bạn nhận, rõ nét."
          styles={{...styles.textImage, ...styles.pdHz20}}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.containerImages}>
          {images?.map((item, index) => (
            <Image
              resizeMode="cover"
              key={`${index}`}
              source={{
                uri: Platform.OS === 'ios' ? item?.url : `file://${item?.url}`,
              }}
              style={styles.image}
            />
          ))}
          <TouchableOpacity style={styles.btCamera} onPress={onTakeAPhoto}>
            <Icons.Camera />
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Header
        shadow={false}
        title={
          type === 'IN' ? 'Chụp ảnh đơn hàng khi nhận' : 'Hoàn thành đơn hàng'
        }
      />
      {renderImages()}
      <View style={styles.bottomView}>
        <CommonButton
          isDisable={images?.length === 0}
          text={type === 'IN' ? 'BẮT ĐẦU THỰC HIỆN ĐƠN' : 'KẾT THÚC ĐƠN'}
          onPress={onPress}
        />
      </View>
    </View>
  )
}

export default TakePictures
