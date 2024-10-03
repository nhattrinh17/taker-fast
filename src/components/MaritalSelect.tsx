import {Colors} from 'assets/Colors'
import React from 'react'
import {useState} from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'
import CommonText from './CommonText'
import Modal from 'react-native-modal'
import {Fonts} from 'assets/Fonts'

const styles = StyleSheet.create({
  wrapperInput: {
    height: 48,
    width: Dimensions.get('screen').width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
  },
  labelInput: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  required: {
    color: Colors.red,
    marginTop: 2,
  },

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
})

interface MaritalSelectProps {
  onMaritalStatusChange: (status: string) => void
}

const MaritalSelect: React.FC<MaritalSelectProps> = ({
  onMaritalStatusChange,
}) => {
  const [maritalStatus, setMaritalStatus] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleMaritalStatusChange = (status: string) => {
    setMaritalStatus(status)
    onMaritalStatusChange(status)
    setShowModal(false)
  }

  return (
    <>
      <View>
        <View style={styles.labelInput}>
          <CommonText text="Tình trạng hôn nhân" />
          <Text style={styles.required}> *</Text>
        </View>
        <TouchableOpacity
          style={styles.wrapperInput}
          onPress={() => setShowModal(true)}>
          <CommonText
            styles={styles.input}
            text={
              maritalStatus !== '' ? maritalStatus : 'Chọn tình trạng hôn nhân'
            }
          />
        </TouchableOpacity>

        <Modal
          isVisible={showModal}
          style={styles.modal}
          onBackdropPress={() => setShowModal(false)}>
          <View style={styles.contentModal}>
            <ScrollView>
              {['Độc thân', 'Đã kết hôn', 'Ly hôn'].map(status => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleMaritalStatusChange(status)}
                  style={styles.itemModal}>
                  <CommonText text={status} styles={styles.labelModal} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </>
  )
}

export default MaritalSelect
