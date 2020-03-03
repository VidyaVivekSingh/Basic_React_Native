import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../../screens/login/LoginForm';
import Overview from '../../screens/overview/Overview';
import Register from '../../screens/register/Register';
import DatePicker from '../../screens/DatePicker';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          // options={{title: 'Login'}}
        />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="DatePicker" component={DatePicker} />
        <Stack.Screen name="Home" component={Overview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
