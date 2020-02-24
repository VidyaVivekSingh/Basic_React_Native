import React, { Component } from 'react';
import {
  StyleSheet, View, Dimensions, AsyncStorage, Image
} from 'react-native';
import { Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppIntroSlider from '../react-native-app-introSlider/AppIntroSlider';
import { regularButtonFont, fontMaker } from '../../utility/fonts/FontMaker';

class OnBoard extends Component {
  _renderItem = props => (

    <LinearGradient colors={['#fff', '#fff']} style={styles.linearGradientStyle}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.sliderContainer}>

        <Image
          source={props.image}
          style={{
            width: (Dimensions.get('window').width / props.widthOffset),
            height: (Dimensions.get('window').height / props.heightOffset),
            paddingVertical: 30,
            resizeMode: 'contain'
          }}
          color={props.color}
        />
      </View>
      <View style={{ flex: 2 }}>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </LinearGradient>
  );

  _done = () => {
    const { navigation } = this.props;
    AsyncStorage.setItem('isFirstTimeUser', 'false', () => {
      navigation.navigate('LoginRoute');
    });
  }


  _renderSkipButton = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
      <Text style={{
        ...regularButtonFont, color: '#696969', paddingTop: 10
      }}
      >
        Skip
      </Text>
    </View>
  )

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        onDone={this._done}
        onSkip={this._done}
        renderSkipButton={this._renderSkipButton}
        bottomButton
        showSkipButton
        activeDotStyle={{ backgroundColor: '#1ADBDB' }}
        buttonStyle={{ backgroundColor: '#41ab3e' }}
      />
    );
  }
}

const titleFontStyle = fontMaker({ family: 'OpenSans', weight: 'SemiBold' });
const descriptionFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  sliderContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageLandscape: {
    width: 150,
    height: 150
  },
  linearGradientStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    padding: 30,
    paddingTop: 45,
    flexDirection: 'column',
    flex: 1
  },
  text: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    color: '#737373',
    fontSize: 20,
    ...descriptionFontStyle
  },
  title: {
    fontSize: 25,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000000',
    ...titleFontStyle
  },
});
/* eslint-disable global-require */
const slides = [
  {
    key: 'sd0',
    title: 'Discover yourself',
    text: 'Discover your personal wellness quotient across all relevant Dimension, with the fun and engaging 8BAK-C wellbeing inventory',
    image: require('../../../assets/images/onboard/score-icon1.png'),
    colors: ['#43cea2', '#185a9d'],
    color: '#003c8f',
    widthOffset: 1.5,
    heightOffset: 4.8
  },
  {
    key: 'sd1',
    title: 'Your care, your choices',
    text: 'Based on where you are at, set reasonable goals for self-improvement, focusing on lifestyle changes for better health, wellbeing & happiness',
    image: require('../../../assets/images/onboard/Lifestyle_goals.jpg'),
    colors: ['#43cea2', '#185a9d'],
    color: '#003c8f',
    widthOffset: 1.6,
    heightOffset: 3.9,
  },
  {
    key: 'sd2',
    title: 'Wellness Ahoy!',
    text: 'Monitor and optimize progress by reaching out to a leading collaborative ecosystem of holistic practitioner, experts, therapists and coaches',
    image: require('../../../assets/images/onboard/Therapists1.jpeg'),
    colors: ['#43cea2', '#185a9d'],
    color: '#003c8f',
    widthOffset: 2,
    heightOffset: 4.8
  },
];
/* eslint-ensable global-require */

export default OnBoard;
