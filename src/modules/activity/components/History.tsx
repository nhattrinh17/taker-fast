/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react'
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import dayjs from 'dayjs'
import {
  useGetDetailOrder,
  useGetListHistoryActivity,
} from 'services/src/serveRequest/serveService'
import {appStore} from 'state/app'
import {formatCurrency, renderStatusOrder} from 'utils/index'
import {navigate} from 'navigation/utils/navigationUtils'

const TAKE = 20

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 22,
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  rightItem: {
    flex: 1,
    marginLeft: 16,
  },
  rowTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  time: {
    fontWeight: '700',
    fontSize: Fonts.fontSize[12],
  },
  success: {
    color: Colors.main,
  },
  rowStar: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 10,
  },
  star: {
    marginHorizontal: 2,
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueInCome: {
    fontWeight: '600',
  },
  mt6: {
    marginTop: 6,
  },
})

const History = () => {
  const {triggerListHistory} = useGetListHistoryActivity()
  const {setLoading, loading} = appStore(state => state)
  const {triggerGetDetailOrder} = useGetDetailOrder()

  const [history, setHistory] = useState<{
    data: home.ItemOrderHistory[]
    enabledLoadMore: boolean
  }>({data: [], enabledLoadMore: true})

  const renderKeyExtractor = (item: home.ItemOrderHistory) => `${item?.id}`

  const getHistory = async (params: {take: number; skip: number}) => {
    if (!history?.enabledLoadMore || loading) {
      return
    }
    setLoading(true)
    try {
      const response = await triggerListHistory({
        take: params.take,
        skip: params.skip,
      })
      if (response?.data?.length) {
        setHistory({
          data: [...history.data, ...response?.data],
          enabledLoadMore: response?.data?.length < TAKE ? false : true,
        })
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const onLoadMore = () => getHistory({take: TAKE, skip: history.data.length})

  const onPressDetailOrder = (item: home.ItemOrderHistory) => async () => {
    setLoading(true)
    try {
      const response = await triggerGetDetailOrder({id: item?.id})
      if (response?.data) {
        navigate('DetailOrder', {
          itemDetail: response?.data,
          status: item?.status,
        })
      }
    } catch (err) {
      //
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getHistory({take: TAKE, skip: 0})
  }, [])

  const renderItem = ({item}: {item: home.ItemOrderHistory}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPressDetailOrder(item)}>
        <Icons.Product />
        <View style={styles.rightItem}>
          <View style={styles.rowTime}>
            <CommonText
              text={dayjs(item?.createdAt).format('HH:mm | DD/MM/YYYY')}
              styles={styles.time}
            />
            <CommonText
              text={renderStatusOrder(item?.status) ?? ''}
              styles={styles.success}
            />
          </View>

          <CommonText
            text={`Tổng tiền: ${formatCurrency(item?.totalPrice)} đ`}
          />
          <CommonText text={item?.address ?? ''} styles={styles.mt6} />

          {item?.rating && (
            <View style={styles.row}>
              <CommonText text="Khách hàng đánh giá:" />
              <View style={styles.rowStar}>
                {[1, 2, 3, 4, 5].map((itemStar, index) => {
                  return (
                    <View key={index} style={styles.star}>
                      {item?.rating !== null &&
                      +item?.rating?.rating >= itemStar ? (
                        <Icons.StarFull />
                      ) : (
                        <Icons.Star />
                      )}
                    </View>
                  )
                })}
              </View>
            </View>
          )}
          <CommonText
            text={`Thu nhập của bạn: ${formatCurrency(item?.income)}đ`}
            styles={{...styles.valueInCome, marginTop: !item?.rating ? 10 : 0}}
          />
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        data={history?.data}
        keyExtractor={renderKeyExtractor}
        renderItem={renderItem}
        onStartReachedThreshold={0.1}
        onEndReached={onLoadMore}
      />
    </View>
  )
}

export default History
