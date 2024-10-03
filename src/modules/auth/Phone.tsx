import {Colors} from 'assets/Colors';
import {Fonts} from 'assets/Fonts';
import {Icons} from 'assets/icons';
import CommonButton from 'components/Button';
import CommonText from 'components/CommonText';
import {navigate} from 'navigation/utils/navigationUtils';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCreateAccount, useVerifyPhoneNumber} from 'services/src/auth';
import {appStore} from 'state/app';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
  },
  title: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[18],
    fontWeight: '600',
    marginTop: 60,
    marginBottom: 30,
  },
  desc: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[18],
    marginTop: 100,
  },
  wrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    marginTop: 14,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[26],
    fontFamily: Fonts.fontFamily.AvertaBold,
    paddingHorizontal: 20,
    paddingVertical: 0,
    textAlign: 'center',
    letterSpacing: 4,
    height: 40,
  },
  btContinue: {
    marginTop: 20,
  },
  // Link app
  linkApp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 36,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  linkAppText: {
    marginLeft: 8,
  },
  linkAppTitle: {
    fontSize: Fonts.fontSize[16],
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  linkAppLabel: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
  },
});

const Phone = () => {
  const {top} = useSafeAreaInsets();
  const setLoading = appStore(state => state.setLoading);
  const {trigger} = useVerifyPhoneNumber();
  const {triggerCreateAccount} = useCreateAccount();
  const [phone, setPhone] = useState<string>('');

  const isValidPhoneNumber = (phone: string) => {
    const vnPhoneRegex = /^(0|\\+84)[1-9][0-9]{8}$/;
    return vnPhoneRegex.test(phone);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhone(value);
  };

  const clearPhoneNumber = () => {
    setPhone('');
  };

  const shareAppLink = () => {
    const urlAndroid =
      'https://play.google.com/store/apps/details?id=com.taker.customer';
    const urlIOS = 'https://apps.apple.com/vn/app/taker/id6478909775';
    const url = Platform.OS === 'ios' ? urlIOS : urlAndroid;
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleContinuePress = async () => {
    try {
      setLoading(true);
      const response = await trigger({phone});
      console.log('🚀 ~ handleContinuePress ~ response:', response);
      if (response.data) {
        // Phone number already exists
        navigate('Password', {phone});
      } else {
        // Create new account
        setLoading(true);
        const responseCreate = await triggerCreateAccount({phone});
        if (responseCreate.type === 'success') {
          navigate('Otp', {
            phone,
            userId: responseCreate?.data?.userId,
          });
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const renderLinkApp = () => {
    return (
      <TouchableOpacity style={styles.linkApp} onPress={shareAppLink}>
        <Icons.Logo />
        <View style={styles.linkAppText}>
          <CommonText
            styles={styles.linkAppTitle}
            text="Bạn muốn đặt dịch vụ đánh giày ?"
          />
          <CommonText
            styles={styles.linkAppLabel}
            text="Tải về ứng dụng khách hàng để sử dụng"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={false}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={styles.container}>
        <View style={{...styles.content, marginTop: top}}>
          {renderLinkApp()}
          {/* <CommonText
            styles={styles.title}
            text="Thợ giày đăng nhập - Đăng ký tài khoản"
          /> */}
          <CommonText styles={styles.desc} text="Nhập số điện thoại của bạn" />
          <View style={styles.wrapperInput}>
            <TextInput
              allowFontScaling={false}
              autoFocus={true}
              keyboardType="decimal-pad"
              value={phone}
              onChangeText={handlePhoneNumberChange}
              style={styles.input}
            />

            {phone !== '' && (
              <TouchableOpacity onPress={clearPhoneNumber}>
                <Icons.CloseInput fill={'#ABAFB4'} />
              </TouchableOpacity>
            )}
          </View>
          <CommonButton
            isDisable={isValidPhoneNumber(phone) ? false : true}
            text="Tiếp tục"
            onPress={handleContinuePress}
            buttonStyles={styles.btContinue}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Phone;
