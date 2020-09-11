import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";

const ContentContainer = (props) => {
    const { content } = props;
    return (
        <TouchableOpacity style={styles.categoryCard}>
            {/* <Text >{content.attributes.canonicalTitle}</Text> */}
            <Image source={{ uri: content.attributes.posterImage.tiny }} style={{ height: 150, resizeMode: 'contain', borderRadius: 1 }}

                PlaceholderContent={<ActivityIndicator />}
            />
        </TouchableOpacity>
    )
}


const CategorySection = (props) => {
    const { category } = props;
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <FlatList
                data={category.content}
                horizontal
                extraData={props.dataFlag}
                keyExtractor={(element) => element.attributes.slug}
                renderItem={(element) => <ContentContainer content={element.item} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 15
    },
    categoryTitle: {
        color: '#FCFCFC'
    },
    categoryCard: {
        marginRight: 15,
        width: 100,
    }

})


export default CategorySection