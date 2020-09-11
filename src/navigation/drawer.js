import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainContentScreen from '../screens/main_content';

function HomeScreen({ navigation, route }) {
    const array = ['hola', 'mundo']
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {
                array.map((element, index) =>
                    <Text key={element + index}>{element}</Text>
                )
            }
            <Button
                onPress={() => navigation.navigate('Notifications')}
                title="Go to notifications"
            />
        </View>
    );
}

function NotificationsScreen({ navigation, route }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{route.params.type}</Text>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

const Drawer = createDrawerNavigator();

export default DrawerNavigationMenu = () => {
    return (

        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={MainContentScreen} initialParams={{ type: 'manga', }} />
                <Drawer.Screen name="Notifications" component={NotificationsScreen} initialParams={{ type: 'anime' }} />
            </Drawer.Navigator>
        </NavigationContainer>

    );
}