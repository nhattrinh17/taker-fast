import React, {useRef, useState} from 'react'
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native'
import {Icons} from 'assets/icons'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import {listStatus} from '../constants'
import { userStore } from 'state/user'
import FastImage from 'react-native-fast-image'
import { s3Url } from 'services/src/APIConfig'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 4,
  },
  btOn: {
    height: 40,
    padding: 10,
    backgroundColor: Colors.nobel,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStatus: {
    fontWeight: '700',
    fontSize: Fonts.fontSize[16],
    color: Colors.black,
  },
  on: {
    width: 20,
    height: 20,
    marginLeft: 12,
    backgroundColor: Colors.main,
    borderRadius: 10,
  },
  off: {
    width: 20,
    height: 20,
    marginRight: 12,
    backgroundColor: Colors.red,
    borderRadius: 10,
  },
  wrapperAction: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  changeStatus: {
    fontWeight: '700',
    color: Colors.black,
  },
  btChangeStatus: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  fastImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
})

interface PropsHeader {
  onPress: (item: components.ItemDropdown) => void
  itemActive: components.ItemDropdown
}

const HeaderHome = ({onPress, itemActive}: PropsHeader) => {
  const insets = useSafeAreaInsets()
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const spinValue = useRef(new Animated.Value(0)).current
  const [showModal, setShowModal] = useState(false)
  const user = userStore(state => state.user)

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const onPressDropdown = () => {
    Animated.spring(spinValue, {
      toValue: showModal ? 0 : 1,
      useNativeDriver: true,
    }).start()
    if (showModal) {
      actionSheetRef?.current?.hide()
    } else {
      actionSheetRef?.current?.show()
    }
    setShowModal(!showModal)
  }

  const renderButtonOn = () => {
    return (
      <View style={styles.btOn}>
        <CommonText text="ON" styles={styles.textStatus} />
        <View style={styles.on} />
      </View>
    )
  }

  const renderButtonOff = () => {
    return (
      <View style={styles.btOn}>
        <View style={styles.off} />
        <CommonText text="OFF" styles={styles.textStatus} />
      </View>
    )
  }

  const onCloseActionSheet = () => {
    onPressDropdown()
  }

  const onPressItem = (item: components.ItemDropdown) => () => {
    onPress(item)
    onPressDropdown()
  }

  return (
    <>
      <View style={[styles.wrapper, {top: insets.top}]}>
        <FastImage
          style={styles.fastImage}
          source={{
            uri: `${s3Url}${user.avatar}`,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.wrapperAction}>
          {itemActive?.id === '0' ? renderButtonOff() : renderButtonOn()}
          <TouchableOpacity
            style={styles.btChangeStatus}
            onPress={onPressDropdown}>
            <CommonText text={itemActive?.name} styles={styles.changeStatus} />
            <Animated.View style={{transform: [{rotate: spin}]}}>
              <Icons.Down />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheet}
        onClose={onCloseActionSheet}>
        {listStatus.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={onPressItem(item)}
            style={styles.itemDropdown}>
            <CommonText text={item?.name} />
            {item.id === itemActive.id ? (
              <Icons.Checked />
            ) : (
              <Icons.UnChecked />
            )}
          </TouchableOpacity>
        ))}
      </ActionSheet>
    </>
  )
}

export default React.memo(HeaderHome)
