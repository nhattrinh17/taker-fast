import {Colors} from 'assets/Colors'
import React, {useState} from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import CommonText from './CommonText'
import DatePicker from 'react-native-date-picker'

const styles = StyleSheet.create({
  wrapperInput: {
    height: 48,
    width: Dimensions.get('screen').width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
  },
  labelInput: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  required: {
    color: Colors.red,
    marginTop: 2,
  },
})

interface DateSelectionProps {
  onDateChange: (date: Date) => void
}

const DateSelection: React.FC<DateSelectionProps> = ({onDateChange}) => {
  const [date, setDate] = useState(new Date('1985-01-01'))
  const [isDateSelected, setDateSelected] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDateChange = (selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split('T')[0]
    setDate(new Date(formattedDate))
    setDateSelected(true)
    onDateChange(formattedDate)
  }

  return (
    <>
      <View>
        <View style={styles.labelInput}>
          <CommonText text="Ngày sinh" />
          <Text style={styles.required}> *</Text>
        </View>
        <TouchableOpacity
          style={styles.wrapperInput}
          onPress={() => setOpen(true)}>
          <CommonText
            styles={styles.input}
            text={
              isDateSelected ? date.toLocaleDateString('vi') : 'Chọn ngày sinh'
            }
          />
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        title="Chọn ngày sinh"
        locale={'vi'}
        maximumDate={new Date('2010-01-01')}
        minimumDate={new Date('1945-01-01')}
        onConfirm={date => {
          setOpen(false)
          handleDateChange(date)
        }}
        onCancel={() => setOpen(false)}
        confirmText="Xác nhận"
        cancelText="Huỷ"
      />
    </>
  )
}

export default DateSelection
