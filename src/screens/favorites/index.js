import React from "react";
import { connect } from "react-redux";
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
} from "react-native";
import TitleCard from "../../components/title_card";
import menuIcon from '../../assets/menu.png'


const FavoritesScreen = props => {
    const _navigateDetailHandler = (data) => {
        props.navigation.navigate('Details', { content: data })
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ marginBottom: 10 }}>
                <View style={styles.topContainer}>
                    <TouchableOpacity style={styles.menuButton} onPress={() => props.navigation.openDrawer()}>
                        <Image source={menuIcon} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                </View>

            </View>
            {
                props.favorites.length > 0 ? <>
                    <Text style={[styles.searchText, { fontSize: 12 }]}>Recently {props.initialType}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            props.favorites.map((title, index) => <TitleCard title={title} key={`${title.id}-${index}`} navigationHandler={_navigateDetailHandler} fav={true} />)
                        }
                    </View>
                </>
                    : <Text style={[styles.searchText, { marginTop: 60, textAlign: 'center' }]}>No favorite content found.</Text>
            }
        </SafeAreaView>
    )

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

export default connect(mapStateToProps)(FavoritesScreen);