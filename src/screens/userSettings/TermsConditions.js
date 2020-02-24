import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const termsConditions = (props) => {
  const { children } = props;
  return (
    <View>
      <Text style={styles.listText}>
        {children}
      </Text>
    </View>
  );
};

const termsFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flexDirection: 'row' },
  listText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    ...termsFontStyle
  },
});
export default termsConditions;
