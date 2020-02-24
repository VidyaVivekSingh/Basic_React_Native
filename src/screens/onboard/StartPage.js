import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity, Platform
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Toast } from 'native-base';
import { NoFlickerImage } from 'react-native-no-flicker-image';
import { connect } from 'react-redux';
import AnimateNumber from 'react-native-animate-number';
import WallpaperAnimation from '../../assets/animations/WallpaperAnimation';
import GetUserCountService from '../../api/StartPage/UsersCountService';
import {
  setAssessmentType, updateQuestions, updateCurrentQuestion, updateLoginType,
  updateCurrentFlow, updateUsername, updateFetchedUrl, updateUserSocialImage, resetState
} from '../../store/actions/index';
import { fontMaker, regularButtonFont } from '../../components/utility/fonts/FontMaker';

import image1 from '../../assets/images/startPage/1.jpg';
import image2 from '../../assets/images/startPage/2.jpg';
import image3 from '../../assets/images/startPage/3.jpg';
import image4 from '../../assets/images/startPage/4.jpg';
import image5 from '../../assets/images/startPage/5.jpg';
import image6 from '../../assets/images/startPage/6.jpg';
import image7 from '../../assets/images/startPage/7.jpg';
import image8 from '../../assets/images/startPage/8.jpg';
import image9 from '../../assets/images/startPage/9.jpg';
import zulImage from '../../assets/images/onboard/zulNew.png';

const mapDispatchToProps = dispatch => ({
  getAllQuestion: data => dispatch(updateQuestions(data)),
  getCurrentQuestion: data => dispatch(updateCurrentQuestion(data)),
  SetAssessmentType: type => dispatch(setAssessmentType(type)),
  updateCurrentFlowProp: type => dispatch(updateCurrentFlow(type)),
  updatedUserName: name => dispatch(updateUsername(name)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url)),
  updatedUserSocialImage: uri => dispatch(updateUserSocialImage(uri)),
  updatedLoginType: loginType => dispatch(updateLoginType(loginType)),
  resetedState: () => dispatch(resetState())
});

class LandingComponent extends Component {
  wallpaperPaths = [
    { path: image1 },
    { path: image2 },
    { path: image3 },
    { path: image4 },
    { path: image5 },
    { path: image6 },
    { path: image7 },
    { path: image8 },
    { path: image9 }
  ];

  groupbuttons = [2, 0, 0, 8, 3];

  state = {
    imageURL: this.wallpaperPaths[0].path,
    UserCount: 0,
    networkLost: 0
  };

  componentDidMount() {
    const { resetedState } = this.props;
    let i = 1;
    resetedState();
    this.backInterval = setInterval(() => {
      this.setState({ imageURL: this.wallpaperPaths[i].path, });
      i = this.shouldCounterReset(i);
    }, 5000);
    NetInfo.isConnected.fetch().done((isConnected) => {
      isConnected ? this.UserCounter() : null;
    });
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    //NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    clearInterval(this.backInterval);
  }

  handleConnectivityChange = (isConnected) => {
    const { networkLost } = this.state;

    if (networkLost > 0) {

      if (!isConnected) {

        this.setState({ networkLost: networkLost + 1 });
        if (Platform.OS === 'android') {

          Toast.show({
            text: 'No Internet connection..!!',
            duration: 2000,
            type: 'danger',
            position: 'bottom'
          });

        }

      } else {

        this.UserCounter();
        Toast.show({
          text: 'Internet connected..!!',
          duration: 2000,
          type: 'success',
          position: 'bottom'
        });

      }

    } else {
      if (!isConnected) {
        this.setState({ networkLost: networkLost + 1 });
        if (Platform.OS === 'android') {

          Toast.show({
            text: 'No Internet connection..!!',
            duration: 2000,
            type: 'danger',
            position: 'bottom'
          });



        }
      }
    }

  }

  shouldCounterReset = (index) => {
    const p = index === 8 ? 0 : index + 1;
    return p;
  }

  UserCounter = () => {
    GetUserCountService.fetchUsersCount()
      .then((responseJson) => {
        try {
          this.setState({ UserCount: responseJson.totalCount });
        } catch (ex) {
          console.error(ex);
        }
      })
      .catch((err) => { console.log('Network Error', err); });
  }

  changeCounter = () => {
    for (let i = 0; i < 8; i += 1) {
      this.groupbuttons[3] = i + 1;
      this.groupbuttons[4] = i + 2;
    }
  }

  login = () => {
    const { updateCurrentFlowProp, navigation, updatedLoginType } = this.props;
    updatedLoginType('User');
    updateCurrentFlowProp('NEW');
    navigation.navigate('LoginRouteLogIn');
  }

  checkWellness = () => {
    const { updateCurrentFlowProp, navigation } = this.props;
    updateCurrentFlowProp('NEW');
    navigation.navigate('RouteWithoutRegistrartionCheckYourWellness');
  }

  render() {
    const { updateCurrentFlowProp, navigation, updatedLoginType } = this.props;
    const { imageURL, UserCount } = this.state;

    return (
      <View style={styles.flexOne}>
        <WallpaperAnimation>
          <NoFlickerImage style={styles.loginContainer} source={imageURL} />
        </WallpaperAnimation>
        <View style={styles.loginInnerContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.loginLogo} source={zulImage} />
            <Text style={styles.label}
            >
              Re-Discover Yourself
            </Text>
          </View>

          <View style={styles.centerJustifiedContent}>
            <Text style={styles.statement}>We are helping</Text>
            <View style={styles.userCountContainer}
            >
              <Text style={styles.userCountText}
              >
                <AnimateNumber
                  value={UserCount}
                  countBy={Math.ceil(UserCount / 5)}
                  timing={(interval, progress) => (
                    interval * (2 - Math.sin(Math.PI * progress)) * 10
                  )}
                />

              </Text>
            </View>
            <Text style={styles.statement}>
              people around the world to live
              <Text style={styles.textFont}> well</Text>
              {' '}
              and be
              <Text style={styles.textFont}> happy</Text>
            </Text>
          </View>
          <View style={styles.fullWidth}>
            {/* <Text style={{
              top: 12, fontSize: 16, fontFamily: 'System', color: '#ffffff', textAlign: 'center', ...statementFontStyle
            }}
            >
              Login as
            </Text> */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.logInBtn} onPress={this.login}>
                <Text style={styles.textWhiteLogin}>{'Login to a better life'.toUpperCase()}</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={[styles.logInBtn, { marginHorizontal: 5 }]} onPress={() => { updatedLoginType('Expert'); updateCurrentFlowProp('NEW'); navigation.navigate('LogIn'); }}>
                <Text style={styles.textWhiteLogin}>{'Expert'.toUpperCase()}</Text>
              </TouchableOpacity> */}
            </View>
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.hurryText}
            >
              In a hurry?
            </Text>
            <TouchableOpacity style={styles.takeAssessmentBtn} onPress={this.checkWellness}>
              <Text style={styles.textCheckYourWellness}>{'Check Your Wellness Now'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View >
    );
  }
}


const statementFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const logoTextFontStyle = fontMaker({ family: 'OpenSans', weight: 'Bold' });
const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  label: {
    fontSize: 20, textAlign: 'center', color: '#fff', ...logoTextFontStyle
  },
  centerJustifiedContent: { justifyContent: 'center' },
  userCountContainer: {
    width: 100, height: 70, borderRadius: 25, backgroundColor: '#00000054', alignSelf: 'center', top: 3, flexDirection: 'row', justifyContent: 'center'
  },
  userCountText: {
    fontFamily: 'System', fontSize: 32, textAlign: 'center', color: '#fff', top: 15
  },
  textFont: { fontFamily: 'System', fontWeight: 'bold' },
  fullWidth: { width: '100%' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  hurryText: {
    top: 12, fontSize: 16, color: '#ffffff', textAlign: 'center', ...statementFontStyle
  },

  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  loginInnerContainer: {
    backgroundColor: '#00000054',
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  statement: {

    fontSize: 25,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 10,
    ...statementFontStyle
  },
  textCheckYourWellness: {
    color: '#ffffff',
    fontSize: 15,
    ...regularButtonFont
  },
  textWhiteLogin: {

    color: '#ffffff',
    fontSize: 18,
    ...regularButtonFont
  },
  takeAssessmentBtn: {
    backgroundColor: '#80399d',
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 15,
    borderRadius: 8,
    marginLeft: 30,
    marginRight: 30,
  },
  registerBtn: {
    backgroundColor: '#2980b9',
    alignItems: 'center',
    paddingVertical: 12,
    width: 130,
    borderRadius: 8,
    marginLeft: 5
  },
  logInBtn: {
    backgroundColor: '#27ae60',
    height: 50,
    width: '90%',
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 15,
    borderRadius: 8,
    marginLeft: 30,
    marginRight: 30,

  },
  loginLogo: {
    marginTop: 40,
    marginBottom: 5
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default connect(null, mapDispatchToProps)(LandingComponent);
