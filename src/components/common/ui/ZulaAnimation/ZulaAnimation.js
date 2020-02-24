import React, { Component } from 'react';
import { View, PanResponder, Animated } from 'react-native';

class ZulaAnimation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }

  componentWillMount() {
    const { pan } = this.state;
    this._val = { x: 0, y: 0 };
    pan.addListener(value => this._val = value);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([
        null, { dx: pan.x, dy: pan.y }
      ]),

      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5
        }).start();
      }
      // onPanResponderRelease: (e, gesture) => {
      //   if (this.isDropArea(gesture)) {
      //     Animated.timing(this.state.opacity, {
      //       toValue: 0,
      //       duration: 1000
      //     }).start(() =>
      //       this.setState({
      //         showDraggable: false
      //       })
      //     );
      //   }
      // }
    });
  }

  // isDropArea(gesture) {
  //   return gesture.moveY < 200;
  // }

  callFunction = () => {
    return (
      <View style={{ width: '20%', alignItems: 'center' }}>
        {this.renderDraggable()}
      </View>
    );
  }


  renderDraggable() {
    const { pan, showDraggable, opacity } = this.state;
    const panStyle = { transform: pan.getTranslateTransform() };
    if (showDraggable) {
      return (
        <View style={{ position: 'absolute' }}>
          <Animated.Image
            /* eslint-disable global-require */
            source={require('../../../assets/Zula/zula-anim.gif')}
            /* eslint-enable global-require */
            {...this.panResponder.panHandlers}
            style={[panStyle, { opacity, height: 100, width: 100 }]}
          />
        </View>
      );
    }
    return null;
  }

  render() { return (this.callFunction()); }
}

export default ZulaAnimation;
