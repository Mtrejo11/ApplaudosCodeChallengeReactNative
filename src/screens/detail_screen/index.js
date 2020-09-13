import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Text,
    View,
    Button,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();


import { getContentData, getEachDetail } from "../../api/requests";
import SectionText from "../../components/section_text";
import { Image, CheckBox } from "react-native-elements";
import { ADD_FAVORITE, DELETE_FAVORITE } from "../../states/actions";




const initialStates = {
    changeFlag: false,
    characters: [],
    chapters: [],
    genres: "",
    marked: false,
}

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Home!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Settings!</Text>
        </View>
    );
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
            if (index === characters.message.data.length - 1) this.setState({ characters: charactersDetail });
        });
    }


    getChapters = async () => {
        const { content } = this.props.route.params;
        const chapters = await getContentData(content.type === "anime" ? content.relationships.episodes.links.related : content.relationships.chapters.links.related);
        const chaptersDetail = [];
        chapters.message.data.forEach(async (chapter, index) => {
            const chaptersResponse = await getEachDetail(content.type === 'anime' ? chapter.relationships.media.links.related : chapter.relationships[content.type].links.related);
            chaptersDetail.push(chaptersResponse);
            if (index === chapters.message.data.length - 1) this.setState({ chapters: chaptersDetail });
        });
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
        const index = favorites[content.type].findIndex(title => title.id === content.id);
        if (index !== -1) this.setState({ marked: true })
        else this.setState({ marked: false })
    }

    _favoriteHandler = () => {
        const { content } = this.props.route.params;
        if (!this.state.marked) {
            this.props.dispatch({
                type: ADD_FAVORITE,
                payload: {
                    type: content.type,
                    title: content,
                }
            })
        } else {
            this.props.dispatch({
                type: DELETE_FAVORITE,
                payload: {
                    type: content.type,
                    title: content,
                }
            })
        }
        this.checkFavorite()
    }

    render() {
        const { content } = this.props.route.params;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView>
                    <View style={styles.row}>
                        <View style={styles.posterContainer}>
                            <Image source={{ uri: content.attributes.posterImage.small }} style={{ height: 170, resizeMode: 'cover', marginBottom: 15, }} />
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
                    <Tab.Navigator
                        tabBarOptions={{
                            style: { backgroundColor: 'transparent' },
                            activeTintColor: '#FFFFFF',
                            inactiveTintColor: 'gray',
                            indicatorStyle: { backgroundColor: '#F6F930' }
                        }} >
                        <Tab.Screen name={content.type === 'anime' ? 'Episodes' : 'Chapters'} component={HomeScreen} />
                        <Tab.Screen name="Characters" component={SettingsScreen} />
                    </Tab.Navigator>
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