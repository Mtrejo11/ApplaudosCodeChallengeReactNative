import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainContentScreen from "../screens/main_content";
import ContentDetailScreen from "../screens/detail_screen";
const Stack = createStackNavigator();

const StackNavigation = (props) => {
    return (
        <Stack.Navigator initialRouteName="Home" >
            <Stack.Screen name="Home" component={MainContentScreen} initialParams={{ type: props.route.params.type, }} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={ContentDetailScreen}  options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default StackNavigation;