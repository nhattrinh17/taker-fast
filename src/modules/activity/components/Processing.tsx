import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import {formatCurrency} from 'utils/index'
import {s3Url} from 'services/src/APIConfig'
import FastImage from 'react-native-fast-image'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  textPlaceholder: {
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  wrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  phoneNumber: {
    fontSize: Fonts.fontSize[12],
    marginTop: 4,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  position: {
    fontSize: Fonts.fontSize[12],
    fontWeight: '700',
  },
  distance: {
    color: Colors.main,
    fontWeight: '700',
  },
  mt22: {
    marginTop: 22,
  },
  rowItemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  price: {
    //
  },
  total: {
    fontWeight: '600',
  },
  line: {
    backgroundColor: Colors.gallery,
    width: '100%',
    height: 6,
    marginTop: 16,
    marginBottom: 16,
  },
  income: {
    fontWeight: '600',
  },
  valueInCome: {
    fontWeight: '600',
    color: Colors.red,
  },
  textCancel: {
    marginTop: 17,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  mt32: {
    marginTop: 16,
  },
  buttonAccept: {
    width: Dimensions.get('screen').width - 72,
  },
  ml10: {
    marginLeft: 10,
  },
  textAccept: {
    fontWeight: '700',
  },
  value: {
    textAlign: 'center',
    marginTop: 14,
    fontWeight: '600',
  },
  contentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyLabel: {
    fontSize: Fonts.fontSize[14],
    fontWeight: '500',
    color: Colors.textPrimary,
    marginTop: 10,
  },
  wrapperPayment: {
    marginTop: 6,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#00AFE6',
  },
  cash: {
    color: Colors.white,
  },
  valueCash: {
    color: Colors.white,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  mt16: {
    marginTop: 16,
  },
  mt12: {
    marginTop: 12,
  },
  ph22: {
    paddingHorizontal: 22,
  },
  wrapperInformation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  locationPlaceHolder: {
    fontWeight: '700',
  },
  flex1: {
    flex: 1,
  },
  mb14: {
    marginBottom: 14,
  },
})

interface Props {
  inProgress: home.OrderInprogress
  onPressCompleted: () => void
}

const Processing = ({inProgress}: Props) => {
  const onMakeCall = () => Linking.openURL(`tel:${inProgress?.customer?.phone}`)

  const renderTypePayment = () => {
    if (inProgress?.paymentMethod === 'OFFLINE_PAYMENT') {
      return (
        <View style={{...styles.wrapperPayment, backgroundColor: Colors.red}}>
          <CommonText text="Thu tiền mặt của khách" styles={styles.cash} />
          <CommonText
            text={formatCurrency(inProgress?.totalPrice) + 'đ'}
            styles={styles.valueCash}
          />
        </View>
      )
    } else if (inProgress?.paymentMethod === 'DIGITAL_WALLET') {
      return (
        <View style={styles.wrapperPayment}>
          <CommonText
            text="Khách đã thanh toán qua ví Taker"
            styles={styles.cash}
          />
        </View>
      )
    }
  }
  const renderInformationCustomer = () => {
    return (
      <View style={styles.ph22}>
        <CommonText
          text="Thông tin khách hàng"
          styles={{...styles.textPlaceholder, ...styles.mb14}}
        />
        <View style={styles.wrapperInfo}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: s3Url + inProgress?.customer?.avatar,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.wrapperInformation}>
            <View>
              <CommonText text={inProgress?.customer?.fullName ?? ''} />
              <CommonText
                text={inProgress?.customer?.phone}
                styles={styles.phoneNumber}
              />
            </View>
            <TouchableOpacity onPress={onMakeCall}>
              <Icons.Phone />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderInfoOrder = () => {
    return (
      <View style={styles.mt16}>
        <CommonText text="Thông tin đơn hàng" styles={styles.textPlaceholder} />
        {inProgress?.services?.map((item, index) => (
          <View key={index} style={styles.rowItemMenu}>
            <CommonText text={`${item.quantity} ${item.name}`} />
            <CommonText
              text={`${formatCurrency(item?.discountPrice ?? item?.price)} đ`}
              styles={styles.price}
            />
          </View>
        ))}
        <View style={styles.rowItemMenu}>
          <CommonText text="Tổng tiền" styles={styles.total} />
          <CommonText
            text={formatCurrency(inProgress?.totalPrice) + ' đ'}
            styles={styles.total}
          />
        </View>
      </View>
    )
  }

  const renderInfoPayment = () => {
    const fee = inProgress?.fee
    return (
      <View style={[styles.mt12, styles.ph22]}>
        <CommonText text="Thông tin thu nhập" styles={styles.textPlaceholder} />
        <View style={styles.rowItemMenu}>
          <CommonText text="Thu khách" />
          <CommonText text={formatCurrency(inProgress?.totalPrice) + 'đ'} />
        </View>
        <View style={styles.rowItemMenu}>
          <CommonText text="Phí sử dụng ứng dụng và thuế" />
          <CommonText text={formatCurrency(+fee) + 'đ'} />
        </View>
        <View style={styles.rowItemMenu}>
          <CommonText text="Thu nhập" styles={styles.total} />
          <CommonText
            styles={styles.total}
            text={formatCurrency(inProgress?.income) + 'đ'}
          />
        </View>
      </View>
    )
  }

  const renderLocation = () => {
    return (
      <View style={[styles.wrapperInfo, styles.mt22, styles.ph22]}>
        <Icons.LocationMark />
        <View style={[styles.ml10, styles.flex1]}>
          <View style={styles.rowText}>
            <CommonText
              text="Vị trí đặt"
              styles={{
                ...styles.locationPlaceHolder,
                color: Colors.textSecondary,
              }}
            />
            <CommonText text=" (khoảng cách: " />
            <CommonText
              text={`${inProgress?.distance?.toFixed(2) ?? 0} km)`}
              styles={styles.distance}
            />
          </View>
          <CommonText
            text={inProgress?.address ?? ''}
            styles={styles.address}
          />
          {inProgress?.addressNote && (
            <View>
              <CommonText text="Ghi chú: " />
              <CommonText
                text={inProgress?.addressNote}
                styles={styles.address}
              />
            </View>
          )}
        </View>
      </View>
    )
  }

  if (!inProgress) {
    return (
      <View style={styles.contentEmpty}>
        <Icons.NoticeEmpty />
        <CommonText text="Chưa có hoạt động" styles={styles.emptyLabel} />
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={styles.ph22}>
        {renderTypePayment()}
        {renderInfoOrder()}
      </View>
      <View style={styles.line} />
      {renderInfoPayment()}
      <View style={styles.line} />
      {renderInformationCustomer()}
      {renderLocation()}
    </ScrollView>
  )
}

export default Processing
