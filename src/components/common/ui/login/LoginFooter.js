import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

export default class LoginFooter extends Component {
  takeAssessment = () => {
    const { takeAssessment } = this.props;
    takeAssessment();
  }

  goRegister = () => {
    const { goRegister } = this.props;
    goRegister();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.registerBtn} onPress={this.goRegister}>
          <Text style={styles.textWhite}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 3 },
  takeAssessmentBtn: {
    backgroundColor: '#80399d',
    margin: 5,
    alignItems: 'center',
    padding: 10
  },
  registerBtn: {
    backgroundColor: '#2980b9',
    margin: 5,
    alignItems: 'center',
    padding: 10
  },
  statement: {
    margin: 5,
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center'
  },
  orStatement: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center'
  },
  textWhite: { color: '#ffffff' }
});
