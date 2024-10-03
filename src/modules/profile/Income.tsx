import React, {useEffect, useState} from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Header from 'components/Header'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {appStore} from 'state/app'
import {useGetIncome} from 'services/src/profile'
import {formatCurrency} from 'utils/index'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  label: {
    marginBottom: 6,
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[14],
  },
  title: {
    fontSize: Fonts.fontSize[20],
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  line: {
    height: 6,
    width: Dimensions.get('screen').width,
    backgroundColor: Colors.border,
    marginTop: 2,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  value: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  caption: {
    fontSize: Fonts.fontSize[16],
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginVertical: 8,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.main,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  tabTextActive: {
    fontSize: 16,
    color: Colors.main,
  },
})

const Income = () => {
  const setLoading = appStore(state => state.setLoading)
  const {triggerGetIncome} = useGetIncome()
  const [dataToday, setDataToday] = useState<any>({})
  const [dataMonth, setDataMonth] = useState<any>({})
  const [activeTab, setActiveTab] = useState<'TODAY' | 'MONTH'>('TODAY')

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        setLoading(true)
        const response = await triggerGetIncome({period: 'today'})
        if (response?.type === 'success') {
          setDataToday(response.data)
        }
        const responseMonth = await triggerGetIncome({period: 'month'})
        if (responseMonth?.type === 'success') {
          setDataMonth(responseMonth.data)
        }
      } catch (err) {
        console.error('Error fetching income:', err)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    fetchIncome()
  }, [triggerGetIncome])

  const renderContent = () => {
    switch (activeTab) {
      case 'TODAY':
        return renderDetail(dataToday)
      case 'MONTH':
        return renderDetail(dataMonth)
      default:
        return renderDetail(dataToday)
    }
  }

  const renderDetail = (data) => (
    <View>
      <View style={styles.item}>
        <CommonText text="Thu nhập (đ)" styles={styles.label} />
        <CommonText
          text={`${formatCurrency(data?.income)}đ`}
          styles={styles.title}
        />
      </View>
      <View style={styles.line} />
      <View style={styles.item}>
        <CommonText
          text="Số đơn hàng thực hiện thành công"
          styles={styles.label}
        />
        <CommonText
          text={`${formatCurrency(data?.count)}`}
          styles={styles.title}
        />
      </View>
      <View style={styles.line} />
      <View style={styles.item}>
        <CommonText text="Chi tiết thu nhập" styles={styles.caption} />
        <View style={styles.row}>
          <CommonText text="Tổng giá đơn hàng" styles={styles.label} />
          <CommonText
            text={`${formatCurrency(data?.total)}đ`}
            styles={styles.value}
          />
        </View>
        <View style={styles.row}>
          <CommonText
            text="Phí sử dụng ứng dụng và thuế"
            styles={styles.label}
          />
          <CommonText
            text={`${formatCurrency(data?.total - data?.income)}đ`}
            styles={styles.value}
          />
        </View>
        <View style={styles.row}>
          <CommonText text="Thu nhập" styles={styles.label} />
          <CommonText
            text={`${formatCurrency(data?.income)}đ`}
            styles={styles.value}
          />
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header title="Thu nhập" />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'TODAY' && styles.activeTab]}
          onPress={() => setActiveTab('TODAY')}>
          <Text
            style={{
              ...styles.tabText,
              ...(activeTab === 'TODAY' && {
                color: Colors.main,
                fontWeight: 'bold',
              }),
            }}>
            HÔM NAY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'MONTH' && styles.activeTab]}
          onPress={() => {
            setActiveTab('MONTH')
          }}>
          <Text
            style={{
              ...styles.tabText,
              ...(activeTab === 'MONTH' && {
                color: Colors.main,
                fontWeight: 'bold',
              }),
            }}>
            THÁNG NÀY
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </View>
  )
}

export default Income
