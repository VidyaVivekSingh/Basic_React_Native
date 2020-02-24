import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Dimensions, Keyboard, ImageBackground, AsyncStorage
} from 'react-native';
import { Text } from 'native-base';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import AwesomeAlert from 'react-native-awesome-alerts';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserDetails from './UserDetails';
import OTP from './OTP';
import Passcode from './Passcode';
import WizardTab from '../../components/ui/WizardTab/WizardTab';
import { updateCurrentFlow } from '../../store/actions/assessment';
import { updateUsername, updateUserSocialImage } from '../../store/actions/index';
import { defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';

const windowDimensions = Dimensions.get('window');


const mapDispatchToProps = dispatch => ({
  updatedUserName: name => dispatch(updateUsername(name)),
  updatedUserSocialImage: image => dispatch(updateUserSocialImage(image)),
  updateUserCurrentFlow: flow => dispatch(updateCurrentFlow(flow))
});

const mapStateToProps = state => ({
  currentFlow: state.Assessment.currentFlow,
  tempHeight: state.User.tempheight,
  currentAssessment: state.Assessment.currentAssessment,
  image: state.User.socialImage
});
class Register extends Component {
  constructor() {
    super();
    this.state = {
      showSCLAlert: false,
      showAlert: false,
      title: 'Oops!',
      description: 'Welcome',
      theme: 'success',
      buttonMessage: 'LET\'S GO',
      showConfirm: false,
      showProgress: false,
      isKeyboardOpen: false,
      currentStep: 0,
      userToken: null
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpen: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpen: false });
  }

  handleOpen = () => {
    this.setState({ showSCLAlert: true });
  }

  handleClose = () => {
    const { theme } = this.state;
    this.setState({ showSCLAlert: false });
    if (theme === 'success') {
      this.gotoFunction();
    }
  }

  gotoFunction = () => {
    const { currentFlow, image, updateUserCurrentFlow } = this.props;
    const { userToken } = this.state;
    if (currentFlow === 'UNREGISTERED') {
      AsyncStorage.setItem('userToken', userToken);
      this.reportsNavigation();
      updateUserCurrentFlow('REGISTERED');
    } else if (image !== '') {
      this.Dashboard();
    } else this.loginNavigation(); // Dashboard if direct to login
  }

  showAlert = (title, desc, showConfirm, showProgress) => {
    this.setState({
      showAlert: true,
      title,
      description: desc,
      showConfirm,
      showProgress
    });
  };

  showSCLAlert = (title, desc, theme, buttonMessage, token = null) => {
    this.setState({
      showSCLAlert: true,
      title,
      description: desc,
      theme,
      buttonMessage,
      userToken: token
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      description: ''
    });
  };

  goLandingPage = () => {
    const { navigation } = this.props;
    navigation.navigate('RegisterRouteStartPage');
  }

  Dashboard = () => {
    const { navigation } = this.props;
    navigation.navigate('OverviewRoute');
  }

  loginNavigation = () => {
    const { navigation } = this.props;
    navigation.navigate('LoginRouteLogIn');
  }

  reportsNavigation = () => {
    const { navigation, currentAssessment } = this.props;
    navigation.navigate('OverviewRoute');
    // navigation.navigate('ReportRouteDimensionalReport', { title: currentAssessment });
    navigation.navigate('ReportRouteDimensionalReport');
    // if (currentAssessment === 'Biological Age') { navigation.navigate('BiologicalReport'); } else { navigation.navigate('AssessmentReport'); }
  }

  goToNext = () => {
    this.setState(prevState => ({ currentStep: prevState.currentStep + 1 }));
  };

  goToPrevious = () => {
    this.setState(prevState => ({ currentStep: prevState.currentStep - 1 }));
  };

  render() {
    const {
      showAlert,
      title,
      description,
      showConfirm,
      showProgress,
      currentStep,
      theme,
      showSCLAlert,
      buttonMessage
    } = this.state;
    return (
      /* eslint-disable global-require */
      <ImageBackground
        source={require('../../assets/images/loginwallpapers/ZUL_SignUp_Screen.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      >

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          enableOnAndroid
          style={styles.blackMatLayer}
        >
          <View style={styles.centreAlignment}>
            <Image style={styles.loginLogo} source={require('../../assets/images/onboard/zulNew.png')} />
            <Text style={styles.label}
            >
              Create an account
            </Text>
          </View>

          <View style={styles.wizTabContainer}>
            <WizardTab currentStepSelected={currentStep}>
              <UserDetails title="Zinger Details" showAlert={this.showSCLAlert} nextHandler={this.goToNext} prevHandler={this.goToPrevious} goToDashboard={this.Dashboard} />
              <OTP title="Enter OTP" showAlert={this.showSCLAlert} nextHandler={this.goToNext} prevHandler={this.goToPrevious} />
              <Passcode title="Set Passcode" showAlert={this.showSCLAlert} nextHandler={this.goToNext} prevHandler={this.goToPrevious} goToDashboard={this.Dashboard} loginNavigation={this.loginNavigation} reportsNavigation={this.reportsNavigation} />
            </WizardTab>
          </View>

          <AwesomeAlert
            alertContainerStyle={styles.awesomeAlertContainer}
            messageStyle={styles.awesomeMessage}
            confirmButtonTextStyle={styles.confirmButtonText}
            confirmButtonStyle={styles.confirmButton}
            show={showAlert}
            showProgress={showProgress}
            title={title}
            message={description}
            closeOnTouchOutside
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={showConfirm}
            cancelText=""
            confirmText="Continue"
            confirmButtonColor="#00c497"
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
              this.gotoFunction();
            }}
          />

        </KeyboardAwareScrollView>
        <SCLAlert
          theme={theme}
          show={showSCLAlert}
          title={title}
          subtitle={description}
          cancellable
          onRequestClose={this.handleClose}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          {title === 'Congratulations!' ? (
            <View style={styles.congratsImageContainer}>
              <Image source={require('../../assets/images/registration/wellnessimg.jpg')} style={styles.congratsImage} />
            </View>
          ) : null}
          <SCLAlertButton
            theme={theme}
            onPress={this.handleClose}
            textStyle={{ ...regularButtonFont }}
          >
            {buttonMessage.toUpperCase()}
          </SCLAlertButton>
        </SCLAlert>
      </ImageBackground>
      /* eslint-enable global-require */
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  loginLogo: {
    marginTop: 40,
    marginBottom: 10
  },
  wizardStep: {
    flex: 1,
    padding: 5
  },
  wizardInternal: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10
  },
  selectedWizardStep: {
    flex: 1,
    padding: 5
  },
  selectedWizardInternal: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#00c497',
    paddingVertical: 5,
    borderRadius: 10
  },
  blackMatLayer: {
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  },
  imageBackground: {
    flex: 1, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute'
  },
  centreAlignment: { justifyContent: 'center', alignItems: 'center' },
  label: {
    fontFamily: 'System', paddingTop: 30, fontSize: 25, color: '#000', textAlign: 'center'
  },
  wizTabContainer: { flexDirection: 'column', justifyContent: 'center', flex: 0.5 },
  awesomeAlertContainer: { width: '100%', height: 600 },
  confirmButtonText: {
    fontFamily: 'System', fontSize: 16, paddingVertical: 5, textAlign: 'center'
  },
  confirmButton: { width: 200 },
  awesomeMessage: { fontFamily: 'System', fontSize: 15, color: '#3a3a3a' },
  congratsImage:{ height: 90, width: '80%', marginBottom: 10 },
  congratsImageContainer:{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
