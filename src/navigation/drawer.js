import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from "./stack";
import FavoritesNavigation from "./favorites";

const Drawer = createDrawerNavigator();

export default DrawerNavigationMenu = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Anime" drawerContentOptions={{ style: { backgroundColor: '#2F2F2F' }, activeTintColor: '#D2F898', inactiveTintColor: '#FCFCFC' }}>
                <Drawer.Screen name="Anime" component={StackNavigation} initialParams={{ type: 'anime' }} />
                <Drawer.Screen name="Manga" component={StackNavigation} initialParams={{ type: 'manga', }} />
                <Drawer.Screen name="Favorites" component={FavoritesNavigation} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}