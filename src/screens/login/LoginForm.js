import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';

import {changeCount} from '../../store/actions/count-action';
import {touchIDState} from '../../store/actions/app-action';
import {
  regularButtonFont,
  defaultModalFont,
} from '../../store/styles/fonts/FontMaker';
import FloatingLabel from '../../components/common/ui/floatingLabel/floatingLabel';
import GlobalStyles from '../../store/styles/GlobalStyle';
import TouchComponent from '../../components/common/ui/biometric/TouchId';

const mapStateToProps = state => ({
  count: state.counter.count,
  isTouchIdEnabled: state.app.touchIdState,
});

// const ActionCreators = Object.assign({}, changeCount);
const mapDispatchToProps = dispatch => ({
  // updateName: name => dispatch(updateUsername(name)),
  // actions: bindActionCreators(ActionCreators, dispatch),
  updateCounter: count => dispatch(changeCount(count)),
  updateTouchIDState: touchIdState => dispatch(touchIDState(touchIdState)),
});
class LoginForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      userPassCode: null,
      showAlert: false,
      alertMsj: null,
    };
  }
  decrementCount() {
    let {count, updateCounter} = this.props;
    count--;
    updateCounter(count);
  }
  incrementCount() {
    let {count, updateCounter} = this.props;
    count++;
    updateCounter(count);
  }

  toggleAlert() {
    console.log('toggleAlert');
  }

  fbSignIN() {
    console.log('fbSignIN');
  }

  signIn() {
    console.log('signIn');
  }

  goForgotPassword() {
    console.log('goForgotPassword');
  }

  loginUser() {
    const {navigation} = this.props;
    navigation.navigate('Register');
    // console.log('loginUser');
  }

  form = () => {
    const {count, navigation, isTouchIdEnabled} = this.props;
    const {alertMsj, showAlert, userName, userPassCode} = this.state;
    return (
      <ScrollView>
        <View style={GlobalStyles.container}>
          <View
            style={[
              GlobalStyles.flexOne,
              GlobalStyles.flexRow,
              GlobalStyles.centreAligned,
            ]}>
            <Image
              source={require('../../assets/Zula/zula-anim.gif')}
              style={styles.imgStyle}
            />
          </View>
          <View style={[GlobalStyles.flexOne]}>
            <FloatingLabel
              underlineColorAndroid="#000"
              labelStyle={styles.labelStyle}
              inputStyle={styles.inputStyle}
              style={styles.customStyle}
              onChangeText={text => this.setState({userName: text})}
              accessible
              accessibilityLabel="Username"
              accessibilityHint="Provide Username">
              <Text>
                <Icon1 name="user" size={22} color="#41ab3e" />
                {'   Username'}
              </Text>
            </FloatingLabel>
          </View>
          <View style={[GlobalStyles.flexOne]}>
            <FloatingLabel
              underlineColorAndroid="#000"
              labelStyle={styles.labelStyle}
              inputStyle={styles.inputStyle}
              secureTextEntry
              keyboardType="numeric"
              // value={uPasscode}
              style={styles.customStyle}
              maxLength={4}
              onChangeText={async text => {
                await this.setState({
                  userPassCode: text.replace(/[^0-9]/g, ''),
                });
              }}
              accessible
              accessibilityLabel="Passcode"
              accessibilityHint="Provide Passcode">
              <Text>
                <Icon2 name="key" size={22} color="#41ab3e" />
                {'   Passcode'}
              </Text>
            </FloatingLabel>
          </View>
          <View>
            <View style={styles.buttonViewContainer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.logInBtnwithTouchId}
                  onPress={() => this.loginUser()}>
                  <Text style={styles.whiteText}>{'Login'.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.touchID}>
                <TouchComponent
                  askByDefault={isTouchIdEnabled}
                  accessible
                  accessibilityLabel="Touch Id Authentication"
                  accessibilityHint="Access application by Touch Id"
                />
              </View>
            </View>
          </View>
          <View>
            <View style={styles.flexRow}>
              <View style={styles.flexOne}>
                <TouchableOpacity
                  style={styles.forgotBtn}
                  onPress={this.goForgotPassword}>
                  <Text
                    style={[
                      {
                        fontFamily: 'System',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: 16,
                      },
                      styles.underlineStyle,
                    ]}>
                    Forgot passcode?
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.signupStyle}>
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={this.toggleAlert}>
                  <Text
                    style={[
                      {
                        fontFamily: 'System',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: 16,
                      },
                      styles.underlineStyle,
                    ]}>
                    New Here? Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.textViewContainer}>
            <Text style={styles.textContainer}>OR</Text>
          </View>
          <View style={styles.buttonViewContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.googleBtn} onPress={this.signIn}>
                <Text style={styles.whiteText}>
                  {'Login with google'.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonViewContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.facebookBtn}
                onPress={this.fbSignIN}>
                <Text style={styles.whiteText}>
                  {'Login with facebook'.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  render() {
    return this.form();
  }
}
const styles = StyleSheet.create({
  imgStyle: {
    height: 150,
    width: 150,
  },
  labelStyle: {fontFamily: 'System', color: '#000'},

  inputStyle: {
    fontFamily: 'System',
    height: 50,
    borderWidth: 0,
    color: '#000',
    ...Platform.select({
      ios: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
      },
    }),
  },
  buttonViewContainer: {flexDirection: 'row', marginLeft: 40, marginRight: 40},
  buttonContainer: {flex: 3},
  customStyle: {
    fontFamily: 'System',
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  touchIdStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  biometricStyle: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  underlineStyle: {textDecorationLine: 'underline'},
  flexOne: {flex: 1},
  flexRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  inputBorder: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  loginInput: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
  },
  loginActionView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 0.75,
    flexDirection: 'column',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 20,
    color: '#fff',
  },
  loginLogo: {
    marginTop: 40,
    marginBottom: 20,
  },
  touchID: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1,
    borderColor: '#41ab3e',
    borderWidth: 2,
    alignSelf: 'center',
    height: 60,
    top: 10,
    borderRadius: 8,
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  logInBtnwithTouchId: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  googleBtn: {
    backgroundColor: '#db4a40',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  facebookBtn: {
    backgroundColor: '#49659c',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  forgotBtn: {
    padding: 5,
    margin: 10,
  },
  whiteText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'System',
    ...regularButtonFont,
  },
  registerBtn: {
    padding: 5,
    margin: 10,
  },

  textViewContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  textContainer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'System',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
