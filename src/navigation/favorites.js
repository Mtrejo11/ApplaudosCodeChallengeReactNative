import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from "../screens/favorites";
import ContentDetailScreen from "../screens/detail_screen";
const Stack = createStackNavigator();

const StackNavigation = (props) => {
    return (
        <Stack.Navigator initialRouteName="Home" >
            <Stack.Screen name="Home" component={FavoritesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={ContentDetailScreen}  options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default StackNavigation;