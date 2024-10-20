import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonText from './CommonText';
import { Colors } from 'assets/Colors';

const styles = StyleSheet.create({
  wrapper: {
    // paddingTop: 8,
  },
  itemDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  itemDateText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.black,
  },
  dateShow: {
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.border,
    fontSize: 16,
  },
});
export const SelectDateRanger = ({ endDate, setEndDate, setStartDate, startDate }: { startDate: Date; endDate: Date; setStartDate: React.Dispatch<React.SetStateAction<Date>>; setEndDate: React.Dispatch<React.SetStateAction<Date>> }): JSX.Element => {
  const [show, setShow] = useState('');
  return (
    <View style={styles.wrapper}>
      <View style={styles.itemDate}>
        <CommonText text="Ngày bắt đầu" styles={styles.itemDateText} />
        <TouchableOpacity onPress={() => setShow('start')}>
          <CommonText styles={{ ...styles.itemDateText, ...styles.dateShow }} text={`${startDate.toLocaleDateString('vi')}`} />
        </TouchableOpacity>
      </View>
      <View style={styles.itemDate}>
        <CommonText text="Ngày kết thúc" styles={styles.itemDateText} />
        <TouchableOpacity onPress={() => setShow('end')}>
          <CommonText styles={{ ...styles.itemDateText, ...styles.dateShow }} text={`${endDate.toLocaleDateString('vi')}`} />
        </TouchableOpacity>
      </View>
      <View>
        <DatePicker
          modal
          open={show == 'start'}
          date={startDate}
          mode="date"
          title="Chọn ngày bắt đầu"
          locale={'vi'}
          maximumDate={endDate}
          minimumDate={new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)}
          onConfirm={date => {
            setShow('');
            setStartDate(date);
          }}
          onCancel={() => setShow('')}
          confirmText="Xác nhận"
          cancelText="Huỷ"
        />
        <DatePicker
          modal
          open={show == 'end'}
          date={endDate}
          mode="date"
          title="Chọn ngày kết thúc"
          locale={'vi'}
          maximumDate={new Date()}
          minimumDate={startDate}
          onConfirm={date => {
            setShow('');
            setEndDate(date);
          }}
          onCancel={() => setShow('')}
          confirmText="Xác nhận"
          cancelText="Huỷ"
        />
      </View>
    </View>
  );
};
