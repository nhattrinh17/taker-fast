import React, {useEffect, useRef} from 'react'
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import {Icons} from 'assets/icons'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import CommonButton from 'components/Button'
import {formatCurrency} from 'utils/index'
import {s3Url} from 'services/src/APIConfig'
import FastImage from 'react-native-fast-image'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheet: {
    flexGrow: 1,
    position: 'relative',
    paddingTop: 26,
    paddingBottom: 30,
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  newOrder: {
    fontWeight: '700',
    fontSize: Fonts.fontSize[18],
    textTransform: 'uppercase',
    marginBottom: 26,
    textAlign: 'center',
    marginTop: 12,
  },
  textPlaceholder: {
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  wrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 24,
  },
  phoneNumber: {
    fontSize: Fonts.fontSize[12],
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontWeight: '700',
    marginLeft: 4,
    flexShrink: 1,
  },
  position: {
    fontSize: Fonts.fontSize[12],
    fontWeight: '700',
  },
  distance: {
    fontSize: Fonts.fontSize[12],
  },
  valueDistance: {
    fontSize: Fonts.fontSize[12],
    color: Colors.main,
  },
  mt22: {
    marginTop: 22,
  },
  rowItemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: {
    fontWeight: '400',
    marginTop: 2,
  },
  totalPrice: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  line: {
    backgroundColor: Colors.gallery,
    width: Dimensions.get('window').width,
    height: 6,
    marginVertical: 20,
  },
  income: {
    fontWeight: '600',
  },
  valueInCome: {
    fontWeight: '600',
    color: Colors.main,
  },
  textCancel: {
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  mt32: {
    marginTop: 32,
  },
  buttonAccept: {
    width: Dimensions.get('screen').width - 40,
  },
  ml10: {
    marginLeft: 10,
  },
  textAccept: {
    fontWeight: '700',
  },

  customer: {
    fontWeight: '700',
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  rowText: {
    flexDirection: 'row',
  },
  wrapperDistance: {
    alignItems: 'center',
    width: '25%',
  },
  ph20: {
    paddingHorizontal: 20,
  },
  wrapperLocation: {
    flex: 1,
  },
  mt6: {
    marginTop: 6,
  },
  wrapperAvatar: {
    width: '25%',
  },
  btReject: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 18,
  },
  wrapperAction: {
    position: 'absolute',
    marginHorizontal: 20,
    bottom: 20,
  },
})

interface Props {
  showModal: boolean
  onPressReceive: (isAccept: boolean) => void
  item: home.InformationOrder
}

const NewOrder = ({showModal, onPressReceive, item}: Props) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)

  const onPressReceiveOrder = (isAccept: boolean) => () => {
    onPressReceive?.(isAccept)
  }

  useEffect(() => {
    if (showModal) {
      if (!actionSheetRef?.current?.isOpen()) {
        actionSheetRef?.current?.show()
      }
    } else {
      if (actionSheetRef?.current?.isOpen()) {
        actionSheetRef?.current?.hide()
      }
    }
  }, [showModal])

  const renderInformationCustomer = () => {
    return (
      <View style={styles.wrapperInfo}>
        <View style={styles.wrapperAvatar}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: s3Url + item?.avatar,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View>
          <CommonText text="Khách hàng" styles={styles.customer} />
          <CommonText text={item?.fullName ?? ''} />
        </View>
      </View>
    )
  }

  const renderLocation = () => {
    return (
      <View style={[styles.wrapperInfo]}>
        <View style={styles.wrapperDistance}>
          <Icons.LocationMark />
          <CommonText text="Khoảng cách" styles={styles.distance} />
          <CommonText
            text={Number(item?.distance)?.toFixed(2) + 'km'}
            styles={styles.valueDistance}
          />
        </View>
        <View style={styles.wrapperLocation}>
          <View style={{...styles.rowText}}>
            <CommonText text="Địa chỉ:" />
            <CommonText text={item?.location ?? ''} styles={styles.address} />
          </View>
          {item?.addressNote && item?.addressNote !== '' && (
            <View style={[styles.rowText, styles.mt6]}>
              <CommonText text="Ghi chú:" />
              <CommonText
                text={item?.addressNote ?? ''}
                styles={styles.address}
              />
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderTextTypePayment = () => {
    switch (item?.paymentMethod) {
      case 'DIGITAL_WALLET':
        return 'Ví Taker'
      case 'OFFLINE_PAYMENT':
        return 'Tiền mặt'
      case 'CREDIT_CARD':
        return 'Qr Code/Thẻ Visa/Master/Nội địa'
      default:
        return 'Tiền mặt'
    }
  }

  const renderInfoOrder = () => {
    return (
      <View style={[styles.ph20]}>
        <CommonText text="Thông tin đơn hàng" styles={styles.textPlaceholder} />
        {item?.services?.map((itemService, index) => (
          <View key={index} style={styles.rowItemMenu}>
            <CommonText
              text={`${itemService?.quantity} ${itemService?.name}`}
            />
            <CommonText
              text={`${formatCurrency(
                itemService?.discountPrice ?? itemService?.price,
              )} đ`}
            />
          </View>
        ))}
        <View style={styles.rowItemMenu}>
          <CommonText text="Tổng tiền" styles={styles.total} />
          <CommonText
            text={formatCurrency(item?.totalPrice ?? 0) + ' đ'}
            styles={styles.totalPrice}
          />
        </View>
        <View style={[styles.rowItemMenu, styles.mt6]}>
          <CommonText text="Thanh toán bằng" />
          <CommonText text={renderTextTypePayment()} />
        </View>
      </View>
    )
  }

  const renderInfoPayment = () => {
    if (item?.paymentMethod !== 'OFFLINE_PAYMENT') {
      return null
    }
    return (
      <View style={styles.row}>
        <CommonText text="Thu tiền mặt của khách: " styles={styles.income} />
        <CommonText
          text={`${formatCurrency(item?.totalPrice ?? 0)} đ`}
          styles={styles.valueInCome}
        />
      </View>
    )
  }

  const renderAction = () => {
    return (
      <View style={styles.mt32}>
        <CommonButton
          textStyles={styles.textAccept}
          text={'Nhận đơn này'?.toUpperCase()}
          buttonStyles={styles.buttonAccept}
          onPress={onPressReceiveOrder(true)}
        />
        <TouchableOpacity
          onPress={onPressReceiveOrder(false)}
          style={styles.btReject}>
          <CommonText text="Từ chối đơn" styles={styles.textCancel} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ActionSheet
      ref={actionSheetRef}
      containerStyle={styles.actionSheet}
      closeOnTouchBackdrop={false}>
      <View style={{height: '100%'}}>
        {/* <View style={{ flex: 1, backgroundColor: 'red'}}> */}
        <View style={styles.ph20}>
          <CommonText text="Đơn hàng mới" styles={styles.newOrder} />
          {renderInformationCustomer()}
          {renderLocation()}
        </View>

        <View style={styles.line} />
        {renderInfoOrder()}
        <View style={styles.line} />
        <View style={styles.ph20}>{renderInfoPayment()}</View>
        {/* </View> */}
      </View>
      <View style={styles.wrapperAction}>{renderAction()}</View>
    </ActionSheet>
  )
}

export default NewOrder
