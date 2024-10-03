import React from 'react'
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Colors} from 'assets/Colors'
import CommonText from 'components/CommonText'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import HomePageStack from './HomeStack'
import Activity from 'modules/activity/Activity'
import Notification from 'modules/notification/Notification'
import ProfileStack from './ProfileStack'
import NewsStack from './NewsStack'

const Tab = createBottomTabNavigator()

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 14,
    backgroundColor: Colors.white,
    height: Platform.OS === 'ios' ? 100 : 70,

    shadowColor: '#22313F',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6, // Only for Android
  },
  nameTab: {
    lineHeight: 18,
    fontSize: Fonts.fontSize[12],
    fontFamily: Fonts.fontFamily.AvertaBold,
    marginTop: 6,
  },
  itemStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text2Style: {
    fontSize: Fonts.fontSize[14],
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  typeSuccess: {
    borderLeftColor: 'green',
  },
  typeError: {
    borderLeftColor: Colors.red,
  },
})

const renderIconTabBar = (nameStack: string, focused: boolean) => {
  switch (nameStack) {
    case 'HomeStack':
      return focused ? <Icons.HomeTabActive /> : <Icons.HomeTab />
    case 'ActivityStack':
      return focused ? <Icons.ActivityTabActive /> : <Icons.ActivityTab />
    case 'NotificationStack':
      return focused ? (
        <Icons.NotificationTabActive />
      ) : (
        <Icons.NotificationTab />
      )
    case 'ProfileStack':
      return focused ? <Icons.PersonTabActive /> : <Icons.PersonTab />
    case 'NewsStack':
      return focused ? <Icons.NewsTabActive /> : <Icons.NewsTab />
    default:
      return null
  }
}

const getColorIcon = (focused: boolean) =>
  focused ? Colors.main : Colors.textSecondary

const renderNameTabBar = (nameStack: string, focused: boolean) => {
  switch (nameStack) {
    case 'HomeStack':
      return (
        <CommonText
          text="Trang chủ"
          styles={{...styles.nameTab, color: getColorIcon(focused)}}
        />
      )
    case 'ActivityStack':
      return (
        <CommonText
          text="Đơn hàng"
          styles={{...styles.nameTab, color: getColorIcon(focused)}}
        />
      )
    case 'NotificationStack':
      return (
        <CommonText
          text="Thông báo"
          styles={{...styles.nameTab, color: getColorIcon(focused)}}
        />
      )
    case 'NewsStack':
      return (
        <CommonText
          text="Tin tức"
          styles={{...styles.nameTab, color: getColorIcon(focused)}}
        />
      )
    case 'ProfileStack':
      return (
        <CommonText
          text="Cá nhân"
          styles={{...styles.nameTab, color: getColorIcon(focused)}}
        />
      )
    default:
      return null
  }
}

const renderTabBar = (props: BottomTabBarProps) => {
  const {
    state: {routes, index, routeNames},
    navigation,
  } = props
  return (
    <View style={styles.tabBar}>
      {routes?.map((stack, indexStack) => {
        const onPressStack = () => {
          if (indexStack === index) {
            return
          }
          navigation.navigate(routeNames[indexStack])
        }
        return (
          <TouchableOpacity
            key={indexStack}
            style={styles.itemStack}
            onPress={onPressStack}>
            {renderIconTabBar(stack?.name, indexStack === index)}
            {renderNameTabBar(stack?.name, indexStack === index)}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const BottomStack = () => {
  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={{lazy: false}}>
      <Tab.Screen
        name="HomeStack"
        component={HomePageStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="ActivityStack"
        component={Activity}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="NotificationStack"
        component={Notification}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="NewsStack"
        component={NewsStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  )
}

export default BottomStack
