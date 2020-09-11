import React from "react";
import { View, Text, FlatList } from "react-native";


const ContentContainer = (props) => {
    const { content } = props
    return (
        <View style={{ marginRight: 5 }}>

            <Text >{content.attributes.canonicalTitle}</Text>
        </View>
    )
}


const CategorySection = (props) => {
    const { category } = props

    return (
        <View>
            <Text>{category.title}</Text>
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

export default CategorySection