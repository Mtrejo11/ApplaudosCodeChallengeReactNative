import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from "react-native";
import { Image } from "react-native-elements";

const ContentContainer = (props) => {
    const { content } = props;
    return (
        <TouchableOpacity style={styles.categoryCard} onPress={() => props.navigationHandler(content)}>
            <ImageBackground source={{ uri: content.attributes.posterImage ? content.attributes.posterImage.tiny : 'https://www.embarcadero.com/images/error.png' }} style={{ height: 150, resizeMode: 'contain', borderRadius: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text numberOfLines={2} style={styles.titleText} >{content.attributes.canonicalTitle}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}


const CategorySection = (props) => {
    const { category } = props;
    return (
        category.content.length > 0 ?
            <View style={styles.sectionContainer}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <FlatList
                    data={category.content}
                    horizontal
                    extraData={props.dataFlag}
                    keyExtractor={(element) => element.attributes.slug}
                    renderItem={(element) => <ContentContainer content={element.item} navigationHandler={props.navigationHandler} />}
                />
            </View> : null
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 15
    },
    categoryTitle: {
        color: '#FCFCFC',
        marginBottom: 8,
    },
    categoryCard: {
        marginRight: 15,
        width: 100,
    },
    titleText: {
        textAlign: 'center',
        fontSize: 10,
        color: '#FFFFFF',
        backgroundColor: '#2F2F2F',
        maxWidth: '90%',
        paddingHorizontal: 5
    }

})


export default CategorySection