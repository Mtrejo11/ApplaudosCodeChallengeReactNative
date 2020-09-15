import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
    View,
    Linking,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from "react-native";
import { WebView } from 'react-native-webview';
import YouTube from 'react-native-youtube';

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();


import { getContentData, getEachDetail } from "../../api/requests";
import SectionText from "../../components/section_text";
import { Image, CheckBox, SocialIcon } from "react-native-elements";
import { ADD_FAVORITE, DELETE_FAVORITE } from "../../states/actions";

import { ChaptersTab, CharactersTab } from "../../components/tab_screens";

const MainContentScreen = props => {
    const { favorites } = useSelector(state => ({ favorites: state.classification.favorites }))

    const [characters, setCharacters] = useState([])
    const [chapters, setChapters] = useState([])
    const [genres, setGenres] = useState('')
    const [marked, setMarked] = useState(false)
    const [loadingChapters, setLoadingChapters] = useState(true)
    const [loadingCharacters, setLoadingCharacters] = useState(true)

    useEffect(() => {
        getGenres()
        getCharacters()
        getChapters()
        checkFavorite()

    }, [])


    getCharacters = async () => {
        const { content } = props.route.params
        const characters_result = await getContentData(content.relationships.characters.links.related)
        const charactersDetail = [];
        characters_result.message.data.forEach(async (character, index) => {
            const characterResponse = await getEachDetail(character.relationships.character.links.related);
            charactersDetail.push(characterResponse);
            if (index === characters_result.message.data.length - 1) {
                setCharacters(charactersDetail)
                setLoadingCharacters(false)
            }
        });
    }


    getChapters = async () => {
        const { content } = props.route.params;
        const chapters_result = await getContentData(content.type === "anime" ? content.relationships.episodes.links.related : content.relationships.chapters.links.related);
        setChapters(chapters_result.message.data)
        setLoadingChapters(false)

    }

    getGenres = async () => {
        const { content } = props.route.params
        const genres_result = await getContentData(content.relationships.genres.links.related)
        if (genres_result.status) {
            const genresBuilt = genres_result.message.data.reduce((genreString, currentGenre, index) => {
                return genreString + currentGenre.attributes.name + (index === genres_result.message.data.length - 1 ? "" : ", ")
            }, "")
            setGenres(genresBuilt)
        }
    }

    checkFavorite = () => {
        const { content } = props.route.params
        const index = favorites.findIndex(title => title.id === content.id);
        if (index !== -1) setMarked(true)
        else setMarked(false)
    }

    _favoriteHandler = () => {
        if (!marked) {
            addFavorite()
        } else {
            removeFavorite()
        }
        checkFavorite()
    }


    addFavorite = () => {
        const { content } = props.route.params;
        const currentFavorites = props.favorites;
        currentFavorites.push(content);
        props.dispatch({
            type: ADD_FAVORITE,
            payload: {
                favorites: currentFavorites,
                initialType: `added: ${content.attributes.canonicalTitle}`

            }
        })
    }

    removeFavorite = () => {
        const { content } = props.route.params;
        const currentFavorites = favorites;
        const index = currentFavorites.findIndex(title => title.id === content.id);
        currentFavorites.splice(index, 1);
        props.dispatch({
            type: DELETE_FAVORITE,
            payload: {
                favorites: currentFavorites,
                initialType: `removed: ${content.attributes.canonicalTitle}`
            }
        })
    }

    _watchYoutubeHandler = async (id) => {
        const url = `https://www.youtube.com/watch?v=${id}`
        await Linking.openURL(url);
    }


    const { content } = props.route.params;
    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView>
                <View style={styles.row}>
                    <View style={styles.posterContainer}>
                        <Image source={{ uri: content.attributes.posterImage ? content.attributes.posterImage.small : 'https://www.embarcadero.com/images/error.png' }} style={{ height: 170, resizeMode: 'cover', marginBottom: 15, }} />
                    </View>
                    <View style={styles.generalInfoContainer}>
                        <SectionText mainText="Main Title" secondaryText={content.attributes.titles[[Object.keys(content.attributes.titles)[0]]]} />
                        <SectionText mainText="Canonical Title" secondaryText={content.attributes.canonicalTitle} />
                        <SectionText mainText="Type" secondaryText={`${content.type}, ${content.type === "anime" ? `${content.attributes.episodeCount} episodes` : `${content.attributes.chapterCount} chapters`}`} />
                        <SectionText mainText="Year" secondaryText={`${content.attributes.startDate} till ${content.attributes.endDate}`} />
                    </View>
                </View>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <SectionText mainText="Genres" secondaryText={genres} />
                    <CheckBox
                        center
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                        onPress={_favoriteHandler}
                        iconRight
                        textStyle={{ color: '#FFFFFF', fontWeight: '100', fontSize: 12 }}
                        checkedIcon='heart'
                        uncheckedIcon='heart-o'
                        checkedColor='#F6F930'
                        checked={marked}
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.midDetailContainer}>
                        <SectionText mainText="Average Rating" secondaryText={content.attributes.averageRating} />
                        <SectionText mainText={content.type === "anime" ? "Episode Duration" : "Chapter Count"} secondaryText={content.type === "anime" ? content.attributes.episodeLength : content.attributes.chapterCount} />
                    </View>
                    <View style={styles.midDetailContainer}>
                        <SectionText mainText="Age Rating" secondaryText={content.attributes.ageRating} />
                        <SectionText mainText="Airing Status" secondaryText={content.attributes.status} />
                    </View>
                </View>
                <SectionText mainText="Synopsis" secondaryText={content.attributes.synopsis} />
                {
                    content.attributes.youtubeVideoId ?
                        <View style={{ width: '100%', marginVertical: 20 }}>
                            <SocialIcon
                                title='Watch on YotuTube'
                                button
                                type='youtube'
                                onPress={() => _watchYoutubeHandler(content.attributes.youtubeVideoId)}
                                style={{ width: '60%', marginBottom: 20, alignSelf: 'center' }}
                            />
                            <YouTube
                                videoId={content.attributes.youtubeVideoId}
                                play
                                fullscreen={false}
                                loop
                                style={{ alignSelf: 'stretch', height: 300 }}
                            />
                        </View> : null
                }
                {
                    loadingChapters || loadingCharacters ? null :
                        <Tab.Navigator
                            sceneContainerStyle={{ backgroundColor: '#2F2F2F', maxHeight: '100%' }}
                            tabBarOptions={{
                                style: { backgroundColor: '#2F2F2F' },
                                activeTintColor: '#FFFFFF',
                                inactiveTintColor: 'gray',
                                indicatorStyle: { backgroundColor: '#F6F930' }
                            }} >
                            <Tab.Screen name={content.type === 'anime' ? 'Episodes' : 'Chapters'} component={ChaptersTab} initialParams={{ chapters: chapters }} />
                            <Tab.Screen name="Characters" component={CharactersTab} initialParams={{ characters: characters }} />
                        </Tab.Navigator>
                }
            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#2F2F2F",
        padding: 15
    },
    row: {
        width: "100%",
        flexDirection: "row"
    },
    generalInfoContainer: {
        width: "60%",
        paddingHorizontal: 20
    },
    midDetailContainer: {
        width: "50%"
    },
    posterContainer: {
        width: '40%',
    }
})

const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType,
        categories: state.classification.categories,
        favorites: state.classification.favorites,


    }
}

export default connect(mapStateToProps)(MainContentScreen);