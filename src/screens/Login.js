import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

const Login = ({navigation}) => {
  return (
    <View style={styles.main}>
      <TouchableOpacity
      // onPress={() => navigation.navigate('Home', {name: 'Home'})}
      >
        <Text>Hello, world!</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default Login;
