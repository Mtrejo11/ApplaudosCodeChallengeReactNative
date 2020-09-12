import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainContentScreen from '../screens/main_content';
import StackNavigation from "./stack";

const Drawer = createDrawerNavigator();

export default DrawerNavigationMenu = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={StackNavigation} initialParams={{ type: 'manga', }} />
                <Drawer.Screen name="Notifications" component={StackNavigation} initialParams={{ type: 'anime' }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}