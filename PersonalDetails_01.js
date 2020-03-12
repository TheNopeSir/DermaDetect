import React, { Component } from 'react'
import { View, Platform, Text, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback } from 'react-native'
import Config from 'react-native-config'
import firebase from 'react-native-firebase'
import { connect } from 'react-redux'
import service from '../../services/Server.service'
import Header from './components/Header'
import CheckboxGender from './components/CheckboxGender'
import Footer from './components/Footer'
import { lng } from '../../i18n'
import AgePicker from './components/AgePicker'
import DurationDiseasesPicker from './components/DurationDiseasesPicker'
import R from 'ramda'
import Screen from './components/Screen'
import styles from '../../assets/stylesScalable'
import { ScaledSheet } from 'react-native-size-matters'
import DDSwitcherYN from '../../components/DDSwitcherYN'
import * as regulatory from '../../services/regulatory.service'
import Picker from 'react-native-picker'
import style, { picker } from '../../assets'
import ModalDD from './components/Modal.component'
import DDInput from '../../components/DDInput'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/Ionicons'
import hand_move from '../../images/hand_move.png' 
import hand_zoom from '../../images/hand_zoom.png' 
import menu from '../../images/menu.png' 
const delay = ms => new Promise(res => setTimeout(res, ms))

const pfx = 'screen.personal_details'
const l = (text) => lng(pfx+'.'+text)

let age = []
for (let i = 1; i < 130; i++) { age.push(i) }
const label = (item) => item.label
class PersonalDetails_01 extends Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      isPickerAgeVisible: false,
      isPickerDurationVisible: false,
      isPickerVisible: false,
      nextDisable: false,
      showHelpWindow: false,
    }
    this.values = [
      { key: 'today', label: lng(`${pfx}.today`), value: 0, show: 'always' },
      { key: 'yesterday', label: lng(`${pfx}.yesterday`), value: 1, show: 'always' },
      { key: 'dayBeforeYesterday', label: lng(`${pfx}.dayBeforeYesterday`), value: 2, show: 'always' },
      { key: 'duringLastWeek', label: lng(`${pfx}.duringLastWeek`), value: 7, show: 'always' },
      { key: 'fewWeeksAgo', label: lng(`${pfx}.fewWeeksAgo`), value: 14, show: 'always' },
      { key: 'monthAgo', label: lng(`${pfx}.monthAgo`), value: 30, show: 'always' },
      { key: 'fewMonthsAgo', label: lng(`${pfx}.fewMonthsAgo`), value: 60, show: '>30' },
      { key: 'moreThanYear ', label: lng(`${pfx}.moreThanYear`), value: 365, show: '>30' },
      { key: 'sinceBirth', label: lng(`${pfx}.sinceBirth`), value: -1, show: 'always' },
    ]
  }

  next = async () => {
    this.setState({nextDisable: true})

    if (!this.isAgeSelected()) {
      this.alert(lng(pfx + '.errChooseAge'))
      return
    }

    const { typeDeseases, gender, durationDesease } = this.props
    if (gender !== 'male' && gender !== 'female') {
      this.alert(lng(pfx + '.alertGenderWrong'))
      return
    }
    
    // const text = await regulatory.regulatoryChecks()
    // if (text) {
    //   this.alert(text)
    //   return
    // }
    
    if (!this.isValidAgeDuration()) {
      this.alert(lng(pfx + '.errAgeDuration'))
      return
    }

    if (durationDesease === null) {
      this.alert(lng(pfx + '.errChooseDurationDisease'))
      return
    }

    // if (Config.ENV === 'facebook') {
    //   await this.checkUUIDAndUser()
    // }

    if (typeDeseases === 'skin') {
      this.setState({ showHelpWindow: true })
      // this.props.navigation.navigate('BodyScreen')
      this.props.navigation.navigate('BodyFullScreen')
    } else if (typeDeseases === 'nails') {
      this.props.navigation.navigate('NailsScreen')
    } else {
      console.log('NO_SCREEN')
    }
    this.setState({nextDisable: false})
  }
  back = () => this.props.navigation.navigate('AuthStack')

  isAgeSelected = () => {
    return this.props.age.value >= 0.002;
  }

  isValidAgeDuration = () => {
    const { age, durationDesease } = this.props
    return age.value >= durationDesease / 365;
  }

  onChangeGender = (val) => {
    const { gender } = this.props

    if ((gender === 'female' && val === 'male') || (gender === 'male' && val === 'female')) {
      this.props.initLocations()
    }
    if (val === 'male') {
      this.initWomanDetails()
      this.props.setGender('male')
    } else if (val === 'female') {
      if (this.needToAskFemale(this.props.age.value)) {
        this.setState({ isModalVisible: true })
      } else {
        this.props.setGender('female')
      }
    }
  }

  needToAskFemale = (age) => {
    if (age > 0.002 && age < 13 || age > 55) {
      return false;
    }
    return true;
  }

  alert = (error) => (
    Alert.alert(lng('error.titleAlert'), error,
      [
        { text: lng('common.ok'), onPress: () => this.setState({ nextDisable: false }) },
      ],
      { cancelable: false },
    )
  )

  componentDidMount() {
    // console.log('firebse analytics ---> ')
    firebase.analytics().setCurrentScreen('Screen_PERSONAL_DETAILS')
    firebase.analytics().logEvent(`Page_SCREEN_PERSONAL_DETAILS`, { componentDidMount: true, action: 'componentDidMount' })

    // if(R.isEmpty(this.props.results)) return
    // this.props.navigation.navigate('ResultsScreenFromSidebar')
  }

  checkUUIDAndUser = async () => {
    if (Config.ENV === 'facebook') {
      if (!this.props.properties.uuid || this.props.properties.uuid === '') {
        const vendor_id = 'yeledoctor'
        const token = await firebase.messaging().getToken()
        const idToken = await firebase.auth().currentUser.getIdToken()
        console.log('TOKEN => \n', token)
        const uid = await firebase.auth().currentUser.uid
        const data = await service.setUserTokenAndGetIdCase({ ID: uid, vendor_id, token }, idToken)
        if (data) {
          this.props.setUUID(data.uuid)
          if (!this.props.userID || this.props.userID === '') {
            this.props.setUserIdAndType({ userID: uid, userType: data.user_type })
          }
        } else {
          alert('Server error')
        }
      }
    }
  }

  initWomanDetails = () => {
    this.props.setPregnancy(false)
    this.props.setBirthControlPills(false)
    this.props.setWeeks(0)
  }

  onDialogYes = () => {
    const { pregnancy, pregnancyWeek } = this.props
    const isPregnancyWeekValid = pregnancy ? (parseInt(pregnancyWeek) >= 1 && parseInt(pregnancyWeek) <= 42) : true
    if (!isPregnancyWeekValid) {
      this.alert(lng(pfx + '.alertPregnancyWeekWrong'))
      return
    }
    this.setState({ isModalVisible: false })
    this.props.setGender('female')
  }
  onChangePregnancy = () => {
    this.props.setPregnancy(!this.props.pregnancy)
  }
  onChangeBirthControlPills = () => {
    this.props.setBirthControlPills(!this.props.pregnancyBirthControlPills)
  }
  onChangeWeeks = (val) => {
    const textNumOnly = val.replace(/[^0-9]/g, '')
    const valInt = !textNumOnly ? 0 : parseInt(textNumOnly)
    console.log('WEEKS: ', valInt)
    this.props.setWeeks(valInt)
  }

  onPressSandwich = () => {
    // this.setState({isPickerAgeVisible: false})
    // this.setState({isPickerDurationVisible: false})
    Picker.hide()
  }
  onPressAge = () => {
    const units = [
      { key: 'days', label: lng(`${pfx}.days`) },
      { key: 'years', label: lng(`${pfx}.years`) },
      { key: 'months', label: lng(`${pfx}.months`) },
    ]
    const values = R.map((item) => item.label)(units)
    let pickerSettings = {
      pickerData: [age, values],
      // pickerTextEllipsisLen: 20,
      selectedValue: [25, units[1].label],
      pickerTitleText: lng(`${pfx}.titlePicker`),
      pickerConfirmBtnText: lng(`${pfx}.rightBtnPicker`).toUpperCase(),
      pickerCancelBtnText: lng(`${pfx}.leftBtnPicker`).toUpperCase(),
      pickerToolBarFontSize: 14,
      ...picker,
      onPickerConfirm: (data) => {
        // console.log('age -->', data)
        const unit = R.find((item) => item.label === data[1])(units)
        let Age = {}
        switch (unit.key) {
          case 'years': {
            Age = { number: data[0], units: data[1], value: parseInt(data[0]) }
            break
          }
          case 'months': {
            const val = parseInt(data[0]) * 30 / 365
            Age = { number: data[0], units: data[1], value: +val.toFixed(3) }
            break
          }
          case 'days': {
            const val = parseInt(data[0]) / 365
            Age = { number: data[0], units: data[1], value: +val.toFixed(3) }
            break
          }
          default: {
            Age = { number: 0, units: '', age: 0 }
          }
        }


        if (this.props.gender === 'female') {
          const prevValue = this.needToAskFemale(this.props.age.value)
          const currValue = this.needToAskFemale(Age.value)
          if (!prevValue && currValue) {
            this.initWomanDetails()
            this.props.setGender('')
          } else if (!currValue) {
            this.initWomanDetails()
          }
        }

        this.props.setAge(Age)
      },
    }
    Picker.init({ ...pickerSettings })
    Picker.show()
  }

  onPressDuration = () => {
    const { age, durationDesease } = this.props

    let durations = (age.value < 0.002) ?  // 1 day
      R.map(label)(this.values) :
      R.compose(R.map(label), R.filter((item) => item.value / 365 < age.value))(this.values)

    const durationDes = R.find((item) => item.value === durationDesease)(this.values)
      || this.values[0]
    // console.log('Duration', durationDes, durations, this.values)

    let pickerSettings = {
      pickerData: Platform.OS === 'ios' ? durations : [durations],
      // pickerTextEllipsisLen: 20,
      selectedValue: [durationDes.label],
      pickerTitleText: lng(`${pfx}.titlePicker`),
      pickerConfirmBtnText: lng(`${pfx}.rightBtnPicker`).toUpperCase(),
      pickerCancelBtnText: lng(`${pfx}.leftBtnPicker`).toUpperCase(),
      pickerToolBarFontSize: 14,
      ...picker,
      pickerTextEllipsisLen: 20,
      onPickerConfirm: (data) => {
        const duration = R.find((item) => item.label === data[0])(this.values)
        // console.log('Select: ', data, duration, duration.value)
        this.props.setDurationDisease(duration.value)
        this.props.setMedication([])
        this.props.setMedicationTreatment([])
      },

    }
    Picker.init({ ...pickerSettings })
    Picker.show()
  }

  renderHelpWindow = () => {
    return (
      <Modal isVisible={this.state.showHelpWindow} backdropOpacity={0.8}>
        <TouchableWithoutFeedback onPress={this.onHelpWindowYes}>
        <View style={sty.helperContainer}>
          <View style={sty.helperImageContainer}>
            <Text style={[style.text, sty.helperImageText]}> {l('help_text3')} </Text>
            <Image
              source={menu} 
              resizeMode='contain'
              style={sty.helperImage}
            />
          </View>
          <View style={sty.helperSeparator} />
          <View style={sty.helperImageContainer}>
            <Text style={[style.text, sty.helperImageText]}> {l('help_text2')} </Text>
            <Image
              source={hand_move} 
              resizeMode='contain'
              style={sty.helperImage}
            />
          </View>
          <View style={sty.helperSeparator} />
          <View style={sty.helperImageContainer}>
              <Text style={[style.text, sty.helperImageText]}> {l('help_text1')} </Text>
            <Image
              source={hand_zoom} 
              resizeMode='contain'
              style={sty.helperImage}
            />
          </View>
        </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity style={sty.helperCloseButton} onPress={this.onHelpWindowYes}>
          <Icon name="md-close" size={30} color="white" />
        </TouchableOpacity>
      </Modal>
    )
  }
  onHelpWindowYes = () => {
    this.setState({showHelpWindow: false})
  }

  render() {
    const { pregnancy, pregnancyBirthControlPills, pregnancyWeek, gender, age, durationDesease, typeDeseases } = this.props
    const duration = R.find((item) => item.value === durationDesease)(this.values)
    const Age = age.number === 0 ? lng(`${pfx}.ageInput`).toUpperCase() : `${age.number}  ${age.units}`

    const header = <Header
      progress={0.2}
      title={lng(`${pfx}.header`).toUpperCase()}
      onPressSandwich={this.onPressSandwich}
    />
    const footer = <Footer
      // backDisabled={Config.ENV === 'facebook'} 
      nextDisabled={this.state.nextDisable}
      backDisabled={true}
      onClickNext={this.next} 
      onClickBack={this.back}
    />
    const body = (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>

        <Text style={[style.subTitle, styles.mt10, styles.mb10]}>{lng(`${pfx}.age`)}</Text>
        <AgePicker value={Age} onPress={this.onPressAge} />

        <Text style={[style.subTitle, styles.mt20, styles.mb10]}>{lng(`${pfx}.IAm`)}</Text>
        <CheckboxGender gender={gender} onChange={this.onChangeGender} />

        <Text style={[style.subTitle, styles.mt20, styles.mb10]}>
          {lng(`screen.ConditionDetails_01.subLabel`)}
        </Text>
        <DurationDiseasesPicker value={duration ? duration.label : lng(`${pfx}.enterDuration`)} onPress={this.onPressDuration} />

        <Text style={[style.subTitle, styles.mt20, styles.mb10]}>{lng(`${pfx}.typeDeseases`)}</Text>
        <View style={[sty.skinNailsContainer]}>
          <TouchableOpacity style={[sty.skinNails, typeDeseases === 'skin' && style.selectedSkinNails]}
            onPress={() => this.props.onChangeTypeDiseases('skin')}>
            <Text style={[sty.labelOption, style.text]} multiline={true} numberOfLines={2} >
              {lng(`${pfx}.skin`).toUpperCase()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[sty.skinNails, typeDeseases === 'nails' && style.selectedSkinNails]}
            onPress={() => this.props.onChangeTypeDiseases('nails')}>
            <Text style={[sty.labelOption, style.text]} multiline={true} numberOfLines={2}>
              {lng(`${pfx}.nails`).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    )
    const renderBodyDialog = () => {
      return (
        <View style={DialogStyle.body}>
          <TouchableOpacity style={DialogStyle.rowContainer} onPress={this.onChangePregnancy}>
            <Text style={style.text}> {lng(`${pfx}.areYouPregnant`)} </Text>
            <DDSwitcherYN value={pregnancy} onChange={this.onChangePregnancy} />
          </TouchableOpacity>
          {/* <View style={DialogStyle.lineStyle}/> */}
          {pregnancy ? (
            <View style={DialogStyle.rowContainer}>
              <Text style={[style.text]}> {lng(`${pfx}.week`)} </Text>
              <View style={DialogStyle.inpContainer}>
                <DDInput 
                  maxLength={2}
                  keyboardType='numeric'
                  value={pregnancyWeek == 0 ? '' :  String(pregnancyWeek)}
                  onChangeText={this.onChangeWeeks}
                  style={DialogStyle.inputStyle}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity style={DialogStyle.rowContainer} onPress={this.onChangeBirthControlPills}>
              <Text style={[style.text, { width: '70%' }]} numberOfLines={2} ellipsizeMode='tail'>
                {lng(`${pfx}.takePills`)}
              </Text>
              <DDSwitcherYN value={pregnancyBirthControlPills} onChange={this.onChangeBirthControlPills} />
            </TouchableOpacity>
          )}
        </View>
      )
    }

    return (
      <>
        <Screen header={header} body={body} footer={footer} scrollEnabled={true} />
        <ModalDD visible={this.state.isModalVisible}
          header={lng(pfx + '.titleDialog').toUpperCase()}
          body={renderBodyDialog()}
          footer={[{ label: lng('common.ok'), cb: this.onDialogYes }]}
        />
        {this.renderHelpWindow()}
      </>
    )
  }
}

//#region Styles
const DialogStyle = ScaledSheet.create({
  rowContainer: {
    // borderColor: 'red',
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '22@ms',
    paddingHorizontal: '5@ms'
  },
  inpContainer: {
    // height: '38@ms',
    width: '80@ms',
  },
  body: {
    paddingHorizontal: '15@ms'
  },
  inputStyle: {
    backgroundColor: '#DDF5F5',
  },
})


const sty = ScaledSheet.create({
  common: {
    display: 'flex',
    alignItems: 'center',
  },
  lineStyle: {
    width: '320@ms',
    opacity: 0.21,
    borderBottomWidth: '1@ms',
    borderColor: '#B7B7B7',
  },
  skinNailsContainer: {
    // borderColor: 'red',
    // borderWidth: 1,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  skinNails: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90@ms',
    height: '40@ms',
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  labelOption: {
    textAlign: 'center'
  },
  bodyHelpWindow: {
    paddingHorizontal: '10@ms', 
    paddingVertical: '10@ms'
  },
  helperCloseButton: {
    position: 'absolute',
    right: '5@ms',
    top: '5@ms',
    padding: '10@ms',
  },
  helperContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '20@ms',
  },
  helperTextFirst: {
    color: 'white',
    textAlign: 'center',
    fontSize: '16@ms',
    marginBottom: '5@ms'
  },
  helperTextSecond: {
    color: 'white',
    textAlign: 'center',
    fontSize: '16@ms',
    marginBottom: '40@ms'
  },
  helperImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperImageText: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    fontSize: '17@ms',
    fontFamily: undefined,
  },
  helperImage: {
    width: '120@ms',
    height: '120@ms'
  },
  helperSeparator: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    height: '1@ms',
    marginVertical: '30@ms',
  }
})
//#endregion

function mapStateToProps(state) {
  return {
    properties: state.properties,
    userID: state.auth.userID,
    gender: state.properties.gender,
    age: state.properties.age,
    pregnancy: state.properties.pregnancy,
    pregnancyWeek: state.properties.pregnancyWeek,
    pregnancyBirthControlPills: state.properties.pregnancyBirthControlPills,
    results: state.settings.results,
    durationDesease: state.properties.durationDesease,
    typeDeseases: state.properties.typeDeseases,
  }
}
function mapDispatchToProps(dispatch) {

  function setGender(gender) {
    dispatch({
      type: 'CHANGE_GENDER',
      payload: gender,
    })
  }
  function setWomanDetails(details) {
    dispatch({
      type: 'CHANGE_WOMAN_DETAILS',
      payload: details,
    })
  }
  function setAge(age) {
    dispatch({
      type: 'CHANGE_AGE',
      payload: age,
    })
  }
  function initLocations() {
    dispatch({ type: 'INIT_LOCATIONS' })
  }
  function setUUID(uuid) {
    dispatch({ type: 'SET_ID', payload: uuid })
  }
  function setUserIdAndType(payload) {
    dispatch({ type: 'SET_USER_ID_AND_TYPE', payload })
  }
  function setDurationDisease(duration) {
    dispatch({
      type: 'CHANGE_DURATION',
      payload: duration,
    })
  }
  const setPregnancy = (pregnancy) => {
    dispatch({
      type: 'SET_PREGNANCY',
      payload: pregnancy
    })
  }
  const setBirthControlPills = (controlPills) => dispatch({ type: 'SET_CONTROLL_PILLS', payload: controlPills })
  const setWeeks = (weeks) => dispatch({ type: 'SET_WEEKS', payload: weeks })
  const onChangeTypeDiseases = (typeDeseases) => {
    dispatch({ type: 'INIT_LOCATIONS' })
    dispatch({ type: 'SET_TYPE_DISEASES', payload: typeDeseases })
  }
  const setMedication = (value) => dispatch({type: 'SET_MEDICATION',  payload: value})
  const setMedicationTreatment = (value) => dispatch({type: 'SET_MEDICATION_TREATMENT',  payload: value}) 

  return {
    setGender,
    setAge,
    setWomanDetails,
    initLocations,
    setUUID,
    setUserIdAndType,
    setDurationDisease,
    setPregnancy,
    setBirthControlPills,
    setWeeks,
    onChangeTypeDiseases,
    setMedication,
    setMedicationTreatment
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails_01)
