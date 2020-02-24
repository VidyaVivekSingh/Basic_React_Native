import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'native-base';
import { BASE_URL, headers } from '../../api/config/Config';

export default class Demo extends Component {
  state = {
    email: 'email',
    name: 'name',
  };

  makeCall = () => {
    fetch(`${BASE_URL}/api/user`, {
      method: 'GET',
      headers
    })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          name: responseJson[0].name,
          email: responseJson[0].email
        });
      }).catch((err) => { console.log('Network Error', err); });
  }

  render() {
    const { name, email } = this.state;
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <View>
          <Text style={{ fontFamily: 'System' }}>{name}</Text>
          <Text style={{ fontFamily: 'System' }}>{email}</Text>
        </View>
        <Button onPress={this.makeCall}><Text>Get</Text></Button>
      </View>
    );
  }
}
