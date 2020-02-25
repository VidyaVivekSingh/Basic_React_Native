import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {regularButtonFont} from '../../store/styles/fonts/FontMaker';

class LoginForm extends PureComponent {
  form = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Home')}>
          <Text>This is login Page press to go to Home page</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return this.form();
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  whiteText: {
    color: '#fff',
    fontSize: 15,
    ...regularButtonFont,
  },
  button: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
  },
});
export default LoginForm;
