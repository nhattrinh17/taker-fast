import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import CommonText from 'components/CommonText';
import {Colors} from 'assets/Colors';
import {Fonts} from 'assets/Fonts';
import Processing from './components/Processing';
import History from './components/History';
import {
  useGetServiceInProgress,
  useUpdateStatusOrder,
} from 'services/src/serveRequest/serveService';
import {appStore} from 'state/app';
import {StatusUpdateOrder} from 'services/src/typings';
import {EventBus, EventBusType} from 'observer';
import {serveRequestStore} from 'state/serveRequest/serveRequestStore';
import {showMessageError} from 'utils/index';
import {delay} from 'lodash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: Fonts.fontSize[18],
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.black,
    lineHeight: 24,
    fontWeight: '700',
  },
  wrapperHeader: {
    shadowColor: '#22313F',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    zIndex: 999,
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  empty: {
    width: 25,
  },
  safeArea: {
    backgroundColor: Colors.white,
    zIndex: 1999,
  },
  titleHeader: {
    fontWeight: '700',
    fontSize: Fonts.fontSize[18],
  },
  rowRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitleHeader: {
    fontSize: Fonts.fontSize[12],
    fontWeight: '600',
  },
  activeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.main,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ml10: {
    marginLeft: 10,
  },
  activeText: {
    color: Colors.white,
  },
  wrapperContent: {
    zIndex: 1,
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 6,
    paddingTop: 12,
  },
  z100: {
    zIndex: 100,
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
});

const NUMBER_RETRY = 2;
let count = 0;

const Activity = () => {
  const {triggerUpdateStatusOrder} = useUpdateStatusOrder();
  const {triggerServiceInProgress} = useGetServiceInProgress();
  const setLoading = appStore(state => state.setLoading);
  const updateOrderInprogress = serveRequestStore(
    state => state.updateOrderInprogress,
  );
  const [inProgress, setInProgress] = useState<home.OrderInprogress | null>();

  const [activeTab, setActiveTab] = React.useState<'HISTORY' | 'PROCESSING'>(
    'PROCESSING',
  );

  const onPressItemHeader = (type: 'HISTORY' | 'PROCESSING') => () => {
    setActiveTab(type);
  };

  const onPressCompleted = async () => {
    setLoading(true);
    try {
      const response = await triggerUpdateStatusOrder({
        tripId: inProgress?.id ?? '',
        status: StatusUpdateOrder.COMPLETED,
      });
      if (response?.data === 'SUCCESS') {
        setInProgress(null);
      }
    } catch (err) {
      console.log('Error when update status order', err);
      showMessageError('Có lỗi xảy ra, vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const getServiceInProgress = ({
    isFirstTime = true,
  }: {
    isFirstTime: boolean;
  }) => {
    setLoading(true);
    delay(async () => {
      try {
        const response = await triggerServiceInProgress();
        console.log('🚀 ~ delay ~ response:', response);
        if (response?.data?.length) {
          setInProgress(response?.data?.[0]);
          updateOrderInprogress(response?.data?.[0]);
        } else {
          if (!isFirstTime && count < NUMBER_RETRY) {
            count += 1;
            getServiceInProgress({isFirstTime: false});
          }
        }
      } catch (err) {
        console.log('Error when get service in progress', err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    getServiceInProgress({isFirstTime: true});
  }, []);

  useEffect(() => {
    EventBus.on(EventBusType.RECEIVE_NEW_ORDER, () => {
      console.log('New order=======================');
      getServiceInProgress({
        isFirstTime: false,
      });
    });
    EventBus.on(EventBusType.COMPLETED_ORDER, () => {
      setInProgress(null);
    });
    EventBus.on(EventBusType.CUSTOMER_CANCEL, () => {
      setInProgress(null);
    });
  }, []);

  const renderHeader = () => (
    <View style={styles.z100}>
      <SafeAreaView style={styles.safeArea} />
      <StatusBar
        translucent={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.transparent}
      />

      <View style={styles.wrapperHeader}>
        <CommonText text="Đơn hàng" styles={styles.titleHeader} />
        <View style={styles.rowRightHeader}>
          <TouchableOpacity
            style={{...(activeTab === 'PROCESSING' && styles.activeButton)}}
            onPress={onPressItemHeader('PROCESSING')}>
            <CommonText
              text="Đang thực hiện"
              styles={{
                ...styles.subTitleHeader,
                ...(activeTab === 'PROCESSING' && styles.activeText),
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...styles.ml10,
              ...(activeTab !== 'PROCESSING' && styles.activeButton),
            }}
            onPress={onPressItemHeader('HISTORY')}>
            <CommonText
              text="Lịch sử"
              styles={{
                ...styles.subTitleHeader,
                ...(activeTab !== 'PROCESSING' && styles.activeText),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.wrapperContent}>
        {activeTab === 'PROCESSING' ? (
          <Processing
            inProgress={inProgress!}
            onPressCompleted={onPressCompleted}
          />
        ) : (
          <History />
        )}
      </View>
    </View>
  );
};

export default Activity;
