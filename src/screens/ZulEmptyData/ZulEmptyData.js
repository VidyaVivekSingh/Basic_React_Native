import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ZulaAnimation from '../../components/common/ui/ZulaAnimation/ZulaAnimation';
import {regularButtonFont} from '../../store/styles/fonts/FontMaker';

class ErrorPage extends Component {
  goto = () => {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ZulaAnimation />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontFamily: 'System', fontSize: 18, color: 'black'}}>
              No Data To Display
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return this.goto();
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
export default ErrorPage;
