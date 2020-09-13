import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const CharacterCard = props => {
    const chapter = props.title.data
    return (
        chapter.attributes.canonicalName ?
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Image source={{ uri: chapter.attributes.image ? chapter.attributes.image.original : 'https://www.embarcadero.com/images/error.png' }} style={{ width: 50, height: 50, marginRight: 25, borderRadius: 1 }} />
                <Text style={styles.listText} >{chapter.attributes.canonicalName}</Text>
            </View> : null
    )
}

export const CharactersTab = (props) => {
    return (
        <View style={styles.mainContainer}>
            {
                props.route.params.characters.map((title, index) => <CharacterCard key={`${index}-`} title={title} />)
            }
        </View>
    )
}


const ChapterCard = props => {
    const chapter = props.title
    // console.log('EACH CHAPTER', chapter);
    return (
        chapter.attributes.canonicalTitle ?
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Text style={styles.listText}>{chapter.attributes.number}. </Text>
                <Text style={styles.listText}>{chapter.attributes.canonicalTitle}</Text>
            </View> : null
    )
}

export const ChaptersTab = (props) => {

    return (
        <View style={styles.mainContainer}>
            {
                props.route.params.chapters.map((title, index) => <ChapterCard key={`${index}-`} title={title} />)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#2F2F2F",
        alignItems: 'flex-start',
        paddingTop: 15
    },
    listText: {
        color: '#FFFFFF',
        marginBottom: 8
    }
})