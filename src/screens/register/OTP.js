import React, {Component} from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Text,
} from 'react-native';
// import {Text} from 'native-base';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
//import SmsListener from 'react-native-android-sms-listener';
// import {BASE_URL, headers} from '../../api/config/Config';
import {regularButtonFont} from '../../store/styles/fonts/FontMaker';
// import generate from '@babel/generator';

const mapStateToProps = state => ({});
class OTP extends Component {
  state = {
    digitOne: '',
    digitTwo: '',
    digitThree: '',
    digitFour: '',
    buttonDisable: true,
    displaySendOTP: false,
    reqOTP: '0000',
  };

  curFocInput = 1;

  // subscription = SmsListener.addListener(async (message) => { // sms listner subscription to insted chech
  //   const verificationCodeRegex = /ZingUpLife is: ([\d]{4})/;
  //   if (verificationCodeRegex.test(message.body)) {
  //     const Code = message.body.match(verificationCodeRegex)[1];
  //     await this.setState({
  //       digitOne: Code[0],
  //       digitTwo: Code[1],
  //       digitThree: Code[2],
  //       digitFour: Code[3],
  //       buttonDisable: false
  //     });
  //   }
  //   setTimeout(() => {
  //     this.submitOTP(this.props);
  //   }, 1000);
  // });

  componentDidMount() {
    // if (Platform.OS === 'android') {
    //   this.requestReadSmsPermission();
    // }
    // this.sendOTP();
    setTimeout(() => {
      this.setState({displaySendOTP: true});
    }, 10000);
  }

  componentWillUnmount() {
    // const subscription = SmsListener.addListener(() => {
    //   subscription.remove();
    // });
  }

  autoFillOtp = () => {
    const {verificationCode} = this.state;
    this.setState({
      digitOne: verificationCode[0],
      digitTwo: verificationCode[1],
      digitThree: verificationCode[2],
      digitFour: verificationCode[3],
    });
  };

  sendOTP = () => {
    const {mobile} = this.props;
    fetch(`${BASE_URL}/api/otp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({mobile}),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({reqOTP: responseJson.resOtp});
      })
      .catch(err => {
        console.log('Network Error', err);
      });
  };

  // goToNextTextInput = (text, node, focusPoint) => {
  //   switch (node) {
  //     case 'One': this.setState({ digitOne: text });
  //       if (text !== '') {
  //         this.setState({ digitTwo: '' });
  //       }
  //       break;
  //     case 'Two': this.setState({ digitTwo: text });
  //       if (text !== '') {
  //         this.setState({ digitThree: '' });
  //       }
  //       break;
  //     case 'Three': this.setState({ digitThree: text });
  //       if (text !== '') {
  //         this.setState({ digitFour: '' });
  //       }
  //       break;
  //     case 'Four': this.setState({ digitFour: text });
  //       break;
  //     default:
  //       break;
  //   }
  //   if (text !== '') {
  //     focusPoint.focus();
  //   }
  // }

  ButtonDisable = () => {
    setTimeout(() => {
      if (
        this.state.digitOne !== '' &&
        this.state.digitTwo !== '' &&
        this.state.digitThree !== '' &&
        this.state.digitFour !== ''
      ) {
        this.setState({buttonDisable: false});
      } else {
        this.setState({buttonDisable: true});
      }
    }, 300);
  };

  submitOTP = props => () => {
    this.setState({buttonDisable: true});
    const {digitOne, digitTwo, digitThree, digitFour, reqOTP} = this.state;
    const {showAlert} = this.props;
    const inputOTP = digitOne + digitTwo + digitThree + digitFour;
    if (reqOTP === inputOTP) {
      props.nextHandler();
    } else {
      showAlert('Oops!', 'Please enter valid OTP', 'danger', 'Close');
    }
  };

  // requestReadSmsPermission = async () => {
  //   try {
  //     let granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_SMS,
  //       {
  //         title: 'Auto Verification OTP',
  //         message: 'Need access to read sms, to Verify OTP',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('sms read permissions granted', granted);
  //       granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
  //           title: 'Receive SMS',
  //           message: 'Need access to receive sms, to Verify OTP'
  //         }
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('RECEIVE_SMS permissions granted', granted);
  //       } else {
  //         console.log('RECEIVE_SMS permissions denied');
  //       }
  //     } else {
  //       console.log('Sms read permissions denied');
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  onChange = (text, position, ref) => {
    let data = 'digit' + position;
    if (!Number.isNaN(text)) {
      this.goToNextTextInput(text, position, ref);
      this.ButtonDisable();
    } else {
      this.setState({[data]: ''});
    }
  };

  onChangeInput = (location, refLocation, text) => {
    const prop = `digit${location}`;
    const ref = `r${refLocation}`;
    if (text !== '') {
      if (!Number.isNaN(text)) {
        this.setState({[prop]: text});

        this[ref].focus();
        this.ButtonDisable();
      } else {
        this.setState({[prop]: ''});
      }
    } else {
      this.setState({[prop]: ''});
    }
  };

  generateR1 = foc => {
    this.rOne = foc;
  };
  generateR2 = foc => {
    this.rTwo = foc;
  };
  generateR3 = foc => {
    this.rThree = foc;
  };
  generateR4 = foc => {
    this.rFour = foc;
  };

  render() {
    const {
      digitOne,
      digitTwo,
      digitThree,
      digitFour,
      displaySendOTP,
      buttonDisable,
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>One time password(OTP)</Text>
        <View style={styles.rowDirection}>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR1}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              value={digitOne}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'One', 'Two')}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR2}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              value={digitTwo}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              //onChangeText={this.onChangeInput}
              blurOnSubmit={false}
              onChangeText={this.onChangeInput.bind(this, 'Two', 'Three')}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR3}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              value={digitThree}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Three', 'Four')}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR4}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              value={digitFour}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Four', 'Four')}
            />
          </View>
        </View>
        <TouchableOpacity onPress={this.sendOTP}>
          {displaySendOTP ? (
            <View style={styles.resendOtpContainer}>
              <Icon name="repeat" style={styles.resendOtpIcon} size={10} />
              <Text style={styles.resendOtpText}>Resend OTP</Text>
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonDisable ? styles.disableBtn : styles.zulBtn}
          disabled={buttonDisable}
          onPress={this.submitOTP(this.props)}>
          <Text style={styles.whiteText}>{'Submit OTP'.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {marginTop: 60},
  loginLogo: {
    height: 150,
    width: 150,
  },
  input: {
    fontFamily: 'System',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: '#000',
    ...Platform.select({
      ios: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
      },
    }),
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 40,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
    ...regularButtonFont,
  },
  disableBtn: {
    backgroundColor: '#99b294',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 40,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
    ...regularButtonFont,
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont,
  },
  blackText: {
    color: '#000',
    ...regularButtonFont,
  },
  label: {
    fontFamily: 'System',
    marginLeft: 5,
    color: '#000',
    fontSize: 20,
    marginBottom: 10,
  },
  rowDirection: {flexDirection: 'row'},
  flexOne: {flex: 1},
  resendOtpContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  resendOtpIcon: {
    fontSize: 13,
    color: '#000',
    marginVertical: 19,
    ...regularButtonFont,
  },
  resendOtpText: {
    marginLeft: 3,
    marginVertical: 10,
    padding: 5,
    textAlign: 'center',
    color: '#000',
    ...regularButtonFont,
    flexDirection: 'column',
  },
});

export default connect(mapStateToProps)(OTP);
