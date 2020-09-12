import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainContentScreen from "../screens/main_content";
import ContentDetailScreen from "../screens/detail_screen";
const Stack = createStackNavigator();

const StackNavigation = (props) => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={MainContentScreen} initialParams={{ type: props.route.params.type, }} />
            <Stack.Screen name="Details" component={ContentDetailScreen} />
        </Stack.Navigator>
    );
}

export default StackNavigation;