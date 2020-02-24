// import React from 'react';
// import { View, Text, StyleSheet, Animated } from 'react-native';
// import PropTypes from "prop-types";
// const VALUE_SIZE = 25;

// export default class ProgressBarMini extends React.Component {
//   static propTypes = {
//     value: PropTypes.number,
//     borderRadius: PropTypes.number,
//     reachedBarHeight: PropTypes.number,
//     unreachedBarHeight: PropTypes.number,
//     reachedBarColor: PropTypes.string,
//     unreachedBarColor: PropTypes.string,
//     showValue: PropTypes.bool,
//     endLimit: PropTypes.number
//   }

//   static defaultProps = {
//     value: 0,
//     borderRadius: 0,
//     reachedBarColor: '#5E8CAD',
//     reachedBarHeight: 2,
//     unreachedBarColor: '#CFCFCF',
//     unreachedBarHeight: 1,
//     showValue: true,
//     endLimit: 0
//   };

//   constructor(props) {
//     super(props);
//     this.onLayout = this.onLayout.bind(this);
//     this.setValue = this.setValue.bind(this);

//     this.reachedWidth = new Animated.Value(0);

//     this.state = { value: 0 };
//   }

//   componentDidMount() {
//     this.reachedWidth.addListener(({ value }) => {
//       const w = this.reachedWidth.__getValue();
//       this.refReachedBarView.setNativeProps({ style: { width: w } });
//     });
//   }

//   componentDidUpdate(prevProps, prevState) {
//     if (this.props.value != prevProps.value) {
//       this.setValue(this.props.value);
//     }
//   }

//   onLayout(event) {
//     console.log("ON LAYOUT");

//     this.width = event.nativeEvent.layout.width;
//     this.setValue(this.props.value);
//   }

//   setValue(_value) {
//     const { endLimit } = this.props;
//     if (_value < 0) _value = 0;
//     if (_value > endLimit) _value = endLimit;

//     this.setState({ value: _value });

//     const _reachedWidth = ((this.width - VALUE_SIZE) * _value) / endLimit;

//     const _self = this;
//     Animated.timing(
//       _self.reachedWidth,
//       {
//         toValue: _reachedWidth,
//         duration: 300,
//       }
//     ).start();
//   }

//   render() {
//     console.log("RENDER");
//     const {
//       showValue, style,
//       reachedBarHeight, reachedBarColor,
//       borderRadius,
//       unreachedBarColor,
//       unreachedBarHeight
//     } = this.props;
//     const valueText = showValue
//       ? (<Text style={[styles.value, { color: '#fff' }]}>
//         {this.state.value}
//       </Text>)
//       : null;

//     return (
//       <View onLayout={this.onLayout} style={[styles.container, style]}>
//         <View
//           ref={component => this.refReachedBarView = component}
//           style={{
//             height: reachedBarHeight,
//             backgroundColor: reachedBarColor,
//             borderTopLeftRadius: borderRadius,
//             borderBottomLeftRadius: borderRadius
//           }}>
//         </View>
//         {valueText}
//         <View style={[styles.unreached, {
//           backgroundColor: unreachedBarColor,
//           height: unreachedBarHeight,
//           borderTopRightRadius: borderRadius,
//           borderBottomRightRadius: borderRadius
//         }]}>

//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   unreached: { flex: 1 },
//   value: {
//     fontSize: 15,
//     width: VALUE_SIZE,
//     textAlign: 'center',
//     borderWidth: 1,
//     backgroundColor: '#153914'
//   }
// });
