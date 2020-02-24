import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { getLabel } from '../../utility/locale/I18N';

class Home extends Component {
  logout = () => {
    const { navigation } = this.props;
    navigation.navigate('LoginRouteLogIn');
  }

  render() {
    const logoutText = getLabel('home.logout');
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Button title={logoutText} onPress={this.logout} style={{ flex: 1 }} />
      </View>
    );
  }
}
export default Home;
