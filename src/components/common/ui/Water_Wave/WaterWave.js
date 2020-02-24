import React from 'react';
import {
  View,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

class Wave extends React.PureComponent {
  constructor(props) {
    super(props);

    const { H, waveParams, animated } = this.props;

    this.state = {
      H,
      waveParams,
    };

    this._animValues = [];
    this._animations = [];
    this._animated = animated || false;

    for (let i = 0; i < waveParams.length; i += 1) {
      this._animValues.push(new Animated.Value(0));
    }
  }

  componentDidMount() {
    this._animated && this.startAnim();
  }

  componentWillUnmount() {
    this.stopAnim();
    this._animValues = null;
    this._animations = null;
  }

  setWaveParams(waveParams) {
    if (!waveParams) return;

    const animated = this._animated;
    const newWaveCount = waveParams.length;
    const oldWaveCount = this.state.waveParams.length;
    if (animated) {
      this.stopAnim();
      for (let v of this._animValues) {
        v.setValue(0);
      }
    }
    if (newWaveCount !== oldWaveCount) {
      this._animValues = [];
      for (let i = 0; i < waveParams.length; i += 1) {
        this._animValues.push(new Animated.Value(0));
      }
    }

    this.setState({ waveParams }, () => {
      if (animated) {
        this.startAnim();
      }
    });
  }

  setWaterHeight(H) {
    if (H <= 0) {
      this.setState({ H: 0 });
    } else if (H >= 100) {
      this.setState({ H: 100 });
    } else {
      this.setState({ H });
    }
  }

  startAnim() {
    this.stopAnim();

    const {
      speed = 5000,
      speedIncreasePerWave = 1000,
      easing = 'linear'
    } = this.props

    for (let i = 0; i < this._animValues.length; i++) {
      const anim = Animated.loop(Animated.timing(this._animValues[i], {
        toValue: 1,
        duration: speed + i * speedIncreasePerWave,
        easing: Easing[easing],
        useNativeDriver: true,
      }));
      this._animations.push(anim);
      anim.start();
    }
    this._animated = true;
  }

  stopAnim() {
    for (let _anim of this._animations) {
      _anim.stop();
      _anim = null;
    }
    this._animations = [];
    this._animated = false;
  }

  render() {
    const { style } = this.props;
    const { H, waveParams } = this.props;

    const waves = [];

    for (let i = 0; i < waveParams.length; i++) {
      const { A, T, fill } = waveParams[i];
      const translateX = this._animValues[i].interpolate({
        inputRange: [0, 1],
        outputRange: [0, -2 * T],
      });
      const wave = (
        <AnimatedSvg
          key={i}
          style={{
            width: 3 * T,
            height: A + H,
            position: 'absolute',
            left: 0,
            bottom: 0,
            transform: [{ translateX }],
          }}
          preserveAspectRatio="xMinYMin meet"
          viewBox={`0 0 ${3 * T} ${A + H}`}
        >
          <Path
            d={`M 0 0 Q ${T / 4} ${-A} ${T / 2} 0 T ${T} 0 T ${3 * T / 2} 0 T ${2 * T} 0 T ${5 * T / 2} 0 T ${3 * T} 0 V ${H} H 0 Z`}
            fill={fill}
            transform={`translate(0, ${A})`}
          />
        </AnimatedSvg>
      );
      waves.push(wave);
    }

    return (
      <View style={style} >
        {waves}
      </View>
    );
  }
}

export default Wave;
