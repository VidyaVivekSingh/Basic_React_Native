import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, Text, Alert, AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { List, ListItem, Toast } from 'native-base';
import {
  saveTouchIdInfo, isTouchIdEnabled, saveGoogleFitInfo, isGoogleFitEnabled
} from '../../repository/login/LoginRepository';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import { Switch } from '../../components/ui/SwitchComponent/SwitchComponent';
import { updateEmail, updateGoogleToken } from '../../store/actions/index';
import { BASE_URL, headers } from '../../api/config/Config';

const mapStateToProps = state => ({
  uEmail: state.User.email,
  uName: state.User.name
});
const mapDispatchToProps = dispatch => ({
  updatedGoogleToken: token => dispatch(updateGoogleToken(token)),
  updateUserEmail: email => dispatch(updateEmail(email))
});

export class PrivateSetting extends Component {
  state = {
    isRegister: false,
    hasEnabledGoogleFit: false
  };

  componentDidMount() {
    isTouchIdEnabled().then((isTouch) => {
      this.setState({ isRegister: isTouch });
    });
    isGoogleFitEnabled().then((isGoogleFit) => {
      this.setState({ hasEnabledGoogleFit: isGoogleFit });
    });
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.body.read',
        'https://www.googleapis.com/auth/fitness.location.read',
        'https://www.googleapis.com/auth/fitness.nutrition.read',
      ], // what API you want to access on behalf of the user, default is email and profile
    });
  }

  toastMessage = () => {
    Toast.show({
      text: 'This feature will be Available Soon..!!',
      duration: 2000,
      type: 'default'
    });
  }

  setToken = (info) => {
    const { updatedGoogleToken, updateUserEmail, navigation } = this.props;
    const user = {};
    AsyncStorage.setItem('googleToken', info.accessToken);
    updatedGoogleToken(info.accessToken);
    updateUserEmail(info.user.email);
    const isSignedIn = GoogleSignin.isSignedIn();
    if (isSignedIn) {
      user.enableGoogleFit = 'true';
      saveGoogleFitInfo(user);
      AsyncStorage.setItem('enableGoogleFit', 'true');
      this.setState({ hasEnabledGoogleFit: true });
      navigation.navigate('VitalsRouteVitals');
    }
  }

  updateUserEmail = (info) => {
    const { uName, uEmail } = this.props;
    const user = {};
    if (uEmail === '' || !uEmail) {
      fetch(`${BASE_URL}/api/user/updateUserEmail`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: uName,
          email: info.user.email
        })
      }).then(response => response.json())
        .then((responseJson) => {
          if (responseJson.hasOwnProperty.call(responseJson, 'error')) {
            if (GoogleSignin.isSignedIn()) {
              GoogleSignin.signOut();
            }
            Toast.show({
              text: responseJson.error,
              duration: 2000,
              type: 'default'
            });
          } else if (responseJson.hasOwnProperty.call(responseJson, 'status')) {
            Toast.show({
              text: responseJson.status,
              duration: 2000,
              type: 'default'
            });
            this.setToken(info);
          }
        }).catch((err) => { console.log('Network Error', err); });
    } else if (uEmail === info.user.email) {
      this.setToken(info);
    } else {
      Toast.show({
        text: 'User cannot be linked to two different email. Please login with valid credentials..!!',
        duration: 2000,
        type: 'danger'
      });
      AsyncStorage.setItem('enableGoogleFit', 'false');
      user.enableGoogleFit = 'false';
      saveGoogleFitInfo(user);
      if (GoogleSignin.isSignedIn()) {
        GoogleSignin.signOut();
      }
    }
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.updateUserEmail(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          text: 'Sign In cancelled by User..!!',
          duration: 2000,
          type: 'default'
        });
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
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
    }
  };

  changeAuthMode = () => {
    const { isRegister } = this.state;
    const userinfo = {};
    if (!isRegister) {
      Alert.alert(
        'Enable Touch Id',
        'Do you want to enable touch id?',
        [
          {
            text: 'NO',
            onPress: () => {
              userinfo.enableTouchId = 'false';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: false });
            },
            style: 'cancel'
          },
          {
            text: 'YES',
            onPress: () => {
              userinfo.enableTouchId = 'true';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: true });
            }
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        'Disable Touch Id',
        'Do you want to disable touch id?',
        [
          {
            text: 'NO',
            onPress: () => {
              userinfo.enableTouchId = 'true';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: true });
            },
            style: 'cancel'
          },
          {
            text: 'YES',
            onPress: () => {
              userinfo.enableTouchId = 'false';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: false });
            }
          },
        ],
        { cancelable: false }
      );
    }
  }

  enableGoogleFit = () => {
    const { hasEnabledGoogleFit } = this.state;
    const userinfo = {};
    if (!hasEnabledGoogleFit) {
      Alert.alert(
        'Enable Google Fit',
        'Do you want to enable Google Fit?',
        [
          {
            text: 'NO',
            onPress: () => {
              userinfo.enableGoogleFit = 'false';
              saveGoogleFitInfo(userinfo);
              this.setState({ hasEnabledGoogleFit: false });
            },
            style: 'cancel'
          },
          {
            text: 'YES',
            onPress: async () => {
              this.signIn();
            }
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        'Disable Google Fit',
        'Do you want to disable Google Fit?',
        [
          {
            text: 'NO',
            onPress: () => {
              userinfo.enableGoogleFit = 'true';
              saveGoogleFitInfo(userinfo);
              this.setState({ hasEnabledGoogleFit: true });
            },
            style: 'cancel'
          },
          {
            text: 'YES',
            onPress: async () => {
              userinfo.enableGoogleFit = 'false';
              const isSignedIn = await GoogleSignin.isSignedIn();
              if (isSignedIn) {
                await GoogleSignin.signOut();
                saveGoogleFitInfo(userinfo);
                this.setState({ hasEnabledGoogleFit: false });
              }
            }
          },
        ],
        { cancelable: false }
      );
    }
  }

  customTintColor = (i) => {
    let tintColor;
    const { isRegister, hasEnabledGoogleFit } = this.state;
    if (i === 0) {
      if (isRegister) {
        tintColor = '#41ab3e';
      } else {
        tintColor = '#cccccc';
      }
    } else if (hasEnabledGoogleFit) {
      tintColor = '#4b7aa5';
    } else {
      tintColor = '#cccccc';
    }
    return tintColor;
  }

  authModeSelectionSection = i => (
    <View style={styles.authModeContainer}>
      {(Platform.OS === 'ios')
        ? (
          <Switch
            onValueChange={i === 0 ? this.changeAuthMode : this.enableGoogleFit}
            thumbTintColor={this.customTintColor(i)}
            backgroundActive="#41ab3e"
            backgroundInactive="gray"
            circleActiveColor="white"
            circleInActiveColor="white"
            value={i === 0 ? this.state.isRegister : this.state.hasEnabledGoogleFit}
            style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
          />
        )
        : (
          <Switch
            onValueChange={i === 0 ? this.changeAuthMode : this.enableGoogleFit}
            thumbTintColor={this.customTintColor(i)}
            backgroundActive="#41ab3e"
            backgroundInactive="gray"
            circleActiveColor="white"
            circleInActiveColor="white"
            value={i === 0 ? this.state.isRegister : this.state.hasEnabledGoogleFit}
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
          />
        )}
    </View>
  );


  render() {
    const list = [
      { name: 'Enable Touch Id' },
      { name: 'Enable Google Fit' },
    ];

    return (
      <View style={styles.container}>
        <List>
          {list.map((Names, i) => (
            <ListItem key={Names.name}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{
                  flex: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'flex-start'
                }}
                >
                  <Text style={styles.listText}>{Names.name}</Text>
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }} />
                <View style={{
                  flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'flex-end'
                }}
                >
                  {this.authModeSelectionSection(i)}
                </View>
              </View>
            </ListItem>
          ))}
        </List>
      </View>
    );
  }
}

const itemFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  authModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  authModeText: {
    color: 'black',
    fontWeight: 'bold',
    margin: 10,
  },
  list: { flexDirection: 'row' },
  listText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    ...itemFontStyle
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PrivateSetting);
