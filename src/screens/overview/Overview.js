import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

const OverView = ({navigation}) => {
  return (
    <View style={styles.main}>
      <Text>Hello, world! This is Vidya</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default OverView;
