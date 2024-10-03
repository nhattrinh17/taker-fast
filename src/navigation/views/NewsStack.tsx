import {createNativeStackNavigator} from '@react-navigation/native-stack'
import News from 'modules/news/News'
import {RootNavigatorParamList} from 'navigation/typings'
import React from 'react'

const Stack = createNativeStackNavigator<RootNavigatorParamList>()

const NewsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="News">
      <Stack.Screen name="News" component={News} />
    </Stack.Navigator>
  )
}

export default NewsStack
