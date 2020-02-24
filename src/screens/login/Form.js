import React, { Component } from 'react';
import {
  Alert, Platform, View, StyleSheet, TouchableOpacity, Text, Image, AsyncStorage,
  NetInfo
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { Toast } from 'native-base';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import TouchComponent from '../../components/ui/biometric/TouchId';
import FloatingLabel from '../../components/ui/floatingLabel/floatingLabel';
import {
  updateUsername, updateMobile, updateEmail, updateOtp, updateGender,
  updateDob, updateUserSocialImage, updateFetchedUrl, updateAcceptance
} from '../../store/actions/index';
import { updateCurrentFlow } from '../../store/actions/assessment';
import { BASE_URL, headers } from '../../api/config/Config';
import GetFacebookInfoService from '../../api/fblogin/fbLoginService';
import {
  saveLoginInfo, getIdentityProvider, isTouchIdEnabled, getLoggedInUserName,
  getLoggedInPassCode, saveIdentityProviderInfo,
} from '../../repository/login/LoginRepository';
import { defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';
import { updateGoogleToken } from '../../store/actions/users';
import uploadImageHandler from '../../components/utility/userImage/GetUserImage';

const mapStateToProps = state => ({
  passcode: state.User.passcode,
  uName: state.User.name,
  uEmail: state.User.email,
  uLoginType: state.User.loginType,
  uSocialImage: state.User.socialImage,
  currentFlow: state.Assessment.currentFlow,
  assessmentId: state.Assessment.assessmentId,
  dob: state.User.dob,
  tempHeight: state.User.tempheight,
  tempWeight: state.User.tempweight,
  tempDob: state.User.tempDob,
});
const mapDispatchToProps = dispatch => ({
  updateName: name => dispatch(updateUsername(name)),
  updateUserMobile: mobile => dispatch(updateMobile(mobile)),
  updatedGender: gender => dispatch(updateGender(gender)),
  updatedAcceptance: acceptance => dispatch(updateAcceptance(acceptance)),
  updateUserOtp: mobile => dispatch(updateOtp(mobile)),
  updateUserGender: gender => dispatch(updateGender(gender)),
  updateUserCurrentFlow: flow => dispatch(updateCurrentFlow(flow)),
  updateSocialImage: image => dispatch(updateUserSocialImage(image)),
  updateUserDob: dob => dispatch(updateDob(dob)),
  updatedGoogleToken: token => dispatch(updateGoogleToken(token)),
  updateUserEmail: email => dispatch(updateEmail(email)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url))
});

export class Form extends Component {
  constructor(props) {
    super(props);
    const { uLoginType } = this.props;
    this.state = {
      uName: '',
      loginUser: uLoginType === 'User',
      uPasscode: '',
      touchIdName: '',
      touchIdPasscode: '',
      isTouchIdEnabledState: false,
      showAlert: false,
      alertMessage: '',
      userPasscodeWrongCount: 0,
    };
  }

  componentDidMount() {
    isTouchIdEnabled().then((value) => {
      this.setState({ isTouchIdEnabledState: value });
    });
    getLoggedInUserName().then((userName) => {
      this.setState({ touchIdName: userName });
    });
    getLoggedInPassCode().then((userPasscode) => {
      this.setState({ touchIdPasscode: userPasscode });
    });
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ], // what API you want to access on behalf of the user, default is email and profile
    });

    const isSignedIn = GoogleSignin.isSignedIn();
    if (isSignedIn) {
      GoogleSignin.signOut();
    }
    if (AccessToken.getCurrentAccessToken()) {
      LoginManager.logOut();
    }
  }

  componentWillUnmount() {

  }

  showAlertMessage = (message) => {
    this.setState(prevState => ({
      alertMessage: message,
      showAlert: !prevState.showAlert
    }));
  }

  toggleAlert = () => {
    this.setState(prevState => ({ showAlert: !prevState.showAlert }));
  }

  handleClose = () => {
    this.setState(prevState => ({ showAlert: !prevState.showAlert }));
  }

  // upload user image to cloudinary

  update = (imageDetails) => {
    const { uName, updatedFetchedUrl } = this.props;
    fetch(`${BASE_URL}/api/user/updateUserImageDetails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        userImageURL: imageDetails.secure_url,
        imageID: imageDetails.public_id,
        uploadDate: imageDetails.created_at
      })
    }).then(response => response.json())
      .then(() => {
        updatedFetchedUrl(imageDetails.secure_url);
      }).catch((err) => { console.log('Network Error', err); });
  }


  // login user
  loginUser = async () => {
    const { uName, uPasscode } = this.state;
    const {
      goHome, updateName, updateUserDob, updateSocialImage, updateUserCurrentFlow, updatedGender,
      updatedFetchedUrl, currentFlow, updateUserEmail, updatedAcceptance, updateUserMobile
    } = this.props;
    const hasTouchIdEnabled = await AsyncStorage.getItem('enableTouchId');
    const hasGoogleFitEnabled = await AsyncStorage.getItem('enableGoogleFit');
    if (currentFlow !== 'UNREGISTERED') {
      if (this.canLoginUser()) {
        fetch(`${BASE_URL}/api/getpasscode`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: uName,
            passcode: uPasscode
          })
        }).then(response => response.json())
          .then((responseJson) => {
            if (responseJson) {
              if (responseJson.status === 'verify') {
                const token = responseJson.token;
                AsyncStorage.setItem('userToken', token);
                updateName(uName);
                updatedAcceptance(responseJson.acceptance);
                updateUserDob(responseJson.result.dob);
                updateSocialImage('');
                updateUserMobile(responseJson.result.mobile);
                updatedGender(responseJson.result.gender ? responseJson.result.gender : null);
                updatedFetchedUrl(responseJson.result.image.userImageURL);
                updateUserEmail(responseJson.result.email);
                updateUserCurrentFlow('REGISTERED');
                const userinfo = {
                  name: uName,
                  passcode: uPasscode,
                  enableTouchId: hasTouchIdEnabled === 'true' ? 'true' : 'false',
                  identityProvider: 'ZUL',
                  enableGoogleFit: hasGoogleFitEnabled === 'true' ? 'true' : 'false'
                };
                saveLoginInfo(userinfo);
                if (responseJson.userStatus === 'Inactive') {
                  Alert.alert(
                    'Welcome Back',
                    'We Greet you to come back',
                    [
                      {
                        text: 'Ok',
                        onPress: () => {
                          goHome();
                        }
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  goHome();
                }
              } else if (responseJson.status === '401') {
                this.checkForUserWrongPasscode();
              } else if (responseJson.status !== 'verify') {
                this.showAlertMessage('username/passcode do not match');
              }
            }
          })
          .catch(() => {
            NetInfo.isConnected.fetch().done((isConnected) => {
              if (!isConnected) {
                if (Platform.OS === 'android') {
                  Toast.show({
                    text: 'No Internet connection..!!',
                    duration: 2000,
                    type: 'danger',
                    position: 'bottom'
                  });
                }
              }
            });
          });
      }
    } else {
      Toast.show({
        text: 'User already registered..!!',
        duration: 2000,
        type: 'default'
      });
    }
  }

  // 
  checkForUserWrongPasscode = () => {
    const { userPasscodeWrongCount } = this.state;
    if (userPasscodeWrongCount < 3) {
      this.setState({ userPasscodeWrongCount: userPasscodeWrongCount + 1 })
      this.showAlertMessage(`username/passcode do not match. (Tries left: ${3 - userPasscodeWrongCount})`);
    }
    else {
      this.showAlertMessage('Your Account is locked for 30 minutes. Please try again later');
    }
  }
  // login user

  initUser = async () => {
    await AccessToken.getCurrentAccessToken().then((data) => {
      const { accessToken } = data;
      const { updateName, updateUserEmail, updateSocialImage } = this.props;
      GetFacebookInfoService.fetchFacebookInfo(accessToken)
        .then(async (json) => {
          await (
            updateName(json.email.split('@')[0].trim()),
            updateSocialImage(json.picture.data.url),
            updateUserEmail(json.email),
            AsyncStorage.setItem('UserSocialImage', json.picture.data.url)
          );
          saveIdentityProviderInfo('FB');
          this.checkUserByEmail('FB');
        })
        .catch(() => {
          Toast.show({
            text: 'Sign In cancelled by User..!!',
            duration: 2000,
            type: 'default'
          });
        });
    });
  }

  fbSignIN = async () => {
    await LoginManager.logInWithPermissions([
      'email',
      'public_profile',
    ]).then(
      result => {
        if (result.isCancelled) {
          Toast.show({
            text: 'Sign In cancelled by User',
            duration: 2000,
            type: 'default',
          });
        } else {
          console.log('Login Successful', result);
        }
      },
      error => {
        console.log(`An error occured${error}`);
      },
    );
    await this.initUser();
  }

  canLoginUser = () => {
    const { uName, uPasscode } = this.state;
    let canLogin = false;
    if (uName && uPasscode === '') {
      this.showAlertMessage('Please enter passcode');
    } else if (uPasscode && uName === '') {
      this.showAlertMessage('Please enter username');
    } else if (uName === '' && uPasscode === '') {
      this.showAlertMessage('Please enter username & passcode');
    } else {
      canLogin = true;
    }
    return canLogin;
  }

  signIn = async () => {
    const {
      updateName, updateUserEmail, updateSocialImage, updatedGoogleToken
    } = this.props;
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      AsyncStorage.setItem('googleToken', userInfo.accessToken);
      updatedGoogleToken(userInfo.accessToken);

      await (
        updateName(userInfo.user.email.split('@')[0].trim()),
        updateSocialImage(userInfo.user.photo ? userInfo.user.photo : ''),
        updateUserEmail(userInfo.user.email)
      );
      userInfo.user.photo ? AsyncStorage.setItem('UserSocialImage', userInfo.user.photo) : null;
      this.checkUserByEmail('Google');
      saveIdentityProviderInfo('Google');
    } catch (error) {
      console.log("error", error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Toast.show({
        //   text: 'Sign In cancelled by User..!!',
        //   duration: 2000,
        //   type: 'default'
        // });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          text: 'operation (f.e. sign in) is already in progress..!!',
          duration: 2000,
          type: 'default'
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          text: 'Play services not available or outdated..!!',
          duration: 2000,
          type: 'default'
        });
      } else {
        Toast.show({
          text: 'Some other error happened..!!',
          duration: 2000,
          type: 'default'
        });
      }
      await AsyncStorage.removeItem('UserSocialImage');
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
    }
  };

  checkUserByEmail = (medium) => {
    const {
      goHome, updateName, updateUserDob, updatedFetchedUrl, updateUserCurrentFlow, uEmail, currentFlow, updatedAcceptance
    } = this.props;
    fetch(`${BASE_URL}/api/getemail`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: uEmail })
    }).then(response => response.json())
      .then(async (responseJson) => {
        if (responseJson) {
          if (responseJson.status === 'verify') {
            const token = responseJson.token;
            AsyncStorage.setItem('userToken', token);
            if (responseJson.result.email === uEmail) {
              if (currentFlow !== 'UNREGISTERED') {
                await (
                  updateName(responseJson.result.name),
                  updateUserDob(responseJson.result.dob),
                  updatedAcceptance(responseJson.acceptance),
                  updatedFetchedUrl(responseJson.result.image.userImageURL),
                  updateUserCurrentFlow('REGISTERED')
                );
                if (responseJson.userStatus === 'Inactive') {
                  Alert.alert(
                    'Welcome Back',
                    'We Greet you to come back',
                    [
                      {
                        text: 'Ok',
                        onPress: () => {
                          goHome();
                        }
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  goHome();
                }
              } else {
                this.registerSocialUser(medium);
              }
            }
          } else {
            this.registerSocialUser(medium);
          }
        }
      })
      .catch(async () => {
        this.registerSocialUser(medium);
      });
  }

  // Touch id
  registerSocialUser = async (medium) => {
    const {
      uName, uEmail, updateName, updateUserMobile, updateUserEmail, updateUserOtp, updateUserGender, updateUserDob, updatedAcceptance
    } = this.props;
    fetch(`${BASE_URL}/api/registrationValidation`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uEmail.split('@')[0].trim(),
        inviteCode: ''
      })
    }).then(response => response.json())
      .then(async (responseJson) => {
        if (responseJson.hasOwnProperty.call(responseJson, 'status')) {
          await (
            updateName(uName),
            updateUserMobile(''),
            updateUserEmail(uEmail),
            updateUserOtp(''),
            updateUserGender(''),
            updateUserDob(''),
            updatedAcceptance(false)
          );
          await this.submitPasscode(medium);
        } else if (responseJson.hasOwnProperty.call(responseJson, 'err')) {
          if (await GoogleSignin.isSignedIn()) { await GoogleSignin.signOut(); }
          if (AccessToken.getCurrentAccessToken()) {
            await LoginManager.logOut();
          }
          await (
            AsyncStorage.removeItem('userToken'),
            AsyncStorage.removeItem('googleToken'),
            AsyncStorage.removeItem('UserSocialImage')
          );
          Toast.show({
            text: responseJson.err,
            duration: 2000,
            type: 'default'
          });
        }
      })
      .catch((err) => { console.log('Network Error', err); });
  }

  // map answers to user
  mapAnswerToUser = () => {
    const { assessmentId, uName, tempDob } = this.props;
    const obj = {
      id: assessmentId,
      userName: uName,
      dob: tempDob ? moment(tempDob).format('MM-DD-YYYY') : null
    };
    fetch(`${BASE_URL}/api/mapAnswerToUser`, {
      method: 'POST',
      headers,
      body: JSON.stringify(obj)
    }).then(response => response.json())
      .then((responseJson) => {
        console.log('User Mapped to Wholesomeness Assessment', responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  submitPasscode = (medium) => {
    const {
      uName, uEmail, currentFlow, reportsNavigation, tempDob, tempHeight, tempWeight,
    } = this.props;
    fetch(`${BASE_URL}/api/user`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uEmail.split('@')[0].trim(),
        email: uEmail,
        passcode: '',
        gender: '',
        dob: tempDob !== '' && tempDob ? moment(tempDob).format('MM-DD-YYYY') : null,
        height: tempHeight,
        weight: tempWeight,
        inviteCode: '',
        userCreatedDate: moment().format('LL'),
        image: {
          userImageURL: '',
          imageID: '',
          uploadDate: ''
        }
      })
    }).then(response => response.json())
      .then((responseJson) => {
        if (responseJson.code === 11000) {
          this.showAlertMessage('User already registered in ZUL system');
        } else if (responseJson.status === 'Invalid invite code') {
          this.showAlertMessage('Enter valid Invite code');
        } else {
          if (currentFlow === 'UNREGISTERED') {
            this.mapAnswerToUser();
          }
          const userinfo = {};
          userinfo.reportsNavigation = reportsNavigation;
          userinfo.name = uName;
          userinfo.passcode = '';
          userinfo.currentFlow = currentFlow;
          userinfo.identityProvider = medium;
          userinfo.enableGoogleFit = 'false';
          Alert.alert(
            'Enable Touch Id',
            'Do you want to enable touch id?',
            [
              {
                text: 'NO',
                onPress: () => {
                  userinfo.enableTouchId = 'false';
                  this.completeRegisteration(userinfo);
                },
                style: 'cancel'
              },
              {
                text: 'YES',
                onPress: () => {
                  userinfo.enableTouchId = 'true';
                  this.completeRegisteration(userinfo);
                }
              },
            ],
            { cancelable: false }
          );
        }
      }).catch((err) => { console.log('Network Error', err); });
  }

  completeRegisteration = async (userinfo) => {
    // TODO: remove the hotfix for a sustainable solution
    const {
      showAlert, uSocialImage, uName, uEmail
    } = this.props;
    fetch(`${BASE_URL}/api/createUserVital`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userName: uName })
    }).then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      }).catch((err) => { console.log('Network Error', err); });
    if (uEmail.includes('gmail')) {
      AsyncStorage.setItem('enableGoogleFit', 'true');
    }
    AsyncStorage.setItem('enableTouchId', userinfo.enableTouchId); // hotfix #1164
    saveLoginInfo(userinfo);
    uSocialImage === '' || !uSocialImage ? null : await uploadImageHandler(uSocialImage, this.update, uName);
    showAlert('Congratulations!', 'You are now a Zinger!\nYour wellness journey begins.');
  }

  touchId = () => {
    const { touchIdName, touchIdPasscode } = this.state;
    const {
      goHome, updateName, updateSocialImage, updatedGender,
      updateUserCurrentFlow, updateUserDob
    } = this.props;

    getIdentityProvider().then((provider) => {
      switch (provider) {
        case 'Google':
          this.signIn();
          break;
        case 'FB':
          this.fbSignIN();
          break;
        default:
          setTimeout(() => {
            fetch(`${BASE_URL}/api/getpasscode`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                name: touchIdName,
                passcode: touchIdPasscode
              })
            }).then(response => response.json())
              .then((responseJson) => {
                if (responseJson) {
                  AsyncStorage.setItem('userToken', responseJson.token);
                  updateName(touchIdName);
                  updateUserDob(responseJson.result.dob);
                  updatedGender(responseJson.result.gender ? responseJson.result.gender : null);
                  updateSocialImage('');
                  updateUserCurrentFlow('REGISTERED');
                  goHome();
                }
              })
              .catch(() => {
                NetInfo.isConnected.fetch().done((isConnected) => {
                  if (!isConnected) {
                    if (Platform.OS === 'android') {
                      Toast.show({
                        text: 'No Internet connection..!!',
                        duration: 2000,
                        type: 'danger',
                        position: 'bottom'
                      });
                    }
                  }
                });
                // this.showAlertMessage('Touch Id error. Please login with your credentials');
              });
          }, 200);
          break;
      }
    });
  }

  render() {
    const {
      uPasscode, showAlert, alertMessage, isTouchIdEnabledState, loginUser
    } = this.state;
    const { goForgotPassword, goRegister } = this.props;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        enableOnAndroid
        style={styles.container}
      >
        <SCLAlert
          theme="danger"
          show={showAlert}
          title="Oops!"
          subtitle={alertMessage}
          cancellable
          onRequestClose={this.toggleAlert}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton
            theme="danger"
            onPress={this.toggleAlert}
            textStyle={{ ...regularButtonFont }}
          >
            CLOSE
          </SCLAlertButton>
        </SCLAlert>

        <View style={styles.loginActionView}>
          {/* eslint-disable global-require */}
          <Image style={styles.loginLogo} source={require('../../assets/images/onboard/zulNew.png')} />
          {/* eslint-enable global-require */}
        </View>
        <View style={styles.loginInput}>

          <FloatingLabel
            underlineColorAndroid="#000"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            onChangeText={text => this.setState({ uName: text })}
            accessible
            accessibilityLabel="Username"
            accessibilityHint="Provide Username"
          >
            <Text>
              <Icon1 name="user" size={22} color="#41ab3e" />
              {'   Username'}
            </Text>

          </FloatingLabel>
          <FloatingLabel
            underlineColorAndroid="#000"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            secureTextEntry
            keyboardType="numeric"
            // value={uPasscode}
            style={styles.customStyle}
            maxLength={4}
            onChangeText={async (text) => { await this.setState({ uPasscode: text.replace(/[^0-9]/g, '') }); }}
            accessible
            accessibilityLabel="Passcode"
            accessibilityHint="Provide Passcode"
          >
            <Text>
              <Icon2 name="key" size={22} color="#41ab3e" />
              {'   Passcode'}
            </Text>
          </FloatingLabel>
          {isTouchIdEnabledState
            ? (
              <View style={styles.buttonViewContainer}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.logInBtnwithTouchId} onPress={this.loginUser}>
                    <Text style={styles.whiteText}>{'Login'.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.touchID}>
                  <TouchComponent
                    goHome={this.touchId}
                    askByDefault={isTouchIdEnabledState}
                    accessible
                    accessibilityLabel="Touch Id Authentication"
                    accessibilityHint="Access application by Touch Id"
                  />
                </View>
              </View>
            )
            : (
              <View style={styles.buttonViewContainer}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.logInBtn} onPress={this.loginUser}>
                    <Text style={styles.whiteText}>{'Login'.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          {loginUser ?
            <View>
              <View style={styles.flexRow}>
                <View style={styles.flexOne}>

                  <TouchableOpacity style={styles.forgotBtn} onPress={goForgotPassword}>
                    <Text style={[
                      {
                        fontFamily: 'System', color: '#000', fontWeight: 'bold', fontSize: 16
                      }, styles.underlineStyle]}
                    >
                      Forgot passcode?
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.signupStyle}>
                  <TouchableOpacity style={styles.registerBtn} onPress={goRegister}>
                    <Text style={[
                      {
                        fontFamily: 'System', color: '#000', fontWeight: 'bold', fontSize: 16
                      }, styles.underlineStyle]}
                    >
                      New Here? Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.textViewContainer}
              >
                <Text style={styles.textContainer}
                >
                  OR
                </Text>
              </View>

              <View style={styles.buttonViewContainer}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.googleBtn} onPress={this.signIn}>
                    <Text style={styles.whiteText}>{'Login with google'.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.buttonViewContainer}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.facebookBtn} onPress={this.fbSignIN}>
                    <Text style={styles.whiteText}>{'Login with facebook'.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            : null
          }
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);

const styles = StyleSheet.create({
  touchIdStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  biometricStyle: {
    flexDirection: 'row',
    marginTop: 10
  },
  signupStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  underlineStyle: { textDecorationLine: 'underline' },
  flexOne: { flex: 1 },
  flexRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  inputBorder: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  loginInput: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    marginTop: 30
  },
  loginText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center'
  },
  loginActionView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgStyle: {
    width: 50,
    height: 45
  },
  container: {
    flex: 0.75,
    flexDirection: 'column'
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 20,
    color: '#fff'
  },
  loginLogo: {
    marginTop: 40,
    marginBottom: 20
  },
  touchID:
  {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1,
    borderColor: '#41ab3e',
    borderWidth: 2,
    alignSelf: 'center',
    height: 60,
    top: 10,
    borderRadius: 8
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
    borderRadius: 8
  },
  forgotBtn: {
    padding: 5,
    margin: 10
  },
  whiteText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'System',
    ...regularButtonFont,
  },
  registerBtn: {
    padding: 5,
    margin: 10
  },

  labelStyle: { fontFamily: 'System', color: '#000' },

  inputStyle: {
    fontFamily: 'System',
    height: 50,
    borderWidth: 0,
    color: '#000',
    ...Platform.select({
      ios: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
      }
    }),
  },
  buttonViewContainer: { flexDirection: 'row', marginLeft: 40, marginRight: 40 },
  buttonContainer: { flex: 3 },
  customStyle: {
    fontFamily: 'System',
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: 20,
    marginRight: 20
  },
  textViewContainer: {
    marginLeft: 30, marginRight: 30, marginTop: 10, alignItems: 'center'
  },
  textContainer: {
    fontSize: 20, fontWeight: 'bold', color: '#000', fontFamily: 'System'
  }
});
