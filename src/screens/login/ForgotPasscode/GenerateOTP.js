import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, TouchableOpacity, Keyboard
} from 'react-native';
import { Text, Toast } from 'native-base';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import FloatingLabel from '../../../components/ui/floatingLabel/floatingLabel';
import {
  updateUsername, updateMobile, updateEmail, updateOtp
} from '../../../store/actions/index';
import { BASE_URL, headers } from '../../../api/config/Config';
import { regularButtonFont } from '../../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
  currentFlow: state.Assessment.currentFlow
});
const mapDispatchToProps = dispatch => ({
  updateName: name => dispatch(updateUsername(name)),
  updatedMobile: mobile => dispatch(updateMobile(mobile)),
  updatedEmail: email => dispatch(updateEmail(email)),
  updatedOtp: mobile => dispatch(updateOtp(mobile))
});
class GenerateOTP extends Component {
  state = {
    buttonDisable: true,
    mobile: '',
    validUser: ''
  }

  buttonDisable = () => {
    const { mobile } = this.state;
    setTimeout(() => {
      if (mobile !== '' && mobile.length === 10) {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }


  sendOTP = (props) => () => {
    this.setState({ buttonDisable: true });
    Keyboard.dismiss();
    const { mobile } = this.state;
    const { updatedMobile, updatedOtp } = this.props;
    fetch(`${BASE_URL}/api/findUser`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mobile })
    }).then(response => response.json())
      .then((response) => {
        this.fetchFunction(response);
        this.setState({ validUser: response.valid });
      }).then(() => {
        const { validUser } = this.state;
        if (validUser === 'true') {
          updatedMobile(mobile);
          updatedOtp(mobile.substring(4, 8));
          props.nextHandler();
        }
      })
      .catch((err) => { console.log('Network Error', err); });
  }

  fetchFunction = (response) => {
    if (response.valid !== 'true') {
      if (Platform.OS === 'ios') {
        Toast.show({
          text: 'Please enter valid mobile number..!!',
          duration: 2000,
          type: 'default',
          position: 'top'
        });
      } else {
        Toast.show({
          text: 'Please enter valid mobile number..!!',
          duration: 2000,
          type: 'default'
        });
      }
    }
  }

  render() {
    const { buttonDisable } = this.state;
    return (
      <View>
        <View style={styles.itemCenterAlign}>
          {/* {!this.state.isKeyboardOpen && } */}

        </View>
        <View style={styles.rowFlexDirection}>
          <View style={styles.flexOne}>
            <FloatingLabel
              underlineColorAndroid="#000"
              labelStyle={styles.labelStyle}
              inputStyle={styles.inputStyle}
              keyboardType="numeric"
              maxLength={10}
              style={styles.customStyle}
              onChangeText={async (text) => {
                await this.setState({ mobile: text.replace(/[^0-9]/g, '') });
                this.buttonDisable();
              }}
              accessible
              accessibilityLabel="Mobile"
              accessibilityHint="Provide Mobile Number"
            >
              <Icon2 name="mobile" size={25} color="#41ab3e" />
              {'   Mobile'}
            </FloatingLabel>
          </View>
        </View>

        <View style={styles.rowFlexDirection}>
          <View style={styles.flexOne}>
            <TouchableOpacity
              style={buttonDisable ? styles.disableBtn : styles.zulBtn}
              disabled={buttonDisable}
              onPress={this.sendOTP(this.props)}
            >
              <Text style={styles.whiteText}>{'Send OTP'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GenerateOTP);
const styles = StyleSheet.create({
  rowFlexDirection: { flexDirection: 'row' },
  flexOne: { flex: 1 },
  itemCenterAlign: { alignItems: 'center' },
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
    color: '#fff',
    ...Platform.select({
      ios: {
        borderBottomColor: '#fff',
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
  otpBtn: {
    backgroundColor: '#00c497',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 100,
    marginLeft: 100
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
  blackText: {
    color: '#000',
    ...regularButtonFont
  },
  labelStyle: { fontFamily: 'System', color: '#000' },

  inputStyle: {
    fontFamily: 'System',
    height: 60,
    borderWidth: 0,
    color: '#000',
    ...Platform.select({
      ios: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
      }
    })
  },

  customStyle: {
    fontFamily: 'System',
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }

});
