import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Text,
    View,
    Linking,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from "react-native";
import { WebView } from 'react-native-webview';

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();


import { getContentData, getEachDetail } from "../../api/requests";
import SectionText from "../../components/section_text";
import { Image, CheckBox, SocialIcon } from "react-native-elements";
import { ADD_FAVORITE, DELETE_FAVORITE } from "../../states/actions";

import { ChaptersTab, CharactersTab } from "../../components/tab_screens";


const initialStates = {
    changeFlag: false,
    characters: [],
    chapters: [],
    genres: "",
    marked: false,
    loadingChapters: true,
    loadingCharacters: true,
}

class MainContentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...initialStates
        }
        this.getGenres()
        this.getCharacters()
        this.getChapters()
    }

    componentDidMount() {
        this.checkFavorite()

    }

    getCharacters = async () => {
        const { content } = this.props.route.params
        const characters = await getContentData(content.relationships.characters.links.related)
        const charactersDetail = [];
        characters.message.data.forEach(async (character, index) => {
            const characterResponse = await getEachDetail(character.relationships.character.links.related);
            charactersDetail.push(characterResponse);
            if (index === characters.message.data.length - 1) this.setState({ characters: charactersDetail, loadingCharacters: false });
        });
    }


    getChapters = async () => {
        const { content } = this.props.route.params;
        const chapters = await getContentData(content.type === "anime" ? content.relationships.episodes.links.related : content.relationships.chapters.links.related);
        this.setState({ chapters: chapters.message.data, loadingChapters: false });

    }

    getGenres = async () => {
        const { content } = this.props.route.params
        const genres = await getContentData(content.relationships.genres.links.related)
        if (genres.status) {
            const genresBuilt = genres.message.data.reduce((genreString, currentGenre, index) => {
                return genreString + currentGenre.attributes.name + (index === genres.message.data.length - 1 ? "" : ", ")
            }, "")
            this.setState({ genres: genresBuilt })
        }
    }

    checkFavorite = () => {
        const { content } = this.props.route.params
        const { favorites } = this.props
        const index = favorites.findIndex(title => title.id === content.id);
        if (index !== -1) this.setState({ marked: true })
        else this.setState({ marked: false })
    }

    _favoriteHandler = () => {
        const { content } = this.props.route.params;
        if (!this.state.marked) {
            this.addFavorite()
        } else {
            this.removeFavorite()
        }
        this.checkFavorite()
    }


    addFavorite = () => {
        const { content } = this.props.route.params;
        const currentFavorites = this.props.favorites;
        currentFavorites.push(content);
        this.props.dispatch({
            type: ADD_FAVORITE,
            payload: {
                favorites: currentFavorites,
                initialType: `added: ${content.attributes.canonicalTitle}`

            }
        })
    }

    removeFavorite = () => {
        const { content } = this.props.route.params;
        const currentFavorites = this.props.favorites;
        const index = currentFavorites.findIndex(title => title.id === content.id);
        currentFavorites.splice(index, 1);
        this.props.dispatch({
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

    render() {
        const { content } = this.props.route.params;
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
                        <SectionText mainText="Genres" secondaryText={this.state.genres} />
                        <CheckBox
                            center
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                            onPress={this._favoriteHandler}
                            iconRight
                            textStyle={{ color: '#FFFFFF', fontWeight: '100', fontSize: 12 }}
                            checkedIcon='heart'
                            uncheckedIcon='heart-o'
                            checkedColor='#F6F930'
                            checked={this.state.marked}
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
                            <View style={{ width: '100%', height: 300, marginVertical: 20 }}>
                                <SocialIcon
                                    title='Watch on YotuTube'
                                    button
                                    type='youtube'
                                    onPress={() => this._watchYoutubeHandler(content.attributes.youtubeVideoId)}
                                    style={{ width: '60%', marginBottom: 20, alignSelf: 'center' }}
                                />
                                <WebView
                                    javaScriptEnabled={true}
                                    source={{ uri: `https://www.youtube.com/watch?v=${content.attributes.youtubeVideoId}` }}
                                />
                            </View> : null
                    }
                    {
                        this.state.loadingChapters || this.state.loadingCharacters ? null :
                            <Tab.Navigator
                                sceneContainerStyle={{ backgroundColor: '#2F2F2F', maxHeight: '100%' }}
                                tabBarOptions={{
                                    style: { backgroundColor: '#2F2F2F' },
                                    activeTintColor: '#FFFFFF',
                                    inactiveTintColor: 'gray',
                                    indicatorStyle: { backgroundColor: '#F6F930' }
                                }} >
                                <Tab.Screen name={content.type === 'anime' ? 'Episodes' : 'Chapters'} component={ChaptersTab} initialParams={{ chapters: this.state.chapters }} />
                                <Tab.Screen name="Characters" component={CharactersTab} initialParams={{ characters: this.state.characters }} />
                            </Tab.Navigator>
                    }
                </ScrollView>
            </SafeAreaView>
        )
    }
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