import React, { PureComponent } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Linking, TextInput
} from 'react-native';
import { Text } from 'native-base';
// import ImagePicker from 'react-native-image-picker';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';

export class Register extends PureComponent {
  state = {
    query: '',
    // pickedImage1: '',
    // pickedImage2: '',
    // pickedImage3: '',
    // pickedImage1Path: '',
    // pickedImage2Path: '',
    // pickedImage3Path: '',
    // count: 1,
    // spinner: false,
    showSCLAlert: false
  };

  // pickImageHandler = (choice) => {
  //   ImagePicker.showImagePicker(
  //     {
  //       title: 'Choose Profile Image'
  //     },
  //     (response) => {
  //       if (response.didCancel) {
  //         console.log('User cancelled image picker');
  //       } else if (response.error) {
  //         console.log('ImagePicker Error: ', response.error);
  //       } else {
  //         console.log('respnse data', response);
  //         const source = {
  //           uri: response.uri,
  //           // base64: response.data
  //         };
  //         if (choice === 1) {
  //           this.setState({
  //             pickedImage1: source,
  //             count: 1,
  //             pickedImage1Path: response.path
  //             // spinner: true
  //           });
  //         } else if (choice === 2) {
  //           this.setState({
  //             pickedImage2: source,
  //             count: 1,
  //             pickedImage2Path: response.path
  //             // spinner: true
  //           });
  //         } else {
  //           this.setState({
  //             pickedImage3: source,
  //             count: 1,
  //             pickedImage3Path: response.path
  //             // spinner: true
  //           });
  //         }
  //       }
  //     }
  //   );
  // };

  handleEmail = () => {
    const { query } = this.state;
    const { navigation } = this.props;
    const mailAddress = "support@zinguplife.com";
    const subject="Question about Zing up life";
    Linking.openURL(`mailto:${mailAddress}?subject=${subject}&body=${query}`);
    navigation.goBack();
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
  }

  handleOpen = () => {
    this.setState({ showSCLAlert: true });
  }

  sendQuery = () => {
    const { query } = this.state;
    query.trim(' ').length !== 0 ? this.handleEmail() : this.handleOpen();
  }
  setQuery = (text) => { this.setState({ query: text }); }

  render() {
    const { showSCLAlert, query } = this.state;
    return (
      <View style={styles.container}>
        <SCLAlert
          theme="danger"
          show={showSCLAlert}
          title="Oops!"
          subtitle="Query field must be filled"
          onRequestClose={this.handleClose}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton
            theme="danger"
            onPress={this.handleClose}
            textStyle={{ ...regularButtonFont }}
          >
            OK
          </SCLAlertButton>
        </SCLAlert>
        <View style={styles.inputTextContainer}>
          <TextInput
            underlineColorAndroid="#144E76"
            maxLength={500}
            multiline
            placeholder="Please describe your problem"
            style={styles.customStyle}
            onChangeText={this.setQuery.bind(this)}
            accessible
            accessibilityLabel="Enter Query"
            accessibilityHint="Provide Query"
          />
          <TouchableOpacity
            style={styles.zulBtn}
            onPress={this.sendQuery}
          >
            <Text style={styles.whiteText}>NEXT</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  blackMatLayer: {
    backgroundColor: '#00000054',
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  },
  customStyle: {
    fontFamily: 'System',
    fontSize: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: '#41ab3e',
    height: 100,
    width: '100%'
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60

  },
  whiteText: {
    color: '#fff',
    fontSize: 15,
    ...regularButtonFont
  },
  image: {
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
    borderRadius: 25
  },
  imagesrc: {
    height: 200,
    width: 200,
    borderRadius: 25
  },
  inputTextContainer: { marginLeft: 25, marginRight: 25 }
});

export default Register;
