import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, TextInput, TouchableOpacity, Keyboard
} from 'react-native';
import { Text, Toast } from 'native-base';
import { connect } from 'react-redux';
import { BASE_URL, headers } from '../../../api/config/Config';
import { regularButtonFont } from '../../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
  currentFlow: state.Assessment.currentFlow
});
class ForgotPasscode extends Component {
  state = {
    codeOne: '',
    codeTwo: '',
    codeThree: '',
    codeFour: '',
    codeFive: '',
    codeSix: '',
    codeSeven: '',
    codeEight: '',
    buttonDisable: true
  }

  goToNextTextInput = (text, node, focusPoint) => {
    const ob = {};
    ob[`code${node}`] = text;
    this.setState(ob);
    switch (node) {
      case 'One':
        if (text !== '') {
          this.setState({ codeTwo: '' });
        }
        break;
      case 'Two':
        if (text !== '') {
          this.setState({ codeThree: '' });
        }
        break;
      case 'Three':
        if (text !== '') {
          this.setState({ codeFour: '' });
        }
        break;
      case 'Four':
        break;
      case 'Five':
        if (text !== '') {
          this.setState({ codeSix: '' });
        }
        break;
      case 'Six':
        if (text !== '') {
          this.setState({ codeSeven: '' });
        }
        break;
      case 'Seven':
        if (text !== '') {
          this.setState({ codeEight: '' });
        }
        break;
      case 'Eight':
        break;
      default:
        break;
    }
    if (text !== '') {
      focusPoint.focus();
    }
  }

  disableButton = () => {
    setTimeout(() => {
      if (this.state.codeOne !== '' && this.state.codeTwo !== '' && this.state.codeThree !== '' && this.state.codeFour !== '' && this.state.codeFive !== '' && this.state.codeSix !== '' && this.state.codeSeven !== '' && this.state.codeEight !== '') {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  submitPasscode = (props) => () => {
    Keyboard.dismiss();
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight
    } = this.state;
    const { mobile } = this.props;
    const passcodeOne = codeOne + codeTwo + codeThree + codeFour;
    const passcodeTwo = codeFive + codeSix + codeSeven + codeEight;
    const passRegex = /^(?!.*(.).*\1)\d{4}$/;

    if (!passRegex.test(passcodeTwo) || !passRegex.test(passcodeOne)) {      
      Platform.OS === 'ios'
          ? Toast.show({
            text: 'Passcode must not contain same digits',
            duration: 2000,
            type: 'default',
            position: 'top'
          })
          : Toast.show({
            text: 'Passcode must not contain same digits',
            duration: 2000,
            type: 'default'
          });
    }
    else if (passcodeOne === passcodeTwo) {
      fetch(`${BASE_URL}/api/passcode`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mobile,
          passcode: passcodeOne
        })
      }).then((response) => {
        response.json();
        Platform.OS === 'ios'
          ? Toast.show({
            text: 'Passcode changed successfully..!!',
            duration: 2000,
            type: 'default',
            position: 'top'
          })
          : Toast.show({
            text: 'Passcode changed successfully..!!',
            duration: 2000,
            type: 'default'
          });
        setTimeout(() => {
          props.goToLogin();
        }, 2000);
      })
        .catch(() => {
          Platform.OS === 'ios'
            ? Toast.show({
              text: 'Passcode has not changed..!!',
              duration: 2000,
              type: 'default',
              position: 'top'
            })
            : Toast.show({
              text: 'Passcode has not changed..!!',
              duration: 2000,
              type: 'default'
            });
        });
    } else {
      Platform.OS === 'ios'
        ? Toast.show({
          text: 'Passcode not matched..!!',
          duration: 2000,
          type: 'default',
          position: 'top'
        })
        : Toast.show({
          text: 'Passcode not matched..!!',
          duration: 2000,
          type: 'default'
        });
    }
  }

  render() {
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight, buttonDisable
    } = this.state;
    return (
      <View>
        <Text style={styles.label}
        >
          New Passcode:
        </Text>
        <View style={styles.rowFlexDirection}>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r1 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeOne}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'One', this.r2); this.disableButton(); } else { this.setState({ codeOne: '' }); }
              }}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r2 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeTwo}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Two', this.r3); this.disableButton(); } else { this.setState({ codeTwo: '' }); }
              }}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r3 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeThree}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Three', this.r4); this.disableButton(); } else { this.setState({ codeThree: '' }); }
              }}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r4 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeFour}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Four', this.r4); this.disableButton(); } else { this.setState({ codeFour: '' }); }
              }}
            />
          </View>
        </View>
        <Text style={styles.label}
        >
          Confirm New Passcode:
        </Text>
        <View style={styles.rowFlexDirection}>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r5 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeFive}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Five', this.r6); this.disableButton(); } else { this.setState({ codeFive: '' }); }
              }}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r6 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeSix}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Six', this.r7); this.disableButton(); } else { this.setState({ codeSix: '' }); }
              }}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r7 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeSeven}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Seven', this.r8); this.disableButton(); } else { this.setState({ codeSeven: '' }); }
              }}
            />
          </View>
          <View style={styles.flexOne}>
            <TextInput
              ref={(foc) => { this.r8 = foc; }}
              underlineColorAndroid="#000"
              secureTextEntry
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={codeEight}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Eight', this.r8); this.disableButton(); } else { this.setState({ codeEight: '' }); }
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={buttonDisable ? styles.disableBtn : styles.zulBtn}
          disabled={buttonDisable}
          onPress={this.submitPasscode(this.props)}
        >
          <Text style={styles.whiteText}>{'Change Passcode'.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

    );
  }
}
export default connect(mapStateToProps, null)(ForgotPasscode);
const styles = StyleSheet.create({
  label: {
    fontFamily: 'System', marginLeft: 5, marginTop: 10, color: '#000', fontSize: 20
  },
  rowFlexDirection: { flexDirection: 'row' },
  flexOne: { flex: 1 },

  loginLogo: {
    height: 150,
    width: 150
  },
  input: {
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
  whiteText: { color: '#fff', ...regularButtonFont },
  blackText: { color: '#000' }
});
