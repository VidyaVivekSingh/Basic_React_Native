import React, { Component } from 'react';
import {
  AsyncStorage, Platform, View, StyleSheet, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import { saveLoginInfo } from '../../repository/login/LoginRepository';
import { BASE_URL, headers } from '../../api/config/Config';
import {
  updateUsername, updateDob, updateHeight, updateWeight
} from '../../store/actions/index';
import { updateCurrentFlow } from '../../store/actions/assessment';
import { regularButtonFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
  email: state.User.email,
  dob: state.User.dob,
  gender: state.User.gender,
  inviteCode: state.User.inviteCode,
  currentFlow: state.Assessment.currentFlow,
  assessmentId: state.Assessment.assessmentId,
  tempHeight: state.User.tempheight,
  tempWeight: state.User.tempweight,
  tempDob: state.User.tempDob,
  image: state.User.socialImage
});
const mapDispatchToProps = dispatch => ({
  updateName: name => dispatch(updateUsername(name)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedWeight: weight => dispatch(updateWeight(weight)),
  updateUserCurrentFlow: flow => dispatch(updateCurrentFlow(flow))
});
class Passcode extends Component {
  state = {
    codeOne: '',
    codeTwo: '',
    codeThree: '',
    codeFour: '',
    codeFive: '',
    codeSix: '',
    codeSeven: '',
    codeEight: '',
    buttonDisable: true,
    userToken: null
  }

  // goToNextTextInput = (text, node, focusPoint) => {
  //   switch (node) {
  //     case 'One': this.setState({ codeOne: text });
  //       if (text !== '') {
  //         this.setState({ codeTwo: '' });
  //       }
  //       break;
  //     case 'Two': this.setState({ codeTwo: text });
  //       if (text !== '') {
  //         this.setState({ codeThree: '' });
  //       }
  //       break;
  //     case 'Three': this.setState({ codeThree: text });
  //       if (text !== '') {
  //         this.setState({ codeFour: '' });
  //       }
  //       break;
  //     case 'Four': this.setState({ codeFour: text });
  //       break;
  //     case 'Five': this.setState({ codeFive: text });
  //       if (text !== '') {
  //         this.setState({ codeSix: '' });
  //       }
  //       break;
  //     case 'Six': this.setState({ codeSix: text });
  //       if (text !== '') {
  //         this.setState({ codeSeven: '' });
  //       }
  //       break;
  //     case 'Seven': this.setState({ codeSeven: text });
  //       if (text !== '') {
  //         this.setState({ codeEight: '' });
  //       }
  //       break;
  //     case 'Eight': this.setState({ codeEight: text });
  //       break;
  //     default:
  //       break;
  //   }
  //   if (text !== '') {
  //     focusPoint.focus();
  //   }
  // }

  buttonDisable = () => {
    setTimeout(() => {
      if (this.state.codeOne !== '' && this.state.codeTwo !== '' && this.state.codeThree !== ''
        && this.state.codeFour !== '' && this.state.codeFive !== '' && this.state.codeSix !== ''
        && this.state.codeSeven !== '' && this.state.codeEight !== '') {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  // map answers to user
  mapAnswerToUser = () => {
    const { assessmentId, name, dob } = this.props;
    const obj = {
      id: assessmentId,
      userName: name,
      dob: dob ? moment(dob).format('MM-DD-YYYY') : null
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

  submitPasscode = (props) => () => {
    this.setState({ buttonDisable: true });
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight
    } = this.state;
    const {
      name, mobile, email, tempDob, tempHeight, tempWeight, inviteCode,
      showAlert, updateName, currentFlow, updatedDob, updatedHeight, updatedWeight
    } = this.props;
    const passcodeOne = codeOne + codeTwo + codeThree + codeFour;
    const passcodeTwo = codeFive + codeSix + codeSeven + codeEight;
    const passRegex = /^(?!.*(.).*\1)\d{4}$/;
    let InviteCode = inviteCode;
    if (InviteCode !== '') {
      InviteCode = inviteCode.trim();
    }
    if(!passRegex.test(passcodeOne)||!passRegex.test(passcodeTwo)){
      showAlert('Oops!', 'Passcode must not contain same digits', 'danger', 'Close');
    }
    else if (passcodeOne === passcodeTwo) {
      fetch(`${BASE_URL}/api/user`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          mobile,
          email: email === '' ? `demo${name}` : email,
          passcode: passcodeOne,
          dob: tempDob !== '' && tempDob ? moment(tempDob).format('MM-DD-YYYY') : null,
          height: tempHeight,
          weight: tempWeight,
          inviteCode: InviteCode,
          userCreatedDate: moment().format('LL')
        })
      }).then(response => response.json())
        .then((responseJson) => {
          if (responseJson.code === 11000) {
            showAlert('Oops!', 'User already registered in ZUL system', 'danger', 'Close');
          }
          if (responseJson.status === 'Invalid invite code') {
            showAlert('Oops!', 'Enter valid Invite code', 'danger', 'Close');
          } else {
            updateName(responseJson.name);
            updatedDob(responseJson.dob);
            updatedHeight(responseJson.height);
            updatedWeight(responseJson.weight);
            if (currentFlow === 'UNREGISTERED') {
              this.mapAnswerToUser();
            }
            this.setState({ userToken: responseJson.token });
            const userinfo = {};
            userinfo.reportsNavigation = props.reportsNavigation;
            userinfo.loginNavigation = props.loginNavigation;
            userinfo.currentFlow = props.currentFlow;
            userinfo.passcode = passcodeOne;
            userinfo.name = name;
            userinfo.identityProvider = 'ZUL';
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
    } else {
      showAlert('Oops!', 'Passcode not matched!!!', 'danger', 'Close');
    }
  }

  completeRegisteration = async (userinfo) => {
    // TODO: remove the hotfix for a sustainable solution
    const { showAlert, name } = this.props;
    const { userToken } = this.state;
    fetch(`${BASE_URL}/api/createUserVital`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userName: name })
    }).then(response => response.json())
      .then(() => {
        // console.log(responseJson);
      }).catch((err) => { console.log('Network Error', err); });
    AsyncStorage.setItem('enableTouchId', userinfo.enableTouchId); // hotfix #1164
    saveLoginInfo(userinfo);
    showAlert('Congratulations!', 'You are now a Zinger!\nYour wellness journey begins.', 'success', 'Let\'s Go', userToken);
  }

  onChangeInput = (location, refLocation, text) => {
    const prop = `code${location}`;
    const ref = `r${refLocation}`;
    if (text !== '') {
      if (!Number.isNaN(text)) {
        this.setState({ [prop]: text });

        this[ref].focus();
        this.buttonDisable();
      } else {
        this.setState({ [prop]: '' });
      }
    }
    else {
      this.setState({ [prop]: '' });
    }
  }

  generateR1 = (foc) => { this.rOne = foc };
  generateR2 = (foc) => { this.rTwo = foc };
  generateR3 = (foc) => { this.rThree = foc };
  generateR4 = (foc) => { this.rFour = foc };
  generateR5 = (foc) => { this.rFive = foc };
  generateR6 = (foc) => { this.rSix = foc };
  generateR7 = (foc) => { this.rSeven = foc };
  generateR8 = (foc) => { this.rEight = foc };


  render() {
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight, buttonDisable
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Passcode:
        </Text>
        <View style={styles.rowDirection}>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR1}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeOne}
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
              keyboardType="numeric"
              value={codeTwo}
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Two', 'Three')}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR3}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeThree}
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
              keyboardType="numeric"
              value={codeFour}
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Four', 'Five')}
            />
          </View>
        </View>
        <Text style={styles.reEnterLabel}
        >
          Re-enter Passcode:
        </Text>
        <View style={styles.rowDirection}>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR5}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeFive}
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Five', 'Six')}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR6}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeSix}
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Six', 'Seven')}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR7}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeSeven}
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Seven', 'Eight')}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={this.generateR8}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeEight}
              style={styles.input}
              maxLength={1}
              onChangeText={this.onChangeInput.bind(this, 'Eight', 'Eight')}
            />
          </View>
        </View>
        <TouchableOpacity
          style={buttonDisable ? styles.disableBtn : styles.zulBtn}
          disabled={buttonDisable}
          onPress={this.submitPasscode(this.props)}
        >
          <Text style={styles.whiteText}>{"Let's Go".toUpperCase()}</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Passcode);
const styles = StyleSheet.create({
  container: { marginTop: 60 },
  loginLogo: {
    height: 150,
    width: 150
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
  disableBtn: {
    backgroundColor: '#99b294',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
  blackText: { color: '#000' },
  alertContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555555',
    fontWeight: '300'
  },
  label: {
    marginLeft: 5, color: '#000', fontSize: 20, marginBottom: 10
  },
  rowDirection: { flexDirection: "row" },
  flexOne: { flex: 1 },
  reEnterLabel: {
    marginLeft: 5, color: '#000', marginTop: 20, fontSize: 20, marginBottom: 10
  },


});
