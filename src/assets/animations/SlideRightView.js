import React, { Component } from 'react';
import { Animated } from 'react-native';

class SlideRightView extends Component {
  constructor() {
    super();
    this.state = { translateXValue: new Animated.Value(-300), };
  }

  componentDidMount() {
    const { translateXValue } = this.state;
    Animated.timing(
      translateXValue,
      {
        toValue: 0,
        duration: 200
      }
    ).start();
  }

  render() {
    const { translateXValue } = this.state;
    const { children, style } = this.props;
    return (
      <Animated.View style={{ ...style, flex: 1, transform: [{ translateX: translateXValue }] }}>
        {children}
      </Animated.View>
    );
  }
}

export default SlideRightView;
