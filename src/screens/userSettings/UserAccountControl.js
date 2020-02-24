import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Alert, AsyncStorage, Dimensions, PickerIOS,
  Platform, TouchableOpacity, Animated, BackHandler, Image
} from 'react-native';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { List, ListItem, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import moment from 'moment';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import Dialog from 'react-native-dialog';
import GoogleFit from 'react-native-google-fit';
// import Picker from 'react-native-wheel-picker';
import TabBar from 'react-native-underline-tabbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import NetInfo from "@react-native-community/netinfo";
import {
  saveTouchIdInfo, isTouchIdEnabled, saveGoogleFitInfo, isGoogleFitEnabled
} from '../../repository/login/LoginRepository';
import { Switch } from '../../components/ui/SwitchComponent/SwitchComponent';
import {
  updateWeight, updateHeight, updateBmi, updateGender, updateDob, updateEmail, updateGoogleToken, updateUsername,
  updateUserSocialImage, updateFetchedUrl, resetState, updateGoalData
} from '../../store/actions/index';
import { updateCurrentFlow } from '../../store/actions/assessment';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { BASE_URL, headers } from '../../api/config/Config';
import { fontMaker, regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  uName: state.User.name,
  uHeight: state.User.height,
  uWeight: state.User.weight,
  uBmi: state.User.bmi,
  uDob: state.User.dob,
  uEmail: state.User.email,
  uGender: state.User.gender,
  uSocialImage: state.User.socialImage,
  fetchedUrl: state.User.fetchedURL,
});

const mapDispatchToProps = dispatch => ({
  updatedWeight: weight => dispatch(updateWeight(weight)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedBmi: bmi => dispatch(updateBmi(bmi)),
  updatedGender: gender => dispatch(updateGender(gender)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedGoogleToken: token => dispatch(updateGoogleToken(token)),
  updateUserEmail: email => dispatch(updateEmail(email)),
  updatedUserName: name => dispatch(updateUsername(name)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url)),
  updatedUserSocialImage: uri => dispatch(updateUserSocialImage(uri)),
  updatedCurrentFlow: flow => dispatch(updateCurrentFlow(flow)),
  storeGoalData: data => dispatch(updateGoalData(data)),
  ResetState: () => dispatch(resetState())
});

// const PickerItem = Picker.Item;
const PickerItemIOS = PickerIOS.Item;

const Tab = ({
  tab, page, onPressHandler, onTabLayout, styles
}) => {
  const { label, icon } = tab;
  const style = {
    width: Dimensions.get('window').width / 3,
    // marginHorizontal: Dimensions.get('window').width / 30,
    paddingVertical: 10,
  };
  const containerStyle = {
    alignSelf: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 3.5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // textAlign: 'center',
    backgroundColor: styles.backgroundColor,
    opacity: styles.opacity,
    transform: [{ scale: styles.opacity }],
  };
  const textStyle = {
    color: styles.textColor,
    fontWeight: 'normal',
    fontFamily: 'System',
    // textAlign: 'center',
    // alignSelf: 'center'
  };
  const iconStyle = {
    tintColor: styles.textColor,
    resizeMode: 'contain',
    width: 22,
    height: 22,
    marginLeft: 10,
  };
  return (
    <TouchableOpacity style={style} onPress={onPressHandler} onLayout={onTabLayout} key={page}>
      <Animated.View style={containerStyle}>
        <Animated.Text style={textStyle}>{label}</Animated.Text>
        {/* <Animated.Image style={iconStyle} source={icon} /> */}
      </Animated.View>
    </TouchableOpacity>
  );
};
export class UserAccountControl extends Component {
  _scrollX = new Animated.Value(0);
  // 6 is a quantity of tabs

  interpolators = Array.from({ length: 3 }, (_, i) => i).map(idx => ({
    scale: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    }),
    opacity: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    }),
    textColor: this._scrollX.interpolate({
      inputRange: [idx - 2, idx - 1, idx, idx + 1, idx + 2],
      outputRange: ['#2980b9', '#2980b9', '#fff', '#2980b9', '#2980b9'],
    }),
    backgroundColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['rgba(0,0,0,0.1)', '#2980b9', 'rgba(0,0,0,0.1)'],
      extrapolate: 'clamp',
    }),
  }));

  constructor(props) {
    super(props);
    const { uHeight, uWeight } = this.props;
    this.state = {
      gender: 'Female',
      dobText: '',
      udobDate: null,
      modalVisible: false,
      changeDataHeight: false,
      changeDataWeight: false,
      selectedHeight: uHeight === 0 ? 122 : uHeight,
      selectedWeight: uWeight === 0 ? 24 : uWeight,
      tempHeight: uHeight === 0 ? 122 : uHeight,
      tempWeight: uWeight === 0 ? 24 : uWeight,
      genderIndex: '',
      weightList: [],
      heightList: [],
      isRegister: false,
      hasEnabledGoogleFit: false,
      showSCLAlert: false,
    };
    const { weightList, heightList } = this.state;
    for (let i = 0; i < 300; i += 1) {
      heightList[i] = i + 1;
    }
    for (let i = 0; i < 634; i += 1) {
      weightList[i] = i + 1;
    }
  }

  componentWillMount() {
    const { uGender } = this.props;
    this.setState({ genderIndex: this.condition(uGender) });
  }

  componentDidMount() {
    const { navigation } = this.props;
    isTouchIdEnabled().then((isTouch) => {
      this.setState({ isRegister: isTouch });
    });
    isGoogleFitEnabled().then((isGoogleFit) => {
      this.setState({ hasEnabledGoogleFit: isGoogleFit });
    });
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ] // what API you want to access on behalf of the user, default is email and profile
    });
    this.backHandle = this.backHandle.bind(this);
    this.didFocusSubscription = navigation.addListener('didFocus', () => BackHandler.addEventListener('hardwareBackPress', this.backHandle));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onPickerSelect(index, selectedChoice) {
    if (selectedChoice === 'height') {
      this.setState({ tempHeight: index });
    } else {
      this.setState({ tempWeight: index });
    }
  }

  backHandle = () => {
    const { navigation } = this.props;
    navigation.pop(1);
    return true;
  }

  signOut = async () => {
    const { updatedDob } = this.props;
    updatedDob(null);
    try {
      GoogleFit.disconnect();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('UserSocialImage');
      await AsyncStorage.setItem('enableGoogleFit', 'false');
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
    } catch (error) {
      Toast.show({
        text: 'Error Occured..!!',
        duration: 2000,
        type: 'default'
      });
    }
    if (AccessToken.getCurrentAccessToken()) {
      await LoginManager.logOut();
    }
  };

  showAlert = () => {
    Alert.alert(
      'Account Deactivated',
      'Your account will be deleted within 50 days. You can login within this period with your credentials.',
      [
        {
          text: 'Ok',
          onPress: () => {
            this.logout();
          }
        },
      ],
      { cancelable: false }
    );
  }

  deleteAccount = () => {
    const { uName } = this.props;
    Alert.alert(
      'Delete Account',
      'Do you want to delete your Account?',
      [
        {
          text: 'NO',
          onPress: () => { },
          style: 'cancel'
        },
        {
          text: 'YES',
          onPress: () => {
            AsyncStorage.removeItem('enableTouchId');
            AsyncStorage.removeItem('enableGoogleFit');
            fetch(`${BASE_URL}/api/updateUserStatus`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ name: uName })
            }).then(() => {
              this.showAlert();
            }).catch((err) => { console.log('Network Error', err); });
          }
        },
      ],
      { cancelable: false }
    );
  }

  logoutAccount = () => {
    Alert.alert(
      'Logout',
      'Do you want to Logout?',
      [
        {
          text: 'NO',
          onPress: () => { },
          style: 'cancel'
        },
        {
          text: 'YES',
          onPress: () => {
            this.logout();
          }
        },
      ],
      { cancelable: false }
    );
  }

  setToken = async (info) => {
    const { updatedGoogleToken, updateUserEmail, navigation } = this.props;
    const user = {};
    AsyncStorage.setItem('googleToken', info.accessToken);
    updatedGoogleToken(info.accessToken);
    updateUserEmail(info.user.email);
    const isSignedIn = GoogleSignin.isSignedIn();
    if (isSignedIn) {
      user.enableGoogleFit = 'true';
      await saveGoogleFitInfo(user);
      AsyncStorage.setItem('enableGoogleFit', 'true');
      this.setState({ hasEnabledGoogleFit: true });
      // navigation.navigate('UserWellnessAssessmentRouteUserProfile'); // VitalsRouteVitals
      Toast.show({
        text: 'Google-Fit Successfully enabled',
        duration: 2000,
        type: 'default'
      });
    }
  }

  updateUserEmail = async (info) => {
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
      AsyncStorage.setItem('enableGoogleFit', 'false');
      user.enableGoogleFit = 'false';
      await saveGoogleFitInfo(user);
      if (GoogleSignin.isSignedIn()) {
        GoogleSignin.signOut();
      }
      Toast.show({
        text: 'User cannot be linked to two different email. Please login with valid credentials..!!',
        duration: 2000,
        type: 'danger'
      });
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
            style={styles.authModeContainerSwitch}
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
            style={styles.authModeContainerSwitch}
          />
        )}
    </View>
  );

  onAddItem = async (selectedChoice) => {
    const {
      uName, updatedHeight, updatedBmi, updatedWeight, uHeight, uWeight
    } = this.props;
    const {
      tempHeight, tempWeight, heightList, weightList
    } = this.state;
    const heightCondition = selectedChoice === 'height' ? heightList[tempHeight] : uHeight;
    const weightCondition = selectedChoice === 'weight' ? weightList[tempWeight] : uWeight;
    const selectedHeightCondition = selectedChoice === 'height' ? tempHeight : uHeight === 0 ? 122 : uHeight;
    const selectedWeightCondition = selectedChoice === 'weight' ? tempWeight : uWeight === 0 ? 24 : uWeight;
    try {
      const res = await fetch(`${BASE_URL}/api/userData`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: uName,
          height: heightCondition,
          weight: weightCondition,
        })
      }).then(response => response.json());

      selectedChoice === 'height' ? updatedHeight(heightList[tempHeight]) : null;
      selectedChoice === 'weight' ? updatedWeight(weightList[tempWeight]) : null;
      this.setState({
        selectedHeight: selectedHeightCondition,
        selectedWeight: selectedWeightCondition,
        userBmi: CalculateBmi(heightCondition, weightCondition)
      }, () => {
        updatedBmi(CalculateBmi(heightCondition, weightCondition));
        Toast.show({
          text: 'Data Updated..!!',
          duration: 2000,
          type: 'default'
        });
        this.toggleChangeDataModal(selectedChoice);
      });
    }
    catch (err) {
      // alert(err.message)
      this.setState({ showSCLAlert: true })
      //test
      Toast.show({
        text: err.message,
        duration: 2000,
        type: 'danger'
      });
      this.toggleChangeDataModal(selectedChoice);
    }
  }

  logout = async () => {
    const { navigation, ResetState, storeGoalData } = this.props;
    try {
      await ResetState();
    } catch (error) {
      Toast.show({
        text: 'Error Occured..!!',
        duration: 2000,
        type: 'default'
      });
    }
    storeGoalData([]);
    this.signOut();
    const { updatedCurrentFlow } = this.props;
    navigation.navigate('RegisterRouteStartPage');
    updatedCurrentFlow('NEW');
  }

  condition = (responseJson) => {
    if (responseJson === 'Male') {
      return 0;
    }
    if (responseJson === 'Female') {
      return 1;
    }
    if (responseJson === 'Others') {
      return 2;
    }
    return 1;
  }

  onDOBPress = async () => {
    const { udobDate } = this.state;
    const { uDob } = this.props;
    let dobDate = udobDate;
    if (uDob && uDob !== '') {
      dobDate = new Date(uDob);
    }

    if (!dobDate || dobDate === null) {
      dobDate = new Date(moment().year() - 12, 0, 0);
      this.setState({ udobDate: dobDate });
    }
    // To open the dialog
    // this.refs.dobDailog.open({
    this.dobDialog.open({
      mode: 'spinner',
      date: dobDate,
      maxDate: new Date(moment().year() - 12, 0, 0, 0), // To restirct future date,
      minDate: new Date(moment().year() - 99, 0, 0, 0) // To restrict past date to 100 year
    });
  }

  onDOBDatePicked = async (date) => {
    const { uName, updatedDob } = this.props;
    await this.setState({
      dobDate: date,
      dobText: moment(date).format('MM-DD-YYYY')
    });
    await updatedDob(date);
    await fetch(`${BASE_URL}/api/user/updateUserDob`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        dob: moment(date).format('MM-DD-YYYY')
      })
    }).then((response) => { response.json(); })
      // .then(await this.setState({
      //   dobDate: date,
      //   dobText: moment(date).format('MM-DD-YYYY')
      // }))
      .catch((err) => { console.log('Network Error', err); });
    Toast.show({
      text: 'Data Updated..!!',
      duration: 2000,
      type: 'default'
    });
  }

  onSelect = (index, value) => {
    this.setState({
      gender: value,
      genderIndex: index
    });
  }

  toggleModal = async () => {
    await this.setState(prevState => ({
      modalVisible: !prevState.modalVisible,
      genderIndex: prevState.genderIndex
    }));
  }


  toggleChangeDataModal = async (selectedChoice, reverse = null) => {
    const { selectedWeight, selectedHeight } = this.state;
    this.setState({ tempHeight: selectedHeight, tempWeight: selectedWeight });

    if (selectedChoice === 'height') {
      this.setState(prevState => ({ changeDataHeight: !prevState.changeDataHeight }));
    } else {
      this.setState(prevState => ({ changeDataWeight: !prevState.changeDataWeight }));
    }
    setTimeout(() => {
      if (reverse) {
        this.setPrevData(selectedChoice);
      }
    }, 100);
  }

  setPrevData = (selectedChoice) => {
    const { selectedHeight, selectedWeight } = this.state;
    if (selectedChoice === 'height') {
      this.setState({ tempHeight: selectedHeight });
    } else {
      this.setState({ tempWeight: selectedWeight });
    }
  }

  submitGender = async () => {
    const { gender } = this.state;
    const { uName, updatedGender } = this.props;
    this.toggleModal();
    updatedGender(gender);
    await fetch(`${BASE_URL}/api/user/updateUserGender`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        gender
      })
    }).then((response) => {
      response.json();
    }).catch((err) => { console.log('Network Error', err); });
    Toast.show({
      text: 'Data Updated..!!',
      duration: 2000,
      type: 'default'
    });
  }


  pageSelect = (index, navPage) => {
    const { uDob, navigation } = this.props;
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        this.setState({ showSCLAlert: true });
      }
      else {
        if (index < 2) {
          this.authModeSelectionSection(index);
        } else if (index === 2) {

          this.toggleModal();
        } else if (index === 3) {
          this.toggleChangeDataModal('height');
        } else if (index === 4) {
          this.toggleChangeDataModal('weight');
        } else if (index === 5) {
          this.onDOBPress();

          // if (uDob) {
          //   if (uDob === '') {
          //     this.onDOBPress();
          //   }
          // } else { this.onDOBPress(); }
        } else if (index === 7) {
          this.deleteAccount();
        } else if (index === 8) {
          this.logoutAccount();
        } else {
          navigation.navigate(navPage);
        }
      }
    })
  }

  rightSectionView = (i) => {
    let rightSection = null;
    if (i < 2) {
      rightSection = this.authModeSelectionSection(i);
    } else if (i > 3 && i < 6) {
      rightSection = <Icon name="angle-right" size={20} color="grey" />;
    } else {
      rightSection = <Icon name="angle-right" size={20} color="grey" />;
    }
    return rightSection;
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
  }

  addItem = (item) => () => {
    const { tempHeight, selectedHeight, tempWeight, selectedWeight } = this.state;
    item === 'height' ?
      tempHeight !== selectedHeight ? this.onAddItem('height') : Toast.show({
        text: 'Select Height',
        duration: 2000,
        type: 'default'
      })
      :
      tempWeight !== selectedWeight ? this.onAddItem('weight') : Toast.show({
        text: 'Select Weight',
        duration: 2000,
        type: 'default'
      });
  }

  Page1 = () => {
    const list = [
      { name: 'Enable Touch Id', func: this.authModeSelectionSection(0), icon: 'fingerprint' },
      { name: 'Enable Google Fit', func: this.authModeSelectionSection(1), icon: 'google-fit' },
    ];
    return (
      <View tabLabel={{ label: 'Privacy', icon: '' }}>
        <List>
          {list.map((Names, i) => (
            <ListItem key={Names.func} onPress={({ Name = Names.func }) => { this.pageSelect(i, Name); }}>
              <View style={styles.listContainer}>
                <View style={styles.listContainerView}
                >
                  {Platform.OS == "ios" && Names.icon === 'google-fit' ?
                    <Image style={styles.listContainerViewImage} source={require('../../assets/logo/googlefitlogo1.png')} />
                    : <Icons name={Names.icon} size={20} color="grey" />}
                </View>
                <View style={styles.listItemView}>
                  <Text style={styles.listText}>{Names.name}</Text>
                </View>
                <View style={styles.authModeSelectionSectionView}
                >
                  {this.authModeSelectionSection(i)}
                </View>
              </View>
            </ListItem>
          ))}
        </List>
      </View>
    );
  };

  Page2 = () => {
    const { uGender, uDob, uHeight, uWeight } = this.props;
    const list = [
      { name: 'Set Gender', func: '', icon: 'odnoklassniki', label: uGender === '' || uGender === null ? '' : uGender },
      { name: 'Set Height', func: '', icon: 'arrows-v', label: uHeight === 0 || !Number.isFinite(uHeight) ? '' : (`${uHeight} cm`) },
      { name: 'Set Weight', func: '', icon: 'weight-kilogram', label: uWeight === 0 || !Number.isFinite(uWeight) ? '' : (`${uWeight} kg`) },
      { name: 'Set Date of Birth', func: '', icon: 'calendar', label: uDob ? moment(uDob).format('ll') : '' }];
    return (
      <View tabLabel={{ label: 'Personal', icon: '' }}>
        <List>
          {list.map((Names, i) => (
            <ListItem key={Names.func} onPress={({ Name = Names.func }) => { this.pageSelect(i + 2, Name); }}>
              <View style={styles.listContainer}>
                <View style={styles.listContainerView}
                >
                  {i === 2 ? <Icons name={Names.icon} size={20} color="grey" />
                    : <Icon name={Names.icon} size={20} color="grey" />}
                </View>
                <View style={styles.listItemView}>
                  <Text style={styles.listText}>{Names.name}</Text>
                </View>
                <View style={styles.listItemViewPage2}>
                  <Text style={styles.valueText}>{Names.label}</Text>
                </View>
                <View style={styles.authModeSelectionSectionView}
                >
                  <Icon name="angle-right" size={20} color="grey" />
                </View>
              </View>
            </ListItem>
          ))}
        </List>
      </View>
    );
  };

  Page3 = () => {
    const list = [
      { name: 'Change Passcode', func: 'UserWellnessAssessmentRouteChangePasscode', icon: 'key' },
      { name: 'Delete Account', func: this.deleteAccount, icon: 'user-times' },
      { name: 'Logout', func: this.logout, icon: 'sign-out' }];
    return (
      <View tabLabel={{ label: 'Account', icon: '' }}>
        <List>
          {list.map((Names, i) => (
            <ListItem key={Names.func} onPress={({ Name = Names.func }) => { this.pageSelect(i + 6, Name); }}>
              <View style={styles.listContainer}>
                <View style={styles.listContainerView}
                >
                  <Icon name={Names.icon} size={20} color="grey" />
                </View>
                <View style={styles.listItemView}>
                  <Text style={styles.listText}>{Names.name}</Text>
                </View>
                <View style={styles.authModeSelectionSectionView}
                >
                  <Icon name="angle-right" size={20} color="grey" />
                </View>
              </View>
            </ListItem>
          ))}
        </List>
      </View>
    );
  };

  render() {
    const {
      modalVisible, genderIndex, changeDataHeight, changeDataWeight,
      weightList, heightList, tempHeight, tempWeight, selectedHeight, selectedWeight
    } = this.state;
    return (
      <View style={styles.container}>
        <SCLAlert
          theme="danger"
          show={this.state.showSCLAlert}
          title='Network Error'
          subtitle='Please check your network'
          onRequestClose={this.handleClose}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyreact-native-scl-alertle={{ ...defaultModalFont }}
        >
          <SCLAlertButton
            theme="danger"
            onPress={this.handleClose}
            textStyle={{ ...regularButtonFont }}
          >
            CLOSE
          </SCLAlertButton>
        </SCLAlert>
        <Dialog.Container visible={modalVisible}>
          <Dialog.Title style={styles.dialogTitle}>
            {'Select Gender'}
          </Dialog.Title>
          <RadioGroup selectedIndex={genderIndex} style={styles.radioGroup} color="black" onSelect={(index1, value) => this.onSelect(index1, value)}>

            <RadioButton value="Male" color="black">
              <Text style={styles.radioButton}>Male</Text>
            </RadioButton>


            <RadioButton value="Female" color="black">
              <Text style={styles.radioButton}>Female</Text>
            </RadioButton>


            <RadioButton value="Others" color="black">
              <Text style={styles.radioButton}>Others</Text>
            </RadioButton>

          </RadioGroup>

          <Dialog.Button style={styles.dialogButton} label="Cancel" onPress={this.toggleModal} />
          <Dialog.Button style={styles.dialogButton} label="Submit" onPress={this.submitGender} />
        </Dialog.Container>

        <Dialog.Container
          visible={changeDataHeight}
          style={styles.dialogContainerVisible}
          contentStyle={styles.dialogTitleVisible}
        >
          <Dialog.Title style={styles.dialogTitle1}>
            <Text style={styles.dialogTitleText}>
              {`Selected Height: ${tempHeight + 1}`}
            </Text>
            <Text style={styles.dialogTextCm}>
              {' cm'}
            </Text>
          </Dialog.Title>
          <View style={styles.dailogPickerStyle}>
            {Platform.OS === 'ios'
              ? (
                <PickerIOS
                  style={styles.dialogIos}
                  selectedValue={tempHeight}
                  itemStyle={styles.dialogItemStyle}
                  onValueChange={height => this.onPickerSelect(height, 'height')}
                >
                  {heightList.map((height, i) => (
                    <PickerItemIOS label={height.toString()} value={i} key={`number${height.toString()}`} />
                  ))}
                </PickerIOS>
              ) : (
                // <Picker
                //   style={styles.dialogPicker}
                //   selectedValue={tempHeight}
                //   itemStyle={styles.dialogItemStyle}
                //   onValueChange={height => this.onPickerSelect(height, 'height')}
                // >
                //   {heightList.map((height, i) => (
                //     <PickerItem label={height.toString()} value={i} key={`number${height.toString()}`} />
                //   ))}
                // </Picker>
                null
              )
            }
          </View>
          <Dialog.Button label="Cancel" style={styles.dialogButtonOkCancel} onPress={() => this.toggleChangeDataModal('height', true)} />
          <Dialog.Button
            label="OK"
            style={styles.dialogButtonOkCancel}
            onPress={this.addItem('height')}
          />
        </Dialog.Container>

        <Dialog.Container
          visible={changeDataWeight}
          style={styles.dialogContainer}
          contentStyle={styles.dialogContainerBackground}
        >
          <Dialog.Title style={styles.dialogTitle1}>
            <Text style={styles.dialogTitleText}>
              {`Selected Weight: ${tempWeight + 1}`}
            </Text>
            <Text style={styles.dialogTextKg}>
              {' kg'}
            </Text>
          </Dialog.Title>
          <View style={styles.dailogPickerStyle}>
            {Platform.OS === 'ios'
              ? (
                <PickerIOS
                  style={styles.dialogIos}
                  selectedValue={tempWeight}
                  itemStyle={styles.dialogItemStyle}
                  onValueChange={weight => this.onPickerSelect(weight, 'weight')}
                >
                  {weightList.map((weight, i) => (
                    <PickerItemIOS label={weight.toString()} value={i} key={`number${weight.toString()}`} />
                  ))}
                </PickerIOS>
              ) : (
                // <Picker
                //   style={styles.dialogPicker}
                //   selectedValue={tempWeight}
                //   itemStyle={styles.dialogItemStyle}
                //   onValueChange={weight => this.onPickerSelect(weight, 'weight')}
                // >
                //   {weightList.map((weight, i) => (
                //     <PickerItem label={weight.toString()} value={i} key={`number${weight.toString()}`} />
                //   ))}
                // </Picker>
                null
              )
            }
          </View>
          <Dialog.Button style={styles.dialogButtonOkCancel} label="Cancel" onPress={() => this.toggleChangeDataModal('weight', true)} />
          <Dialog.Button
            label="OK"
            style={styles.dialogButtonOkCancel}
            onPress={this.addItem('weight')}
          />
        </Dialog.Container>

        <ScrollableTabView
          // locked={true}
          renderTabBar={() => (
            <TabBar
              scrollContainerStyle={styles.tabBar}
              underlineColor="#2980b9"
              tabBarStyle={styles.tabBarStyle}
              renderTab={(tab, page, isTabActive, onPressHandler, onTabLayout) => (
                <Tab
                  key={page}
                  tab={tab}
                  page={page}
                  isTabActive={isTabActive}
                  onPressHandler={onPressHandler}
                  onTabLayout={onTabLayout}
                  styles={this.interpolators[page]}
                />
              )}
            />
          )}
          onScroll={x => this._scrollX.setValue(x)}
        >
          {this.Page2()}
          {this.Page1()}
          {this.Page3()}
        </ScrollableTabView>
        <DatePickerDialog ref={(foc) => { this.dobDialog = foc; }} onDatePicked={this.onDOBDatePicked} />
      </View>
    );
  }
}

// const menuItemFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const itemFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
// const valueFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  authModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  authModeContainerSwitch: { transform: [{ scaleX: 1 }, { scaleY: 1 }] },
  listContainer: { flexDirection: "row" },
  listContainerView: { flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'flex-start' },
  listContainerViewImage: { height: 20, width: 20, color: 'grey' },
  listItemView: { flex: 4, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'flex-start' },
  authModeSelectionSectionView: { flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'flex-end' },
  listItemViewPage2: { flex: 2, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center' },
  dialogContainer: { borderRadius: 50 },
  dialogContainerBackground: { backgroundColor: '#fff' },
  dialogTitle: { color: 'black', alignSelf: 'center' },
  radioGroup: { justifyContent: 'center', display: 'flex', flexDirection: 'row' },
  radioButton: { fontFamily: 'System', color: 'black', fontSize: 16 },
  dialogButton: { fontFamily: 'System' },
  dialogButtonOkCancel: { fontFamily: 'System', fontSize: 16 },
  dialogContainerVisible: { borderRadius: 50, flex: 1 },
  dialogTitleVisible: { backgroundColor: '#fff' },
  dialogTitle1: { alignSelf: 'center' },
  dialogTitleText: { fontFamily: 'System', fontSize: 20, fontWeight: 'normal', color: '#000' },
  dialogTextCm: { fontFamily: 'System', fontSize: 16, fontWeight: 'normal', color: '#000' },
  dialogTextKg: { fontFamily: 'System', fontSize: 16, fontWeight: 'normal', alignItems: 'flex-end', color: '#000' },
  dialogIos: { width: 100, height: 40 },
  dialogItemStyle: { fontFamily: 'System', color: 'black', fontSize: 26 },
  dialogPicker: { width: 100, height: 120 },
  tabBar: { width: Dimensions.get('window').width },
  tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#d2d2d2', borderTopWidth: 1 },
  authModeText: {
    color: 'black',
    fontWeight: 'bold',
    // marginRight: 10,
    // marginLeft: 10,
    margin: 10
  },
  dailogPickerStyle: {
    ...Platform.select({
      ios: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'flex-start'
      },
      android: {
        height: 130,
        alignItems: 'center',
        justifyContent: 'flex-start'
      }
    }),
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    width: 130,
    marginRight: 75,
    marginLeft: 75,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  logoutContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    borderBottomColor: 'grey',
    borderTopColor: 'grey',
    borderWidth: 1
  },

  imageFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  list: { flexDirection: 'row' },
  listText: {
    fontFamily: 'System',
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    ...itemFontStyle
  },
  valueText: {
    fontFamily: 'System',
    fontSize: 14,
    textAlign: 'center',
    color: '#757575',
    ...itemFontStyle
  },
  image: {
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: 150,
    borderRadius: 75
  },
  imagesrc: {
    height: 150,
    width: 150,
    borderRadius: 75
  },
  userName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  touchID: {
    flex: 3,
    justifyContent: 'flex-start'
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  modal: {
    paddingVertical: 200,
    width: 320,
    alignSelf: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAccountControl);
