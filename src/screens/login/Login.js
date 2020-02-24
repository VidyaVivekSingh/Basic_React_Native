import React, { Component } from 'react';
import {
  StyleSheet, Keyboard, ImageBackground, Dimensions, Image
} from 'react-native';
import { View } from 'native-base';
import { connect } from 'react-redux';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';
import LoginForm from './Form';
import { updateCurrentFlow } from '../../store/actions/assessment';

const windowDimensions = Dimensions.get('window');

const mapStateToProps = state => ({
  currentFlow: state.Assessment.currentFlow,
  tempHeight: state.User.tempheight,
  currentAssessment: state.Assessment.currentAssessment,
  image: state.User.socialImage
});

const mapDispatchToProps = dispatch => ({ updateUserCurrentFlow: flow => dispatch(updateCurrentFlow(flow)) });

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isKeyboardOpened: false,
      showAlert: false,
      title: '',
      description: '',
      buttonMessage: 'LET\'S GO'
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false });
  }

  showAlert = (title, desc) => {
    this.setState({
      showAlert: true,
      title,
      description: desc
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      description: ''
    });
    this.goToFunction();
  };

  goToFunction = () => {
    const { currentFlow, updateUserCurrentFlow } = this.props;
    if (currentFlow === 'UNREGISTERED') {
      this.reportsNavigation();
    } else {
      this.goHome();
    }
    updateUserCurrentFlow('REGISTERED');
  }

  goHome = () => {
    const { navigation, updateUserCurrentFlow } = this.props;
    navigation.navigate('OverviewRoute');
    updateUserCurrentFlow('REGISTERED');
  }

  goRegister = () => {
    const { navigation } = this.props;
    navigation.navigate('RegisterRouteRegister');
  }

  goForgotPassword = () => {
    const { navigation } = this.props;
    navigation.navigate('LoginRouteForgotPassword');
  }

  goToDashboard = () => {
    const { navigation } = this.props;
    navigation.navigate('OverviewRoute');
  }

  reportsNavigation = () => {
    const { navigation, currentAssessment } = this.props;
    if (currentAssessment === 'Biological Age') {
      navigation.navigate('ReportRouteBiologicalReport');
    } else {
      navigation.navigate('ReportRouteBiologicalReport');
    }
  }

  render() {
    const {
      showAlert, title, description, isKeyboardOpened, buttonMessage
    } = this.state;
    /* eslint-disable global-require */
    const src = require('../../assets/images/loginwallpapers/ZUL_SignUp_Screen.png');
    return (
      <ImageBackground
        source={src}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.blackMatLayer}>
          <LoginForm
            isKeyboardOpen={isKeyboardOpened}
            showAlert={this.showAlert}
            goHome={this.goHome}
            goRegister={this.goRegister}
            goForgotPassword={this.goForgotPassword}
            goToDashboard={this.goToDashboard}
            reportsNavigation={this.reportsNavigation}
          />
        </View>
        <SCLAlert
          theme="success"
          show={showAlert}
          title={title}
          subtitle={description}
          cancellable
          onRequestClose={this.hideAlert}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          {title === 'Congratulations!' ? (
            <View style={styles.sclAlertTitle}>
              <Image source={require('../../assets/images/registration/wellnessimg.jpg')} style={styles.sclAlertImage} />
            </View>
          ) : null}
          <SCLAlertButton
            theme="success"
            onPress={this.hideAlert}
            textStyle={{ ...regularButtonFont }}
          >
            {buttonMessage.toUpperCase()}
          </SCLAlertButton>
        </SCLAlert>
      </ImageBackground>
    );
  }
}
/* eslint-enable global-require */
const styles = StyleSheet.create({
  loginInnerContainer: {
    flex: 1,
    padding: 20
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
  sclAlertTitle: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  sclAlertImage: { height: 90, width: '80%', marginBottom: 10 },


});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
