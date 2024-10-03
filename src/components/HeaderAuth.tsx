import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import React, {useState} from 'react'
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native'
import CommonText from './CommonText'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Modal from 'react-native-modal'
import {navigate} from 'navigation/utils/navigationUtils'
import {userStore} from 'state/user'

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  textLogout: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
  },
  help: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
  },
  textHelp: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
  },
  //Modal logout
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 0,
    marginBottom: 0,
  },
  contentModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
    alignContent: 'center',
  },
  labelModal: {
    marginTop: 8,
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[15],
  },
  itemModal: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  textLogoutModal: {
    color: Colors.red,
    fontWeight: '600',
    fontSize: Fonts.fontSize[15],
  },
  itemCancel: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 30,
  },
})

const HeaderAuth = () => {
  const {top} = useSafeAreaInsets()
  const [showModal, setShowModal] = useState<boolean>(false)
  const setUser = userStore(state => state.setUser)

  const logout = async () => {
    setShowModal(false)
    setUser({})
    navigate('Phone')
  }

  const renderModalLogout = () => (
    <Modal
      isVisible={showModal}
      style={styles.modal}
      onBackdropPress={() => setShowModal(false)}>
      <View style={styles.contentModal}>
        <View style={styles.itemModal}>
          <CommonText
            text="Bạn có chắc chắn muốn đăng xuất ?"
            styles={styles.labelModal}
          />
        </View>
        <TouchableOpacity style={styles.itemModal} onPress={() => logout()}>
          <CommonText text="Đăng xuất" styles={styles.textLogoutModal} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemCancel}
          onPress={() => setShowModal(false)}>
          <CommonText text="Huỷ" styles={styles.labelModal} />
        </TouchableOpacity>
      </View>
    </Modal>
  )

  return (
    <View style={{...styles.top, marginTop: top}}>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <CommonText styles={styles.textLogout} text="Đăng xuất" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.help}
        onPress={() => Linking.openURL('tel:1900252262')}>
        <CommonText styles={styles.textHelp} text="Cần hỗ trợ ?" />
      </TouchableOpacity>
      {renderModalLogout()}
    </View>
  )
}

export default HeaderAuth
