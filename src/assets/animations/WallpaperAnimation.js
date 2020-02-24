
import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class WallpaperAnimation extends Component {
  constructor() {
    super();
    this.state = { scaleValue: new Animated.Value(1) };
  }

  componentDidMount() {
    const { scaleValue } = this.state;
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          scaleValue,
          {
            toValue: 1.5,
            duration: 4500
          }
        ),
        Animated.timing(
          scaleValue,
          {
            toValue: 1,
            duration: 4500
          }
        )
      ])
    ).start();
  }

  render() {
    const { children, style } = this.props;
    const { scaleValue } = this.state;
    return (
      <Animated.View style={{ ...style, transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    );
  }
}
