import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {changeCount} from '../../store/actions/count-action';
import {regularButtonFont} from '../../store/styles/fonts/FontMaker';
import {bindActionCreators} from 'redux';
import countReducer from '../../store/reducers/count-reducer';

const mapStateToProps = state => ({
  count: state.counter.count,
});

// const ActionCreators = Object.assign({}, changeCount);
const mapDispatchToProps = dispatch => ({
  // updateName: name => dispatch(updateUsername(name)),
  // actions: bindActionCreators(ActionCreators, dispatch),
  updateCounter: count => dispatch(changeCount(count)),
});
class LoginForm extends PureComponent {
  decrementCount() {
    let {count, updateCounter} = this.props;
    count--;
    updateCounter(count);
  }
  incrementCount() {
    let {count, updateCounter} = this.props;
    count++;
    updateCounter(count);
  }

  form = () => {
    const {count} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Home')}>
          <Text>This is login Page press to go to Home page</Text>
        </TouchableOpacity>
        <Button title="increment" onPress={() => this.incrementCount()} />
        <Text>{count}</Text>
        <Button title="decrement" onPress={() => this.decrementCount()} />
      </View>
    );
  };

  render() {
    return this.form();
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  whiteText: {
    color: '#fff',
    fontSize: 15,
    ...regularButtonFont,
  },
  button: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
