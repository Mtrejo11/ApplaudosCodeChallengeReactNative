import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";

const TitleCard = props => {
    const { title } = props
    return (
        <TouchableOpacity style={styles.outterContainer} onPress={() => props.navigationHandler(title)}>
            <ImageBackground source={{ uri: title.attributes.posterImage.tiny }} style={styles.imageContainer} imageStyle={{ resizeMode: 'cover' }}>
                <Text numberOfLines={2} style={styles.titleText}>{title.attributes.canonicalTitle}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    outterContainer: {
        padding: 5,
        minWidth: '33%',
        maxWidth: '33%',
        borderStyle: 'solid',
    },
    imageContainer: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    titleText: {
        maxWidth: '90%',
        backgroundColor: '#2F2F2F',
        fontSize: 10,
        color: '#FFFFFF',
        textAlign: 'center',
        paddingHorizontal: 5
    }
})

export default TitleCard