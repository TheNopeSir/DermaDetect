
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { lng } from '../../i18n'
import { DDButton } from '../../components/DDButton'
import HeaderTitle from '../Application/components/HeaderTitle'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import styles, { picker } from '../../assets'
import DDInput from '../../components/DDInput'
import AgePicker from './components/AgePicker'
import Picker from 'react-native-picker'

const pfx = 'screen.feedback.'
class Feedback extends Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title='screen.feedback.header' />,
    // headerTintColor: '#0392B5',
  }
  static lang = () => {
    return lng(pfx + 'header').toLocaleUpperCase()
  }
  constructor(props) {
    super(props)
    // const support = lng(pfx+'title1')
    this.titles = {
      support: lng(pfx + 'title1'),
      recommendations: lng(pfx + 'title2')
    }
    this.titleValues = {
      [lng(pfx + 'title1')]: 'support',
      [lng(pfx + 'title2')]: 'recommendations'
    }

    this.state = {
      title: 'Enter subject',
      name: '',
      email: '',
      text: '',
    }
  }
  onPressSubject = () => {
    let pickerSettings = {
      pickerData: [this.titles['support'], this.titles['recommendations']],
      pickerTextEllipsisLen: 20,
      selectedValue: [this.titles['support']],
      pickerTitleText: 'Title',
      pickerConfirmBtnText: 'Ok',
      pickerCancelBtnText: 'Cancel',
      ...picker,
      onPickerConfirm: (data) => {
        this.setState({
          title: data[0]
        })
      }
    }
    Picker.init({ ...pickerSettings })
    Picker.show()
  }
  onAlertOk = () => {
    this.props.initFeedbackRequest()
    this.setState({ text: '', name: '', email: '' })
    this.props.navigation.goBack()
  }
  onPressOkError = () => {
    this.props.initFeedbackRequest()
  }
  alert = (type) => {
    let text = ''
    let onPressOk = this.onPressOkError
    if (type === 'EMPTY_EMAIL') {
      text = lng(pfx + 'errEmail')
    } else if (type === 'EMPTY_NAME') {
      text = lng(pfx + 'invalidName')
    } else if (type === 'WRONG_EMAIL') {
      text = lng(pfx + 'invalidEmail')
    } else if (type === 'WRONG_DOMAIN') {
      text = lng(pfx + 'invalidDomain')
    } else if (type === 'COMMON_ERROR') {
      text = lng(pfx + 'commonError')
    } else if (type === 'SUCCESS') {
      text = lng(pfx + 'textAlert')
      onPressOk = this.onAlertOk
    }
    Alert.alert(lng(pfx + 'titleAlert'), text,
      [{ text: lng('common.ok'), onPress: onPressOk }],
      { cancelable: false },
    )
  }
  onSend = () => {
    // this.props.sendFeedbackRequest({...this.state, userID: this.props.userID})
    const feedback = {... this.state };
    feedback.title = this.titleValues[this.state.title];
    console.log({
      feedback,
      state: this.state,
    });
    // this.props.sendFeedbackRequest()
  }
  render() {
    const { feedbackRequest } = this.props
    // console.log(feedbackRequest)
    let backgroundColor = '#EEFAFA'
    let color = '#1EC1D6'
    switch (Config.ENV) {
      case 'facebook': {
        backgroundColor = '#EEFAFA'
        color = '#1EC1D6'
        break
      }
      case 'general':
        backgroundColor = '#EEFAFA'
        color = '#1EC1D6'
        break
      case 'maccabi':
        backgroundColor = '#D6E2F1'
        color = '#525558'
        break
      default: {
        backgroundColor = '#EEFAFA'
        color = '#1EC1D6'
      }
    }
    if (feedbackRequest.status === 'ERROR') {
      this.alert(feedbackRequest.error)
    } else if (feedbackRequest.status === 'SUCCESS') {
      this.alert('SUCCESS')
    }
    
    return (
      // <View style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{ width: '100%' }}
        behavior='position'
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={60}>
        <ScrollView  >
          <View style={[style.body]}>
            <Text style={[style.label, styles.header]}>{lng(pfx + 'labelTitle')}</Text>
            {/* <Picker
              selectedValue={this.state.title}
              style={[style.title, {backgroundColor}, {color}]}
              itemStyle={style.itemStyle}
              onValueChange={this.onChangeValue}>
              <Picker.Item label={this.titles['support']} value="support" />
              <Picker.Item label={this.titles['recommendations']} value="recommendations" />
            </Picker> */}
            <AgePicker value={this.state.title} onPress={this.onPressSubject} />
            <Text style={[style.label, styles.header]}>{lng(pfx + 'labelName')}</Text>
            <DDInput maxLength={20} value={this.state.name} onChangeText={name => this.setState({ name })} />

            <Text style={[style.label, styles.header]}>{lng(pfx + 'labelEmail')}</Text>
            <DDInput value={this.state.email} onChangeText={email => this.setState({ email })} />

            <Text style={[style.label, styles.header]}>{lng(pfx + 'labelText')}</Text>
            <View style={[style.textContainer, { backgroundColor }]}>
              <DDInput multiline={true}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
              />
            </View>

            <DDButton
              title={lng(pfx + 'btnSend').toLocaleUpperCase()}
              onPress={this.onSend} style={style.btn}
              disabled={feedbackRequest.status === 'REQUEST'}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

// Feedback.propTypes = {}


export default connect(
  (state) => ({
    locale: state.settings.locale,
    userID: state.auth.userID,
    feedbackRequest: state.settings.sendFeedbackRequest
  }),
  dispatch => ({
    sendFeedbackRequest: (payload) => dispatch({ type: 'FEEDBACK_REQUEST', payload }),
    initFeedbackRequest: () => dispatch({ type: 'FEEDBACK_REQUEST_INIT' })
  })
)(Feedback)


const style = ScaledSheet.create({

  body: {
    // borderColor: 'black',
    // borderWidth: 1,
    height: '100%',
    paddingHorizontal: '20@ms',
    marginTop: '20@ms',
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    marginTop: '5@ms',
    // color: '#277B98',

    // backgroundColor: '#EEFAFA',
  },
  textContainer: {
    marginTop: '5@ms',
    // backgroundColor: '#EEFAFA',
    width: '100%',
    ...Platform.select({ android: { height: '100@ms' } }),
  },
  // textBox: {

  //   writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  //   ...Platform.select(
  //     {
  //       android: {
  //         padding: '10@ms',
  //         lineHeight: '30@ms',
  //         textAlign: 'auto',
  //       },
  //       ios: {
  //         height: '60@ms',
  //         padding: '4@ms',
  //       },
  //     }
  //   ),

  // },

  btn: {
    marginTop: '20@ms'
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: '10@ms'
  },
  itemStyle: {
    height: '120@ms'
  }
})
