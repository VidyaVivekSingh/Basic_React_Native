import React, { Component } from 'react';
import {
  StyleSheet, View, Dimensions, AsyncStorage, Animated, TouchableOpacity, ImageBackground,
  Platform, StatusBar
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Text, Toast } from 'native-base';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import AutoLogin from '../../../api/StartPage/AutoLogin';
import {
  updateUsername, updateUserSocialImage, updateDob, updateEmail, updateFetchedUrl,
  updateHeight, updateWeight, updateAcceptance, updateMobile, updateGender, updateBmi
} from '../../../store/actions/users';
import { updateCurrentFlow } from '../../../store/actions/assessment';
import { regularButtonFont } from '../../utility/fonts/FontMaker';
import { isTouchIdEnabled } from '../../../repository/login/LoginRepository';
import CalculateBmi from '../../utility/bmi/Bmi';

const mapDispatchToProps = dispatch => ({
  updatedUsername: name => dispatch(updateUsername(name)),
  updatedGender: gender => dispatch(updateGender(gender)),
  updateUserMobile: mobile => dispatch(updateMobile(mobile)),
  updatedAcceptance: acceptance => dispatch(updateAcceptance(acceptance)),
  updatedCurrentFlow: flow => dispatch(updateCurrentFlow(flow)),
  updatedUserSocialImage: image => dispatch(updateUserSocialImage(image)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedEmail: email => dispatch(updateEmail(email)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedWeight: weight => dispatch(updateWeight(weight)),
  updatedBmi: data => dispatch(updateBmi(data)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url))
});

class PreOnBoard extends Component {
  state = {
    autoLogin: false,
    spinValue: new Animated.Value(0),
    networkStatus: false,
    networkLost: 0
  }

  componentDidMount() {
    SplashScreen.hide();
    const { spinValue, networkStatus } = this.state;
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    AsyncStorage.getItem('isFirstTimeUser', (err, result) => {
      if (result === 'false') {
        this.setState({ autoLogin: true });
        NetInfo.isConnected.fetch().done((isConnected) => {
          isConnected ? this.autologin() : null;
        });
      } else {
        this.setState({ autoLogin: false });
      }
    });
    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            spinValue,
            {
              toValue: 1,
              duration: 20000
            }
          ),
          Animated.timing(
            spinValue,
            {
              toValue: 0,
              duration: 20000
            }
          )
        ])
      )
    ]).start();
  }

  componentWillUnmount() {
    // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    const { networkLost, autoLogin } = this.state;
    if (isConnected) {
      this.setState({ networkStatus: true });
      if (networkLost > 0) {
        Toast.show({
          text: 'Internet connected..!!',
          duration: 2000,
          type: 'success',
          position: 'bottom'
        });
        autoLogin ? this.autologin() : null;
      }
    } else {
      this.setState({ networkLost: networkLost + 1 });
      if (Platform.OS === 'android') {
        Toast.show({
          text: 'No Internet connection..!!',
          duration: 3000,
          type: 'danger',
          position: 'bottom'
        });
      }
    }
  };

  _done = () => {
    const { navigation } = this.props;
    AsyncStorage.setItem('isFirstTimeUser', 'false', () => {
      navigation.navigate('LoginRoute');
    });
  }

  autologin = () => {
    const {
      navigation, updatedUsername, updatedDob, updatedHeight, updatedWeight, updatedAcceptance,
      updatedUserSocialImage, updatedCurrentFlow, updatedFetchedUrl, updatedEmail, updateUserMobile, updatedBmi,
      updatedGender,
    } = this.props;
    updatedCurrentFlow('REGISTERED');
    AsyncStorage.getItem('userToken').then((token) => {
      AutoLogin.autoLogin(token).then((responseJson) => {
        try {
          if (responseJson.name === 'JsonWebTokenError' || responseJson.hasOwnProperty.call(responseJson, 'err')) {
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('enableTouchId');
            isTouchIdEnabled();
            this._done();
          } else {
            updatedUsername(responseJson.name);
            updateUserMobile(responseJson.mobile);
            updatedAcceptance(responseJson.goalAcceptance);
            updatedDob(responseJson.dob);
            updatedGender(responseJson.gender ? responseJson.gender : null);
            updatedHeight(responseJson.height);
            updatedWeight(responseJson.weight);
            updatedBmi(CalculateBmi(responseJson.height, responseJson.weight));
            updatedFetchedUrl(responseJson.image.userImageURL);
            updatedEmail(responseJson.email);
            AsyncStorage.getItem('UserSocialImage').then((socialImage) => {
              updatedUserSocialImage(socialImage);
            });
            navigation.navigate('OverviewRoute');
          }
        } catch (ex) {
          Toast.show({
            text: ex,
            duration: 2000,
            type: 'danger'
          });
        }
      }).catch((error) => {
        Toast.show({
          text: error,
          duration: 2000,
          type: 'danger'
        });
      });
    });
  }

  render() {
    const { autoLogin } = this.state;
    const { navigation } = this.props;

    /* eslint-disable global-require */
    const srcc = require('../../../assets/images/preOnboard/ZULSignupScreenEditednew.png');
    /* eslint-enable global-require */
    return (

      <View style={styles.sliderContainer}>
        <StatusBar barStyle='light-content' />
        <ImageBackground
          source={srcc}
          style={{
            width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'
          }}
        >
          {autoLogin
            ? null
            : (
              <TouchableOpacity style={styles.logInBtn} onPress={() => { navigation.navigate('OnBoard'); }}>
                <Text style={{ color: '#fff', ...regularButtonFont }}>START THE JOURNEY</Text>
              </TouchableOpacity>
            )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginLogo: {
    marginTop: 10,
    marginBottom: 20,
  },
  rediscover: {
    marginTop: 10,
    marginBottom: 20,
    width: 70,
  },
  Logo: { marginBottom: -80 },
  text: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: -50,
    padding: 10
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 12,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 2,
    position: 'absolute',
    bottom: 40
  },
  beResponsibleLogo: {
    height: Dimensions.get('window').height / 5,
    aspectRatio: 1
  },
  zulbewell: {
    width: Dimensions.get('window').width / 2,
    aspectRatio: 1
  }
});

export default connect(null, mapDispatchToProps)(PreOnBoard);
