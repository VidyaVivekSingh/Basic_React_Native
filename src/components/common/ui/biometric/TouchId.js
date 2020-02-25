import React, {PureComponent} from 'react';
import TouchID from 'react-native-touch-id';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getLoggedInUserName} from '../../../../repository/app/LoginRepository';

class TouchComponent extends PureComponent {
  componentDidMount() {
    const {askByDefault} = this.props;
    if (askByDefault) {
      this._pressHandler();
    }
  }

  _pressHandler = () => {
    TouchID.authenticate('Touch Id or Enter Passcode', undefined)
      .then(() => {
        getLoggedInUserName().then(value => {
          updatedUsername(value);

          updatedCurrentFlow('REGISTERED');
          goHome();
        });
      })
      .catch(error => {
        if (error === 'LAErrorTouchIDNotAvailable') {
          Toast.show({
            text: 'Touch Id is not available in this device..!!',
            duration: 2000,
            type: 'danger',
          });
          return;
        }
        if (error === 'LAErrorPasscodeNotSet') {
          Toast.show({
            text: 'No passcode is set. Go to settings and set passcode..!!',
            duration: 2000,
            type: 'danger',
          });
          return;
        }
        if (error === 'LAErrorTouchIDNotEnrolled') {
          Toast.show({
            text:
              'No fingerprints are registered. Go to settings and register your fingerprint..!!',
            duration: 2000,
            type: 'danger',
          });
          return;
        }
        if (error !== 'LAErrorUserCancel' && error !== 'LAErrorSystemCancel') {
          Toast.show({
            text: 'Authentication failed or cancelled by user. Try again..!!',
            duration: 2000,
            type: 'danger',
          });
          return;
        }
        if (error === 'LAErrorUserFallback') {
          Toast.show({
            text: 'Enter passcode..!!',
            duration: 2000,
            type: 'danger',
          });
        }
      });
  };

  render() {
    return (
      <View style={styles.touchIdStyle}>
        <TouchableOpacity onPress={this._pressHandler}>
          <MatComIcon name="fingerprint" size={50} color="#41ab3e" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchIdStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgStyle: {
    width: 50,
    height: 45,
  },
});

export default TouchComponent;
