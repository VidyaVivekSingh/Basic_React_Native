import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, TextInput, Dimensions, Keyboard, TouchableOpacity, ImageBackground
} from 'react-native';
import { Text, Toast } from 'native-base';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { BASE_URL, headers } from '../../api/config/Config';
import { savePasscodeInfo } from '../../repository/login/LoginRepository';
import { fontMaker, regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';

const windowDimensions = Dimensions.get('window');

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
  currentFlow: state.Assessment.currentFlow
});

export class Passcode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyValues: {
        codeOne: '',
        codeTwo: '',
        codeThree: '',
        codeFour: '',
        codeFive: '',
        codeSix: '',
        codeSeven: '',
        codeEight: '',
        codeNine: '',
        codeTen: '',
        codeEleven: '',
        codeTwelve: '',
      },
      buttonDisable: true,
      showSCLAlert: false,
      alertTitle: '',
      alertSubtitle: '',      
    }
    this.baseState = this.state.keyValues
  }

  curFocInput = 1;

  setDataAndUpdateState = (curFocInputVal, text, firstProp, secondProp) => {
    const { keyValues } = this.state;
    if (!Number.isNaN(text)) {
      keyValues[firstProp] = text;
      if (text !== '' && secondProp !== '' && this.curFocInput !== 4 && this.curFocInput !== 8) {
        keyValues[secondProp] = '';
      }
      this.curFocInput = curFocInputVal;

      if (this.curFocInput > 0 && this.curFocInput !== 4 && this.curFocInput !== 8 && this.curFocInput < 12 && text !== '') {
        this.curFocInput += 1;
      }
      this.refs[this.curFocInput].focus();
    } else {
      keyValues[firstProp] = '';
    }
    this.setState({ keyValues });
    this.buttonDisable();
  }

  isEmptyString = str => str === '';


  buttonDisable = () => {
    const { keyValues } = this.state;
    setTimeout(() => {
      const hasEmpty = Object.values(keyValues)
        .slice(4, 12)
        .some(this.isEmptyString);
      if (!hasEmpty) {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  handleOpen = (title, subtitle) => {
    this.setState({ showSCLAlert: true, alertTitle: title, alertSubtitle: subtitle });
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false, alertTitle: '', alertSubtitle: '' });
  }


  submitPasscode = () => {
    Keyboard.dismiss();
    const { keyValues } = this.state;
    const passcodeOne = keyValues.codeOne + keyValues.codeTwo
      + keyValues.codeThree + keyValues.codeFour;
    const passcodeTwo = keyValues.codeFive + keyValues.codeSix
      + keyValues.codeSeven + keyValues.codeEight;
    const passcodeThree = keyValues.codeNine + keyValues.codeTen
      + keyValues.codeEleven + keyValues.codeTwelve;

    const { name, navigation } = this.props;

    const passRegex = /^(?!.*(.).*\1)\d{4}$/;

    if (!passRegex.test(passcodeTwo) || !passRegex.test(passcodeThree)) {      
      this.setState({keyValues:this.baseState}, () => this.handleOpen('Oops', 'Passcode must not contain same digits'))
    }
    else if (passcodeThree === passcodeTwo) {
      fetch(`${BASE_URL}/api/changePasscode`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          uName: name,
          passcode: passcodeOne,
          newPasscode: passcodeTwo
        })
      }).then(response => response.json())
        .then((response) => {
          Platform.OS === 'ios'
            ? Toast.show({
              text: response.message,
              duration: 2000,
              type: 'default',
              position: 'top'
            })
            : Toast.show({
              text: response.message,
              duration: 2000,
              type: 'default'
            });
          setTimeout(() => {
            response.valid === 'true' ? navigation.navigate('UserWellnessAssessmentRouteUserAccountControls') : null;
          }, 2000);
          savePasscodeInfo(passcodeTwo);
        })
        .catch((err) => { console.log('Network Error', err); });
    } else {
      this.handleOpen('Oops', 'New Passcode and Confirm Passcode not matched!!!');
    }
  }

  generateInputs = (inputsData, startIndex) => inputsData.map((input, index) => {
    const { keyValues } = this.state;
    const value = keyValues[input.firstProp];
    return (
      <View style={styles.flexOne} key={input.firstProp}>
        <TextInput
          ref={startIndex + index + 1}
          underlineColorAndroid="#000"
          secureTextEntry
          placeholderTextColor="#000"
          keyboardType="numeric"
          value={value}
          style={styles.input}
          maxLength={1}
          onChangeText={
            (text) => {
              this.setDataAndUpdateState(startIndex + index + 1,
                text,
                input.firstProp,
                input.secondProp);
            }
          }
        />
      </View>
    );
  });

  render() {
    const { showSCLAlert, alertTitle, buttonDisable, alertSubtitle } = this.state;

    const inputsData = [
      { firstProp: 'codeOne', secondProp: 'codeTwo' },
      { firstProp: 'codeTwo', secondProp: 'codeThree' },
      { firstProp: 'codeThree', secondProp: 'codeFour' },
      { firstProp: 'codeFour', secondProp: 'codeFive' },
      { firstProp: 'codeFive', secondProp: 'codeSix' },
      { firstProp: 'codeSix', secondProp: 'codeSeven' },
      { firstProp: 'codeSeven', secondProp: 'codeEight' },
      { firstProp: 'codeEight', secondProp: 'codeNine' },
      { firstProp: 'codeNine', secondProp: 'codeTen' },
      { firstProp: 'codeTen', secondProp: 'codeEleven' },
      { firstProp: 'codeEleven', secondProp: 'codeTwelve' },
      { firstProp: 'codeTwelve', secondProp: '' }
    ];
    const inputsFirstRow = [...inputsData].slice(0, 4);
    const inputsSecondRow = [...inputsData].slice(4, 8);
    const inputsThirdRow = [...inputsData].slice(8, 12);

    return (
      <ImageBackground
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <SCLAlert
          theme="danger"
          show={showSCLAlert}
          title={alertTitle}
          subtitle={alertSubtitle}
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
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          enableOnAndroid
        >

          <View>
            <Text style={styles.label}
            >
              Current Passcode
            </Text>
            <Text style={styles.leaveBlankText}
            >
              (Leave blank if never set previously)
            </Text>
            <View style={styles.rowDirection}>
              {this.generateInputs(inputsFirstRow, 0)}
            </View>
            <Text style={styles.passcodeLabel}
            >
              New Passcode
            </Text>
            <View style={styles.rowDirection}>
              {this.generateInputs(inputsSecondRow, 4)}
            </View>
            <Text style={styles.passcodeLabel}
            >
              Confirm New Passcode
            </Text>
            <View style={styles.rowDirection}>
              {this.generateInputs(inputsThirdRow, 8)}
            </View>
            <TouchableOpacity
              style={buttonDisable ? styles.disableBtn : styles.zulBtn}
              disabled={buttonDisable}
              onPress={this.submitPasscode}
            >
              <Text style={styles.whiteText}>{'Submit'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const titleFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
  loginLogo: {
    marginTop: 60,
    marginBottom: 20
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
    marginTop: 30,
    borderRadius: 8,
    marginRight: 80,
    marginLeft: 80
  },
  disableBtn: {
    backgroundColor: '#99b294',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    marginRight: 80,
    marginLeft: 80
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
  blackText: { color: '#000' },
  blackMatLayer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  },
  flexOne: { flex: 1 },
  imageBackground: {
    flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 0, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute', backgroundColor: 'white', padding: 10
  },
  label: {
    marginTop: 20, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle
  },
  leaveBlankText: {
    marginLeft: 5, color: '#bbb', fontSize: 14, ...titleFontStyle
  },
  rowDirection: { flexDirection: 'row' },
  passcodeLabel: {
    marginTop: 10, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle
  },

});

export default connect(mapStateToProps, null)(Passcode);
