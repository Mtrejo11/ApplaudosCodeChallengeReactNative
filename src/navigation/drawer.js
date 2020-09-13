import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainContentScreen from '../screens/main_content';
import StackNavigation from "./stack";
import FavoritesNavigation from "./favorites";

const Drawer = createDrawerNavigator();

export default DrawerNavigationMenu = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Anime">
                <Drawer.Screen name="Anime" component={StackNavigation} initialParams={{ type: 'anime' }} />
                <Drawer.Screen name="Manga" component={StackNavigation} initialParams={{ type: 'manga', }} />
                <Drawer.Screen name="Favorites" component={FavoritesNavigation} initialParams={{ type: 'manga', }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}