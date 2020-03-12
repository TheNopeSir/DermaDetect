import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'
import Screen from './components/Screen'
import Header from './components/Header'
import Footer from './components/Footer'
import s from '../../assets/stylesScalable'
import { lng } from '../../i18n'
import beausLines from '../../images/nails/BeausLines.png'
import clubbing from '../../images/nails/clubbing.png'
import terrysnails from '../../images/nails/terrysnails.png'
import pitting from '../../images/nails/Pitting.png'
import yellownail from '../../images/nails/yellownail.png'
import meesline from '../../images/nails/Meesline.png'
import whitespots from '../../images/nails/whitespots.png'
import spooning from '../../images/nails/spooning.png'
import onycholysis from '../../images/nails/Onycholysis.png'
import onychomycosis from '../../images/nails/Onychomycosis.png'
import R from 'ramda'
// import camera, { CAMERA_STATUSES } from '../../services/camera.service'
import ModalDD from './components/Modal.component'
import style from '../../assets'
// import queue from '../../services/queue.service'
import Config from 'react-native-config'
import SwitcherConditionCovers from '../Application/ConditionLocation/components/SwitcherConditionCovers'
import CameraComponent from './components/camera.component'
import { showCameraDialog, hideCameraDialog, sendPhoto } from '../../actions/camera.actions'
import { initNailsReducer } from '../../actions/actions'

const delay = ms => new Promise(res => setTimeout(res, ms))
/**
Beau’s lines *
Clubbing *
Koilonychia (spooning)
Leukonychia (white spots)
Mees’ lines *
Onycholysis
Pitting *
Terry’s nails * 
Yellow nail syndrome * 
Onychomycosis
*/
const images = {
  beausLines,
  clubbing,
  terrysnails,
  pitting,
  yellownail,
  meesline,
  whitespots,
  spooning,
  onycholysis,
  onychomycosis,
}

const pfx = 'screen.nailsScreen.'

class NailsScreen extends Component {
  static navigationOptions = { header: null, }
  state = {
    modalVisible: false,
    nextDisable: true,
    cameraDialog: false,
    location: {},
    imageExist: false
  }
  onDismissQueue = []

  onPressNail = (nail) => {
    this.setState({ nextDisable: true })
    this.props.setNailDeseases(nail)
    this.setState({ modalVisible: true })
  }

  next = () => {
    this.props.navigation.navigate('ConditionDetails')
  }
  back = () => {
    this.props.navigation.goBack()
  }

  imageChoose = res => {
    if(!res) {
      this.props.initNailsReducer()
      this.setState({ cameraDialog: false, imageExist: false })
    } else {
      this.setState({ cameraDialog: false, imageExist: true })
    }

  }
  

  onDialogOk = async () => {
    const { leg } = this.props.limb
    // const primary = leg ? { primary: 'leg' } : { primary: 'arm' }
    const location = leg ? 'nailsLegLeft' : 'nailsArmLeft'
    const isAndroid = Platform.OS === 'android'
    this.setState({ 
      modalVisible: false,
      cameraDialog: isAndroid,
      location,
      // location: { ...primary, secondary: 'nails' } 
    }, () => {
      if (!isAndroid) {
        this.onDismissQueue.push(() => {
          this.setState({cameraDialog: true})
        })
      }
    })
    /*
    // Fix overlapping modals on iOS
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        this.props.showCameraDialog()
      }, 500)
    } else {
      this.props.showCameraDialog()
    }
    */
  }


  onPressedDialogChoice = () => {
    this.setState({cameraDialog: false })
  }

  render() {
    // console.log('state', this.state)
    const { nailsDeseases, limb, coverage, setLimb, setCoverage, isEmptyNailDeseases } = this.props

    const firstGroup = [nailsDeseases.beausLines, nailsDeseases.meesline, nailsDeseases.whitespots, nailsDeseases.pitting]
    const secondGroup = [nailsDeseases.yellownail, nailsDeseases.onychomycosis, nailsDeseases.spooning]
    const thirdGroup = [nailsDeseases.terrysnails, nailsDeseases.clubbing, nailsDeseases.onycholysis]

    const header = <Header
      progress={0.3}
      title={lng(pfx + `header`).toUpperCase()}
      onPressSandwich={this.onPressSandwich}
    />
    const footer = <Footer
      backDisabled={false}
      nextDisabled={isEmptyNailDeseases || !this.state.imageExist}
      onClickNext={this.next}
      onClickBack={this.back}
    />
    const body = (
      <View style={styles.body}>
        <Text style={[style.title, s.mt10, { width: '80%', textAlign: 'center' }]} multiline={true} numberOfLines={2}>
          {lng(pfx + `title`)}
        </Text>
        <View style={[styles.nailsContainer, s.mt10]}>
          {firstGroup.map((nail, idx) =>
            <TouchableOpacity key={idx}
              style={[styles.nailContainer, nail.checked && style.selectedSkinNails]}
              onPress={() => { this.onPressNail(nail) }}
            >
              <Image style={styles.imgNail} source={images[nail.key]} resizeMode='contain'></Image>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.nailsContainer,]}>
          {secondGroup.map((nail, idx) =>
            <TouchableOpacity key={idx}
              style={[styles.nailContainer, nail.checked && style.selectedSkinNails]}
              onPress={() => { this.onPressNail(nail) }}
            >
              <Image style={styles.imgNail} source={images[nail.key]} resizeMode='contain'></Image>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.nailsContainer,]}>
          {thirdGroup.map((nail, idx) =>
            <TouchableOpacity key={idx}
              style={[styles.nailContainer, nail.checked && style.selectedSkinNails]}
              onPress={() => { this.onPressNail(nail) }}
            >
              <Image style={styles.imgNail} source={images[nail.key]} resizeMode='contain'></Image>
            </TouchableOpacity>
          )}
        </View>

      </View>
    )

    return (
      <>
        <Screen header={header} body={body} footer={footer} scrollEnabled={true} />

        <CameraComponent
          visible={this.state.cameraDialog}
          location={this.state.location}
          imagePick={this.imageChoose}
          onPressed={this.onPressedDialogChoice}

        />

        <ModalDD visible={this.state.modalVisible}
          onDismissQueue={this.onDismissQueue}
          header={lng(pfx + 'titleDialog').toUpperCase()}
          body={
            <View style={[DialogStyle.body]}>
              <View style={styles.optionContainer}>

                <TouchableOpacity
                  style={[styles.option, limb.arm && style.selectedSkinNails]}
                  onPress={() => setLimb('arm')}
                >
                  <Text style={style.text} multiline={true} numberOfLines={2} >
                    {lng(pfx + `arm`).toUpperCase()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.option, limb.leg && style.selectedSkinNails]}
                  onPress={() => setLimb('leg')}
                >
                  <Text style={style.text} multiline={true} numberOfLines={2}>
                    {lng(pfx + `leg`).toUpperCase()}
                  </Text>
                </TouchableOpacity>

              </View>

              <View style={s.mt30}>
                <SwitcherConditionCovers value={coverage} onChange={setCoverage} />
              </View>
            </View>
          }
          footer={[{ label: lng('common.ok').toUpperCase(), cb: this.onDialogOk }]}
        />
      </>
    )
  }

}

const mapStateToProp = (state) => ({
  nailsDeseases: state.nails.nailsDeseases,
  limb: state.nails.limb,
  coverage: state.nails.coverage,
  isEmptyNailDeseases: isEmptyNailDeseases(state),
})
const mapDispatchToProps = (dispatch) => ({
  setNailDeseases: (nail) => dispatch({ type: 'SET_NAIL_DESEASES', payload: nail }),
  setLimb: (limb) => dispatch({ type: 'SET_LIMB', payload: limb }),
  setCoverage: (coverage) => dispatch({ type: 'SET_COVERAGE', payload: coverage }),
  showCameraDialog: () => dispatch(showCameraDialog()),
  hideCameraDialog: () => dispatch(hideCameraDialog()),
  initNailsReducer: () => dispatch(initNailsReducer())
})

export default connect(mapStateToProp, mapDispatchToProps)(NailsScreen)

const isEmptyNailDeseases = (state) => {
  const { nailsDeseases } = state.nails
  const checkedNailDeseases = R.pickBy((val) => val.checked)(nailsDeseases)
  return R.isEmpty(checkedNailDeseases)
} 

const DialogStyle = ScaledSheet.create({
  body: {
    paddingHorizontal: '10@ms',
    paddingVertical: '10@ms'
  },
})
const styles = ScaledSheet.create({
  body: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    textAlign: 'center'
  },
  imgNail: {
    width: '80@ms',
    height: '100@ms'

  },
  nailsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: '3@ms'
  },
  nailContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '10@ms',
    paddingHorizontal: '2@ms',
    // width: '90@ms',
    // height: '40@ms',
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },

  optionContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  option: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90@ms',
    height: '40@ms',
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },

})

