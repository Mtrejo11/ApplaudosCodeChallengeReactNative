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
import { getContentData, getEachCharacter } from "../../api/requests";
const initialStates = {
    changeFlag: false,
    characters: [],
    chapters: [],
}
class MainContentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...initialStates
        }
        this.getCharacters()
        this.getChapters()
    }

    getCharacters = async () => {
        const { content } = this.props.route.params
        const characters = await getContentData(content.relationships.characters.links.related)
        const charactersDetail = [];
        characters.message.data.forEach(async (character, index) => {
            const characterResponse = await getEachCharacter(character.relationships.character.links.related);
            charactersDetail.push(characterResponse);
            if (index === characters.message.data.length - 1) this.setState({ characters: charactersDetail });
        });
    }

    getChapters = async () => {
        const { content } = this.props.route.params
        console.log('TYPE', content.type);
        const chapters = await getContentData(content.type === 'anime' ? content.relationships.episodes.links.related : content.relationships.chapters.links.related)
        console.log('CHAPTERS', chapters);
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView>
                    <Text>HELLO WORLD</Text>
                    {
                        this.state.characters.map((element, index) => (
                            <Text key={index.toString()}>Hola mundo</Text>
                        ))
                    }
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#2F2F2F',
        padding: 15
    },

})

const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType,
        categories: state.classification.categories

    }
}

export default connect(mapStateToProps)(MainContentScreen);