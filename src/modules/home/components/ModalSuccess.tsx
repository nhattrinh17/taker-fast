import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import CommonText from 'components/CommonText'
import React from 'react'
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    zIndex: 999,
    height: '100%',
    width: '100%',
  },
  wrapperView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: Dimensions.get('screen').width - 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    paddingBottom: 24,
  },
  title: {
    marginTop: 10,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  desc: {
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    marginHorizontal: 20,
  },
})

interface PropsModal {
  isVisible: boolean
  title: string
  desc?: string
  onBackdropPress: () => void
  type?: 'SUCCESS' | 'FAIL'
}

const ModalSuccess = ({
  isVisible,
  title,
  desc,
  onBackdropPress,
  type = 'SUCCESS',
}: PropsModal) => {
  if (!isVisible) {
    return null
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.wrapperView} onPress={onBackdropPress}>
        <View style={styles.wrapper}>
          {type === 'SUCCESS' ? <Icons.Success /> : <Icons.Warning />}
          <CommonText text={title} styles={styles.title} />
          {desc && <CommonText text={desc} styles={styles.desc} />}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ModalSuccess
