import React, {useRef, forwardRef, useImperativeHandle} from 'react'
import {StyleSheet, View, Dimensions, Platform} from 'react-native'
import CommonText from 'components/CommonText'
import CommonButton from 'components/Button'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import {Colors} from 'assets/Colors'
import {PermissionStatus} from 'react-native-permissions'

const styles = StyleSheet.create({
  actionSheet: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: Dimensions.get('screen').height * 0.6,
  },
  container: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontSize: Fonts.fontSize[20],
    fontWeight: 'bold',
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[15],
    marginVertical: 14,
  },
})

interface Props {
  onPressContinue: () => void
  granted: PermissionStatus | undefined
}

const isIOS = Platform.OS === 'ios'

const LocationPermission = forwardRef<ActionSheetRef, Props>(
  ({onPressContinue, granted}, ref) => {
    const actionSheetRef = useRef<ActionSheetRef>(null)

    // useImperativeHandle(ref, () => actionSheetRef?.current)
    useImperativeHandle(
      ref,
      () => {
        return {
          show() {
            actionSheetRef.current?.show()
          },
          hide() {
            actionSheetRef.current?.hide()
          },
        }
      },
      [],
    )

    return (
      <ActionSheet ref={actionSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.container}>
          <View>
            <CommonText
              text="Yêu cầu quyền truy cập vị trí"
              styles={styles.title}
            />
            {Platform.OS === 'ios' ? (
              <CommonText
                text="Ứng dụng Taker Fast thu thập dữ liệu vị trí nhằm cho phép đối tác tìm kiếm đơn hàng gần đó. Việc này giúp đối tác tiếp cận và nhận đơn hàng một cách nhanh chóng và hiệu quả. Chúng tôi cam kết sử dụng dữ liệu vị trí tuân thủ các quy định về quyền riêng tư của Apple."
                styles={styles.desc}
              />
            ) : (
              <CommonText
                text="Ứng dụng Taker Fast thu thập dữ liệu vị trí để giúp đối tác tìm kiếm đơn hàng gần đó ngay cả khi ứng dụng bị đóng hoặc không sử dụng. Chức năng này là cần thiết để đảm bảo các đối tác có thể tiếp cận và nhận đơn hàng một cách nhanh chóng và hiệu quả."
                styles={styles.desc}
              />
            )}
          </View>
          <Icons.LocationPermission />
          <CommonButton
            text={
              isIOS && granted === 'blocked'
                ? 'Cho phép truy cập vị trí'
                : 'Tiếp tục'
            }
            onPress={onPressContinue}
          />
        </View>
      </ActionSheet>
    )
  },
)

export default LocationPermission
