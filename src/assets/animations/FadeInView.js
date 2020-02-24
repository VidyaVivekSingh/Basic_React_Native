import React, { Component } from 'react';
import { Animated } from 'react-native';

class FadeInView extends Component {
  state = { fadeAnim: new Animated.Value(0) }

  componentDidMount() {
    const { fadeAnim } = this.state;
    const { durations, delays } = this.props;
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: durations,
        delay: delays
      }
    ).start();
  }

  render() {
    const { fadeAnim } = this.state;
    const { children, style } = this.props;
    return (
      <Animated.View style={{ ...style, opacity: fadeAnim }}>
        {children}
      </Animated.View>
    );
  }
}

export default FadeInView;
