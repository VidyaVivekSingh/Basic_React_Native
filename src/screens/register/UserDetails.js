import React from 'react';
import {
  Platform, View, StyleSheet, TouchableOpacity
} from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import FloatingLabel from '../../components/ui/floatingLabel/floatingLabel';
import {
  updateUsername, updateMobile, updateEmail, updateOtp, updateInviteCode,
  updateDob, updateUserSocialImage, updateHeight, updateWeight
} from '../../store/actions/index';
import { BASE_URL, headers } from '../../api/config/Config';
import { regularButtonFont } from '../../components/utility/fonts/FontMaker';


const mapStateToProps = state => ({
  currentFlow: state.Assessment.currentFlow,
  uname: state.User.name,
  uDob: state.User.dob,
  image: state.User.socialImage
});
const mapDispatchToProps = dispatch => ({
  updateName: name => dispatch(updateUsername(name)),
  updateUserMobile: mobile => dispatch(updateMobile(mobile)),
  updateUserEmail: email => dispatch(updateEmail(email)),
  updateUserOtp: mobile => dispatch(updateOtp(mobile)),
  updateUserDob: dob => dispatch(updateDob(dob)),
  updateSocialImage: img => dispatch(updateUserSocialImage(img)),
  updateUserHeight: height => dispatch(updateHeight(height)),
  updateUserWeight: weight => dispatch(updateWeight(weight)),
  updateUserInviteCode: inviteCode => dispatch(updateInviteCode(inviteCode))
});

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uName: '',
      uMobile: '',
      email: '',
      buttonDisable: true,
      inviteCode: '',
      dobDate: null
    };
  }
  // Button Disable

  ButtonDisable = () => {
    const { uName, uMobile } = this.state;
    setTimeout(() => {
      if (uName !== '' && uMobile.length !== 0) {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  // save register
  registerUser = async () => {
    this.setState({ buttonDisable: true });
    const regex = /^[_a-zA-Z]+([._]?[a-zA-Z0-9]+)*$/;
    const mobileRegex= /^((?![0-5])[0-9]{10})$/;
    const {
      uName, uMobile, dobDate, inviteCode, email
    } = this.state;
    const {
      showAlert, nextHandler, updateName, updateUserMobile,
      updateUserEmail, updateUserInviteCode
    } = this.props;
    if (uName.trim() === '' || !regex.test(uName)) {
      showAlert('Oops!', 'Please enter valid Username', 'danger', 'Close');
      await this.setState({ uName: '' });
    } else if (!mobileRegex.test(uMobile) ) {
      showAlert('Oops!', 'Please enter valid mobile number', 'danger', 'Close');
    } else if (dobDate === '') {
      showAlert('Oops!', 'Please enter Date Of Birth', 'danger', 'Close');
    } else {
      fetch(`${BASE_URL}/api/registrationValidation`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: uName.trim(),
          mobile: uMobile,
          inviteCode: inviteCode ? inviteCode.trim() : ''
        })
      }).then(response => response.json())
        .then(async (responseJson) => {
          if (responseJson.hasOwnProperty.call(responseJson, 'status')) {
            await (
              updateName(uName),
              updateUserMobile(uMobile !== '' ? uMobile : null),
              updateUserEmail(email),
              updateUserInviteCode(inviteCode)
            );
            nextHandler();
          } else if (responseJson.hasOwnProperty.call(responseJson, 'err')) {
            showAlert('Oops!', responseJson.err, 'danger', 'Close');
            this.setState({ buttonDisable: false });
          }
        })
        .catch((err) => { console.log('Network Error', err); });
    }
  }

  onChangeInput = (state, text) => {
    if (state === 'uMobile') {
      this.setState({ [state]: text.replace(/[^0-9]/g, '') });
    } else {
      this.setState({ [state]: text });
    }
    this.ButtonDisable();
  }

  render() {
    const { uName, buttonDisable } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <FloatingLabel
            underlineColorAndroid="#000"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            // value={uName}
            onChangeText={this.onChangeInput.bind(this, 'uName')}
            accessible
            accessibilityLabel="Username"
            accessibilityHint="Provide Username"
          >
            <Icon1 name="user" size={22} color="#41ab3e" />
            {'  Username'}
          </FloatingLabel>
        </View>
        <View>
          <FloatingLabel
            underlineColorAndroid="#000"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            keyboardType="numeric"
            maxLength={10}
            style={styles.customStyle}
            onChangeText={this.onChangeInput.bind(this, 'uMobile')}
            accessible
            accessibilityLabel="Mobile"
            accessibilityHint="Provide Mobile Number"
          >
            <Icon2 name="mobile" size={25} color="#41ab3e" />
            {'   Mobile'}
          </FloatingLabel>
        </View>
        <FloatingLabel
          underlineColorAndroid="#000"
          labelStyle={styles.inviteLabelStyle}
          inputStyle={styles.inputStyle}
          style={styles.customStyle}
          onChangeText={this.onChangeInput.bind(this, 'inviteCode')}
          accessible
          accessibilityLabel="InviteCode"
          accessibilityHint="Provide InviteCode"
        >
          Invite Code (Optional)
        </FloatingLabel>

        <View>
          <TouchableOpacity
            style={buttonDisable ? styles.disableBtn : styles.zulBtn}
            onPress={this.registerUser}
            disabled={buttonDisable}
          >
            <Text style={styles.whiteText}>{'Create new account'.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  datePickerBox: {
    marginTop: 5,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 20,
    justifyContent: 'center',
  },
  flexOne: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  datePickerText: {
    fontSize: 20,
    marginLeft: 5,
    borderWidth: 0,
    color: 'white',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 20,
    color: '#fff'
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  disableBtn: {
    backgroundColor: '#99b294',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 10,
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
  labelStyle: { fontFamily: 'System', color: '#000', },
  inviteLabelStyle: {
    fontSize: 17,
    color: '#000'
  },
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
    }),
  },
  customStyle: {
    fontFamily: 'System',
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
