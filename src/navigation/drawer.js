import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainContentScreen from '../screens/main_content';


const Drawer = createDrawerNavigator();

export default DrawerNavigationMenu = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={MainContentScreen} initialParams={{ type: 'manga', }} />
                <Drawer.Screen name="Notifications" component={MainContentScreen} initialParams={{ type: 'anime' }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}