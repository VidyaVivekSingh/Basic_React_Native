import React, {useState} from 'react';
import {
  Text,
  Button,
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
// import {Text} from 'native-base';
import {connect} from 'react-redux';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FloatingLabel from '../../components/common/ui/floatingLabel/floatingLabel';
import {regularButtonFont} from '../../store/styles/fonts/FontMaker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

const UserDetail = props => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [userName, setuserName] = useState('');
  const [userMobile, setuserMobile] = useState('');
  const [userPassword, setuserPassword] = useState('');
  const [userDOB, setuserDOB] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate || date;

    await setuserDOB(moment(currentDate).format('L'));
    await setShow(false);
    // setShow(Platform.OS === 'android' ? false : true);
  };

  const showMode = currentMode => {
    setShow(true);
    // setMode(currentMode);
  };

  const showDatepicker = () => {
    setShow(true);
    // showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const ButtonDisabled = () => {
    setTimeout(() => {
      if (userName !== '' && userMobile.length !== 0) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }, 300);
  };

  // save register
  const registerUser = async () => {
    // this.setState({buttonDisabled: true});
    setButtonDisabled(true);
    // const {showAlert, prevHandler, goToDashboard, nextHandler} = this.props;
    const regex = /^[_a-zA-Z]+([._]?[a-zA-Z0-9]+)*$/;
    const mobileRegex = /^((?![0-5])[0-9]{10})$/;

    if (userName.trim() === '' || !regex.test(userName)) {
      props.showAlert(
        'Oops!',
        'Please enter valid Username',
        'danger',
        'Close',
      );
      await setuserName('');
    } else if (!mobileRegex.test(userMobile)) {
      props.showAlert(
        'Oops!',
        'Please enter valid mobile number',
        'danger',
        'Close',
      );
    } else if (userDOB === '') {
      props.showAlert('Oops!', 'Please enter Date Of Birth', 'danger', 'Close');
    } else {
      props.nextHandler();
      // fetch(`${BASE_URL}/api/registrationValidation`, {
      //   method: 'POST',
      //   headers,
      //   body: JSON.stringify({
      //     name: userName.trim(),
      //     mobile: userMobile,
      //   }),
      // })
      //   .then(response => response.json())
      //   .then(async responseJson => {
      //     if (responseJson.hasOwnProperty.call(responseJson, 'status')) {
      //     } else if (responseJson.hasOwnProperty.call(responseJson, 'err')) {
      //       showAlert('Oops!', responseJson.err, 'danger', 'Close');
      //       this.setState({buttonDisabled: false});
      //     }
      //   })
      //   .catch(err => {
      //     console.log('Networ k Error', err);
      //   });
    }
  };

  const onChangeInput = async (state, text) => {
    var regExpr = new RegExp('/\b[\t\b]/');
    var newRegExpr = !regExpr.test(text);
    if (state === 'userMobile') {
      await setuserMobile(text.replace(/[^0-9]/g, ''));
    } else if (state === 'userDOB') {
      // await this.setState({[state]: text});
    } else {
      await setuserName(prevState => {
        console.log(prevState);
        return text;
      });
      // await this.setState({[state]: text});
    }
    ButtonDisabled();
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        enableOnAndroid
        // style={styles.blackMatLayer}
      >
        <View>
          <FloatingLabel
            underlineColorAndroid="#000"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            // value={userName}
            onChangeText={onChangeInput.bind(this, 'userName')}
            accessible
            accessibilityLabel="Username"
            accessibilityHint="Provide Username">
            <EntypoIcon name="user" size={22} color="#41ab3e" />
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
            onChangeText={onChangeInput.bind(this, 'userMobile')}
            accessible
            accessibilityLabel="Mobile"
            accessibilityHint="Provide Mobile Number">
            <FAIcon name="mobile" size={22} color="#41ab3e" />
            {'  Mobile'}
          </FloatingLabel>
        </View>
        <View>
          <FloatingLabel
            underlineColorAndroid="#000"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            onFocus={showDatepicker.bind(this)}
            onChangeText={onChangeInput.bind(this, 'userDOB')}
            value={userDOB}
            accessible
            accessibilityLabel="Date of Birth"
            accessibilityHint="Provide Date of Birth">
            <FAIcon name="calendar" size={22} color="#41ab3e" />
            {'  Date Of Birth'}
          </FloatingLabel>
        </View>
        <View>
          <TouchableOpacity
            style={buttonDisabled ? styles.disableBtn : styles.zulBtn}
            onPress={() => registerUser()}
            disabled={buttonDisabled}>
            <Text style={styles.whiteText}>
              {'Create new account'.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={date}
            mode={mode}
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

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
  flexOne: {flex: 1},
  flexRow: {flexDirection: 'row'},
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
    color: '#fff',
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
  },
  disableBtn: {
    backgroundColor: '#99b294',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont,
  },
  blackText: {
    color: '#000',
    ...regularButtonFont,
  },
  labelStyle: {fontFamily: 'System', color: '#000'},
  inviteLabelStyle: {
    fontSize: 17,
    color: '#000',
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
      },
    }),
  },
  customStyle: {
    fontFamily: 'System',
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  blackMatLayer: {
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
