import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
} from 'react-native';
import CircularProgress from './CircularProgress';

const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { fillAnimation: new Animated.Value(props.prefill) };
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps) {
    const { fill } = this.props;
    if (prevProps.fill !== fill) {
      this.animate();
    }
  }

  reAnimate(prefill, toVal, dur, ease) {
    this.setState({ fillAnimation: new Animated.Value(prefill) },
      () => this.animate(toVal, dur, ease));
  }

  animate(toVal, dur, ease) {
    const { fill, onAnimationComplete } = this.props;
    const { fillAnimation } = this.state;

    const toValue = toVal || fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;

    const anim = Animated.timing(fillAnimation, {
      toValue,
      easing,
      duration,
    });
    anim.start(onAnimationComplete);

    return anim;
  }

  render() {
    const { fill, prefill, ...other } = this.props;
    const { fillAnimation } = this.state;

    return (
      <AnimatedProgress
        {...other}
        fill={fillAnimation}
      />
    );
  }
}

AnimatedCircularProgress.propTypes = {
  ...CircularProgress.propTypes,
  prefill: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.func,
  onAnimationComplete: PropTypes.func
};

AnimatedCircularProgress.defaultProps = {
  duration: 500,
  easing: Easing.out(Easing.ease),
  prefill: 0,
};
