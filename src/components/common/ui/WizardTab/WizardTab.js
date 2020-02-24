import React from 'react';
import { View, StyleSheet } from 'react-native';

const wizardTab = (props) => {
  let currentStep = 0;
  const { children } = props;

  const setCurrentStep = (step) => {
    currentStep = step;
  };

  const goToNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const goToPrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <View style={styles.container}>
      {children[props.currentStepSelected]}
    </View>
  );
};

export default wizardTab;

const styles = StyleSheet.create({ container: { margin: 5 } });
