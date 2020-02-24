import React, { Component } from 'react';
import {
  Platform, View, Image, StyleSheet, Dimensions, ImageBackground
} from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import WizardTab from '../../../components/ui/WizardTab/WizardTab';
import MobileNos from './GenerateOTP';
import OtpPassword from '../../register/OTP';
import ConfirmPassword from './ConfirmPassword';
import { defaultModalFont, regularButtonFont } from '../../../components/utility/fonts/FontMaker';

const windowDimensions = Dimensions.get('window');

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
});

class ForgotPasscode extends Component {
  state = {
    currentStep: 0,
    showSCLAlert: false,
  }

  goToNext = () => {
    this.setState(prevState => ({ currentStep: prevState.currentStep + 1 }));
  };

  goToPrevious = () => {
    this.setState(prevState => ({ currentStep: prevState.currentStep - 1 }));
  }

  goToLogin = () => {
    const { navigation } = this.props;
    navigation.navigate('LoginRouteLogIn');
  }

  handleOpen = () => {
    this.setState({ showSCLAlert: true });
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
  }

  render() {
    const { showSCLAlert, currentStep } = this.state;
    return (
      /* eslint-disable global-require */
      <ImageBackground
        source={require('../../../assets/images/loginwallpapers/ZUL_SignUp_Screen.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <SCLAlert
          theme="danger"
          show={showSCLAlert}
          title="Oops!"
          subtitle="Please enter valid OTP."
          cancellable
          onRequestClose={this.handleClose}
          headerContainerStyles={{ backgroundColor: '#41ab3e' }}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="danger" onPress={this.handleClose} textStyle={{ ...regularButtonFont }}>CLOSE</SCLAlertButton>
        </SCLAlert>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          enableOnAndroid
          style={styles.blackMatLayer}
        >
          <View style={styles.labelContainer}>
            <Image style={styles.loginLogo} source={require('../../../assets/images/onboard/zulNew.png')} />
            <Text style={styles.labelText}
            >
              Forgot Passcode
            </Text>
          </View>

          <WizardTab currentStepSelected={currentStep}>
            <MobileNos title="Enter Mobile Number" nextHandler={this.goToNext} prevHandler={this.goToPrevious} />
            <OtpPassword title="OTP for Password" showAlert={this.handleOpen} nextHandler={this.goToNext} prevHandler={this.goToPrevious} />
            <ConfirmPassword title="Confirm Password" nextHandler={this.goToNext} prevHandler={this.goToPrevious} goToLogin={this.goToLogin} />
          </WizardTab>


        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}
export default connect(mapStateToProps, null)(ForgotPasscode);
const styles = StyleSheet.create({
  container: {},
  loginLogo: {
    marginTop: 40,
    marginBottom: 20
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: '#fff',
    ...Platform.select({
      ios: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
      }
    }),
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  otpBtn: {
    backgroundColor: '#00c497',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 100,
    marginLeft: 100
  },
  disableBtn: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  whiteText: { color: '#fff' },
  blackText: { color: '#000' },
  blackMatLayer: {
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  },
  labelStyle: { color: '#fff' },

  inputStyle: {
    height: 60,
    borderWidth: 0,
    color: '#fff',
    ...Platform.select({
      ios: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
      }
    }),
  },
  customStyle: {
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  imageBackground: {
    flex: 1, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute'
  },
  labelContainer:{ justifyContent: 'center', alignItems: 'center' },
labelText:{
  fontFamily: 'System', paddingTop: 20, fontSize: 25, color: '#000', textAlign: 'center'
},


});
