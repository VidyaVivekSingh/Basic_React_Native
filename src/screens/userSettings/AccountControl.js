import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Alert, AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import RazorpayCheckout from 'react-native-razorpay';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';
import { connect } from 'react-redux';
import {
  Left, Body, Right, List, ListItem, Toast
} from 'native-base';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import {
  updateUsername, updateDob, updateUserSocialImage, updateFetchedUrl, resetState
} from '../../store/actions/index';
import { updateCurrentFlow } from '../../store/actions/assessment';
import { BASE_URL, headers } from '../../api/config/Config';


const mapStateToProps = state => ({
  uName: state.User.name,
  uSocialImage: state.User.socialImage,
  fetchedUrl: state.User.fetchedURL,
  gender: state.User.gender
});
const mapDispatchToProps = dispatch => ({

  updatedUserName: name => dispatch(updateUsername(name)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url)),
  updatedUserSocialImage: uri => dispatch(updateUserSocialImage(uri)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedCurrentFlow: flow => dispatch(updateCurrentFlow(flow)),
  ResetState: () => dispatch(resetState())
});

export class AccountSetting extends Component {
  logout = async () => {
    const { navigation, ResetState } = this.props;
    try {
      await ResetState();
    } catch (error) {
      Toast.show({
        text: 'Error Occured..!!',
        duration: 2000,
        type: 'default'
      });
    }

    this.signOut();
    const { updatedCurrentFlow } = this.props;
    navigation.navigate('RegisterRouteStartPage');
    updatedCurrentFlow('NEW');
  }

  signOut = async () => {
    const { updatedDob } = this.props;
    updatedDob(null);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('UserSocialImage');
      if (await GoogleSignin.isSignedIn()) { await GoogleSignin.signOut(); }
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

  // payAccount = () => {
  //   const options = {
  //     description: 'Credits towards consultation',
  //     image: 'https://i.imgur.com/3g7nmJC.png',
  //     currency: 'INR',
  //     key: 'rzp_test_9U0bdWxnAUEpRm',
  //     amount: '5000',
  //     name: 'ZUL',
  //     prefill: {
  //       email: 'sagar.vivek159@gmail.com',
  //       contact: '9538346231',
  //       name: 'Razorpay Software'
  //     },
  //     theme: { color: '#F37254' }
  //   };
  //   RazorpayCheckout.open(options).then((data) => {
  //     // handle success
  //     console.log("data", data);
  //     alert(`Success: ${data.razorpay_payment_id}`);
  //   }).catch((error) => {
  //     // handle failure
  //     console.log("error", error);
  //     alert(`Error: ${error.code} | ${error.description}`);
  //   });
  // }

  render() {
    return (
      <View style={styles.container}>
        <List>
          <ListItem onPress={this.deleteAccount}>
            <Left>
              <View style={styles.list}>
                <View style={{ alignItems: 'center', alignSelf: 'center', width: 50 }}>
                  <Icon name="user-times" size={20} color="grey" />
                </View>
                <View><Text style={styles.listText}>Delete Account</Text></View>

              </View>
            </Left>

            <Body />
            <Right>
              <Icon name="angle-right" size={20} color="grey" />
            </Right>
          </ListItem>
        </List>
      </View>
    );
  }
}
const menuItemFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  list: {
    flex: 1,
    flexDirection: 'row',
  },
  listText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 5,
    width: '100%',
    ...menuItemFontStyle
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AccountSetting);
