import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import React, {useState, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
import CommonText from './CommonText'
import NetInfo from '@react-native-community/netinfo'
import {debounce} from 'lodash'
import {Fonts} from 'assets/Fonts'

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    // flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: Fonts.fontSize[18],
    fontWeight: '500',
    color: Colors.textPrimary,
    marginTop: 36,
  },
  desc: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  textAccept: {
    lineHeight: 24,
    fontSize: Fonts.fontSize[16],
    fontFamily: Fonts.fontFamily.AvertaSemiBold,
    color: Colors.main,
  },
})

const ModalInternet = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const onPressAccept = () => {
    setVisible(false)
  }

  const handleNetworkChange = useCallback(
    debounce((isConnected: boolean | null) => {
      setVisible(!isConnected)
    }, 200),
    [],
  )

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      handleNetworkChange(state.isConnected)
    })

    return () => {
      unsubscribe()
    }
  }, [handleNetworkChange])

  return (
    <Modal isVisible={visible}>
      <View style={styles.container}>
        <Icons.NoInternet />
        <CommonText text="Không có kết nối mạng !" styles={styles.title} />
        <CommonText
          text={'Vui lòng kiểm tra lại kết nối mạng của bạn'}
          styles={styles.desc}
        />

        <TouchableOpacity onPress={onPressAccept}>
          <CommonText text="Thử lại" styles={styles.textAccept} />
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default React.memo(ModalInternet)
