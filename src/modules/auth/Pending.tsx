import { Colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import CommonText from 'components/CommonText';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icons } from 'assets/icons';
import HeaderAuth from 'components/HeaderAuth';
import useFirebaseNotifications from 'hooks/notificationsPermission';
import { userStore } from 'state/user';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 0.8,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.fontSize[20],
    fontWeight: '600',
    marginTop: 20,
  },
  label: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 20,
  },
});

const Pending = () => {
  const user = userStore(state => state.user);
  const { requestUserPermission } = useFirebaseNotifications(true, user.id);

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderAuth />
      <View style={styles.wrapper}>
        <Icons.Info />
        <CommonText text="Cám ơn bạn đã đăng ký" styles={styles.title} />
        <CommonText text="Taker sẽ sớm liên hệ với bạn đề hoàn tất thủ tục" styles={styles.label} />
      </View>
    </View>
  );
};

export default Pending;
