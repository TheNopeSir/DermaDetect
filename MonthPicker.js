import React, {Component} from 'react'
import { Platform, View, Image, Text, TouchableOpacity } from 'react-native'
import arrow from '../../../images/arrow.png'
import pickerStyle from './PickerStyles'
import { ScaledSheet } from 'react-native-size-matters'
import Cell from './Cell'
import PropTypes from 'prop-types'
import { lng } from '../../../i18n'
const keys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ]

MonthPicker.propTypes = {
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  value: PropTypes.number,
  onChange: PropTypes.func,
}
MonthPicker.defaultProps = {
  value: 'MONTH'
}

// export default class MonthPicker extends Component {
export default function MonthPicker(props) {
  
  const pfx = 'component.MonthPicker'

  //#region TABLE
  const table = (
    <View style={[sty.table, Platform.OS === 'android' ? { zIndex: 9000 } : null]}>
      <View style={sty.row}> 
        <Cell text={lng(`${pfx}.jan`)} onCell={() => props.onChange(0)}/>
        <Cell text={lng(`${pfx}.feb`)} onCell={() => props.onChange(1)}/>
        <Cell text={lng(`${pfx}.mar`)} onCell={() => props.onChange(2)}/>
      </View>

      <View style={sty.row}> 
        <Cell text={lng(`${pfx}.apr`)} onCell={() => props.onChange(3)}/>
        <Cell text={lng(`${pfx}.may`)} onCell={() => props.onChange(4)}/>
        <Cell text={lng(`${pfx}.jun`)} onCell={() => props.onChange(5)}/>
      </View>

      <View style={sty.row}> 
        <Cell text={lng(`${pfx}.jul`)} onCell={() => props.onChange(6)}/>
        <Cell text={lng(`${pfx}.aug`)} onCell={() => props.onChange(7)}/>
        <Cell text={lng(`${pfx}.sep`)} onCell={() => props.onChange(8)}/>
      </View>

      <View style={sty.row}> 
        <Cell text={lng(`${pfx}.oct`)} onCell={() => props.onChange(9)}/>
        <Cell text={lng(`${pfx}.nov`)} onCell={() => props.onChange(10)}/>
        <Cell text={lng(`${pfx}.dec`)} onCell={() => props.onChange(11)}/>
      </View>       
    </View>
  )
  //#endregion
  const value = props.value === null ?  lng(`${pfx}.month`).toUpperCase() : lng(`${pfx}.${keys[props.value]}`)
  return (
    <View>
      <TouchableOpacity onPress={props.onOpen}>
        <View style={pickerStyle.containerField}>
          <View style={pickerStyle.field}>
            <Text style={pickerStyle.monthLabel}>{value}</Text>
          </View>
          <View style={pickerStyle.iconField}>
            <Image source={arrow} resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'} style={pickerStyle.arrow} />
          </View>
        </View>
      </TouchableOpacity>
      {props.isOpen && table}
    </View>
  )
  
}

const sty = ScaledSheet.create({
  table: {
    position: 'absolute',
    top: '40@ms',
    left: '0@ms', 
    backgroundColor: '#0392B5',
    width: '300@ms' 
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
})