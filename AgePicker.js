import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import arrow from '../../../images/arrow.png'
import { ScaledSheet } from 'react-native-size-matters'
import PropTypes from 'prop-types'
import { lng } from '../../../i18n'
import Picker from 'react-native-picker'
import styleDD from '../../../assets/'
import Config from 'react-native-config'

const pfx = 'screen.personal_details'
let age = []
for(let i=1;i<130;i++) { age.push(i) }

export default function AgePicker(props) {
  // const units = [
  //   { key: 'days', label: lng(`${pfx}.days`) },
  //   { key: 'years', label: lng(`${pfx}.years`) },
  //   { key: 'months', label: lng(`${pfx}.months`)},
  // ]
  
  // const values = R.map((item) => item.label)(units)
  // let pickerSettings = {
  //   pickerData: [age, values],
  //   // pickerTextEllipsisLen: 20,
  //   selectedValue:  [25, units[1].label ],
  //   pickerTitleText: lng(`${pfx}.titlePicker`) ,
  //   pickerConfirmBtnText: lng(`${pfx}.rightBtnPicker`).toUpperCase(), 
  //   pickerCancelBtnText: lng(`${pfx}.leftBtnPicker`).toUpperCase(),
  //   pickerConfirmBtnColor: [255, 255, 255, 1],
  //   pickerCancelBtnColor: [255, 255, 255, 1], 
  //   pickerTitleColor: [255, 255, 255, 1],
  //   pickerToolBarBg: [30,193,214,1],
  //   pickerBg: [221,245,245,1],
  //   pickerFontColor: [30,193,214,1],
  //   // wheelFlex: [4,1,1,4],
  //   onPickerConfirm: (data) => {
  //     const unit = R.find((item) => item.label === data[1])(units)
  //     let Age = {}
  //     switch(unit.key) {
  //       case 'years': {
  //         Age = {number: data[0], units: data[1], value: parseInt(data[0]) }
  //         break  
  //       }
  //       case 'months': {
  //         const val = parseInt(data[0])*30/365
  //         Age = { number: data[0], units: data[1], value: +val.toFixed(3) }
  //         break
  //       }
  //       case 'days': {
  //         const val =  parseInt(data[0])/365
  //         Age = { number: data[0], units: data[1], value: +val.toFixed(3) }
  //         break
  //       }
  //       default: {
  //         Age = { number: 0, units: '', age: 0 }
  //       }
  //     }
  //     props.onSelect(Age)

  //   },
  //   // onPickerCancel: (data) => { 
  //   //   console.log('Cancel:', data)
  //   // },
  //   // onPickerSelect: (data) => {
  //   //   console.log('Cancel:', data)
  //   // }    
  // }

  // console.log(typeof Picker, pickerSettings, props.visible, Picker.isPickerShow())
  // Picker.show()
  // if (props.visible) {
  //   Picker.init({...pickerSettings })
  //   Picker.show()
  //   // console.log('Visible: ', props.visible, Picker.isPickerShow(), Picker)
  // } else {
  //   // console.log('Visible: ', PickerAge)
  //   // PickerAge.init({...pickerSettings })
  //   // console.log('Visible: ', props.visible, Picker.isPickerShow(), Picker)
  //   // Picker.hide()
  // }

  let bgColorLeft =  '#DDF5F5'
  let bgColorRight =  '#0392B5'
  switch (Config.ENV) {
    case 'maccabi': {
      bgColorLeft =  '#D6E2F1'
      bgColorRight =  '#0D47A1'
      break
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={props.onPress}>
        <View style={style.containerField}>
          <View style={[style.field, {backgroundColor: bgColorLeft} ]}>
            <Text style={styleDD.header}>{props.value}</Text>
          </View>
          <View style={[style.iconField, {backgroundColor: bgColorRight}]}>
            <Image source={arrow} resizeMode='contain' style={style.arrow} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}


AgePicker.propTypes = {
  onPress: PropTypes.func,
  onSelect: PropTypes.func,
  value: PropTypes.any,
  visible: PropTypes.bool
}
AgePicker.defaultProps = {
  value: 'MONTH'
}

const style = ScaledSheet.create({
  containerField: {
    display: 'flex',
    flexDirection: 'row',
    width: '240@ms',
    height: '38@ms',
    marginHorizontal: '6@ms',
  },
  field: { 
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#DDF5F5',
    width: '80%',
    height: '100%',
  },

  iconField: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#0392B5',
    width: '30@ms'
  },
  arrow: {
    width: '20@ms',
    height: '20@ms',
  },
})