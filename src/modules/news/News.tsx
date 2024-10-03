import React from 'react'
import {View, StyleSheet, ScrollView} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Post from 'components/Post'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  top: {
    marginTop: 0,
    alignItems: 'center',
  },
})

const News = () => {
  const {top} = useSafeAreaInsets()
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{...styles.wrapper, marginTop: top}}>
        <Post />
      </View>
    </ScrollView>
  )
}

export default News
