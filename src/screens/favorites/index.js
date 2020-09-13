import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
} from "react-native";
import TitleCard from "../../components/title_card";
import menuIcon from '../../assets/menu.png'

const initialStates = {}

class MainContentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...initialStates,

        }
    }

    _navigateDetailHandler = (data) => {
        this.props.navigation.navigate('Details', { content: data })
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ marginBottom: 10 }}>
                    <View style={styles.topContainer}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.openDrawer()}>
                            <Image source={menuIcon} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                    </View>

                </View>
                {
                    this.props.favorites.length > 0 ? <>
                        <Text style={[styles.searchText, { fontSize: 12 }]}>Recently {this.props.initialType}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                this.props.favorites.map((title, index) => <TitleCard title={title} key={`${title.id}-${index}`} navigationHandler={this._navigateDetailHandler} fav={true} />)
                            }
                        </View>
                    </>
                        : <Text style={[styles.searchText, { marginTop: 60, textAlign: 'center' }]}>No favorite content found.</Text>
                }
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
    topContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: 5,
        backgroundColor: '#2F2F2F'
    },
    menuButton: {
        width: '15%',
        height: 40,
        justifyContent: 'center'
    },
    searchText: {
        color: '#FFFFFF',
    }

})

const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType,
        categories: state.classification.categories,
        anime: state.classification.anime,
        manga: state.classification.manga,
        favorites: state.classification.favorites,

    }
}

export default connect(mapStateToProps)(MainContentScreen);