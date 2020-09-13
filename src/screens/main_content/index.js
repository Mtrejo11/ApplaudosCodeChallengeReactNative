import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Text,
    View,
    ToastAndroid,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    StyleSheet,
    SafeAreaView,
    ScrollView, Image, Dimensions
} from "react-native";
import { GET_CATEGORIES } from "../../states/actions";
import { getCategories, getContentList } from "../../api/requests";

import CategorySection from '../../components/category'
import TitleCard from "../../components/title_card";
import { SearchBar } from "react-native-elements";
import menuIcon from '../../assets/menu.png'
import clearIcon from '../../assets/clear_filter.png'


const screenHeight = Dimensions.get('window').height

const initialStates = {
    changeFlag: false,
    search: '',
    searchResults: [],
    categoriesStep: 0,
    loadingContent: true,
    fetchingApi: false
}

class MainContentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...initialStates,
            animationValue: new Animated.Value(0),
            viewState: true


        }
        this.getCategories()
    }

    getCategories = async () => {
        if (!this.state.fetchingApi) {
            const categories = await getCategories(this.state.categoriesStep);
            if (categories.status) {
                const currentCategories = this.state.categoriesStep === 0 ? [] : this.props.route.params.type === 'anime' ? this.props.animeCategories : this.props.mangaCategories;
                categories.message.data.forEach(async category => {
                    currentCategories.push({
                        categoryId: category.id,
                        reference: category.links.self,
                        title: category.attributes.title,
                        content: [],
                        relationships: category.relationships,
                    });
                });
                this.props.dispatch({
                    type: GET_CATEGORIES,
                    payload: {
                        [this.props.route.params.type === 'anime' ? 'animeCategories' : 'mangaCategories']: currentCategories
                    }
                });
                await this.loadCategoryContent()
                this.setState({ categoriesStep: this.state.categoriesStep + 5, loadingContent: false, fetchingApi: false, })
            } else {
                ToastAndroid.show("Couldn't connect to the server", ToastAndroid.SHORT);
                await this.loadCategoryContent();
                this.setState({ loadingContent: false, fetchingApi: false, });

            }
        }
    }

    _navigateDetailHandler = (data) => {
        this.props.navigation.navigate('Details', { content: data })
    }


    loadCategoryContent = async () => {
        const categoriesSaved = this.props.route.params.type === 'anime' ? this.props.animeCategories : this.props.mangaCategories
        console.log('CATEGORIES SAVED', categoriesSaved);
        let fullContent = []
        if (categoriesSaved.length > 0) {
            for (let index = this.state.categoriesStep; index < this.state.categoriesStep + 5; index++) {
                const categoryContent = await getContentList(categoriesSaved[index].reference, this.props.route.params.type)
                if (categoryContent.status) {
                    categoriesSaved[index].content = categoryContent.message.data;
                    fullContent = fullContent.concat(categoriesSaved[index].content);
                    this.props.dispatch({
                        type: GET_CATEGORIES,
                        payload: {
                            [this.props.route.params.type === 'anime' ? 'animeCategories' : 'mangaCategories']: categoriesSaved,
                            [this.props.route.params.type]: fullContent
                        }
                    });
                    this.setState({ changeFlag: !this.state.changeFlag })
                }
                else {
                    console.log('ERROR FETCHING CATEGORY');
                }
            }
        }

    }

    toggleAnimation = (opt) => {

        if (opt) {
            Animated.timing(this.state.animationValue, {
                toValue: screenHeight,
                duration: 500,
                useNativeDriver: false
            }).start(() => {
                this.setState({ viewState: false })
            });
        }
        else {
            Animated.timing(this.state.animationValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }).start(this.setState({ viewState: true, search: '' })
            );
        }
    }

    _searchHandler = (search) => {
        const content = this.props[this.props.route.params.type];
        let foundTitles = [];
        content.forEach(title => {
            let tmp = title.attributes.canonicalTitle.indexOf(search)
            if (tmp !== -1 && search !== '') {
                foundTitles.push(title);
            }
        });
        this.setState({ search, searchResults: foundTitles, });
    };

    _drawerHandler = () => {
        this.props.navigation.openDrawer()
    }

    _scrollEndHandler = () => {
        this.setState({ fetchingApi: true, })
        this.getCategories();
    }

    render() {
        const animatedStyle = {
            width: '100%',
            height: this.state.animationValue
        }
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ marginBottom: 10 }}>
                    <View style={styles.topContainer}>
                        <TouchableOpacity style={styles.menuButton} onPress={this._drawerHandler}>
                            <Image source={menuIcon} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                        <SearchBar
                            placeholder="Search"
                            platform='ios'
                            onChangeText={this._searchHandler}
                            cancelIcon={null}
                            value={this.state.search}
                            containerStyle={{ backgroundColor: 'trasnparent', padding: 0, width: '85%', height: 40 }}
                            inputContainerStyle={{ backgroundColor: 'trasnparent', margin: 0, height: 30 }}
                            onFocus={() => this.toggleAnimation(true)}
                            onCancel={() => this.toggleAnimation(false)}
                        />

                    </View>
                    <Animated.View style={[styles.animatedBox, animatedStyle]}>
                        {
                            !this.state.viewState ?
                                <>
                                    {
                                        this.state.searchResults.length > 0 ? null : <Text style={styles.searchText}>No results</Text>
                                    }
                                    <FlatList
                                        data={this.state.searchResults}
                                        extraData={this.state.searchResults}
                                        style={{ width: '100%', marginTop: 20 }}
                                        keyExtractor={(element, index) => `${element.id}-${index}`}
                                        numColumns={3}
                                        renderItem={title => <TitleCard title={title.item} navigationHandler={this._navigateDetailHandler} />}
                                    />
                                </>
                                : null
                        }
                    </Animated.View>
                </View>
                <ScrollView onScrollEndDrag={this._scrollEndHandler} >
                    {
                        this.state.loadingContent ?
                            <ActivityIndicator size="large" color="#D2F898" style={{ marginTop: '30%' }} /> :
                            <>
                                {this.props.route.params.type === 'anime' ?
                                    this.props.animeCategories.length > 0 ?
                                        this.props.animeCategories.map(category =>
                                            <CategorySection key={category.title + category.categoryId} category={category} dataFlag={this.state.changeFlag} navigationHandler={this._navigateDetailHandler} />
                                        ) :
                                        <>
                                            <Text style={styles.failureText}>Could't retrieve {this.props.route.params.type} information</Text>
                                            <TouchableOpacity onPress={this.getCategories}>
                                                <Text style={[styles.failureText, { color: '#F6F930', marginTop: 5 }]}>Retry</Text>
                                            </TouchableOpacity>
                                        </>
                                    :
                                    this.props.mangaCategories.length > 0 ?
                                        this.props.mangaCategories.map(category =>
                                            <CategorySection key={category.title + category.categoryId} category={category} dataFlag={this.state.changeFlag} navigationHandler={this._navigateDetailHandler} />
                                        ) :
                                        <>
                                            <Text style={styles.failureText}>Could't retrieve {this.props.route.params.type} information</Text>
                                            <TouchableOpacity onPress={this.getCategories}>
                                                <Text style={[styles.failureText, { color: '#F6F930', marginTop: 5 }]}>Retry</Text>
                                            </TouchableOpacity>
                                        </>
                                }
                                {
                                    this.state.fetchingApi ? <ActivityIndicator size="small" color="#D2F898" style={{ marginTop: 20 }} /> : null
                                }

                            </>
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
    topContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'absolute',
        zIndex: 10,
        backgroundColor: '#2F2F2F'
    },
    animatedBox:
    {
        marginTop: 50,
        width: 50,
        height: 0,
        alignItems: 'center'
    },
    menuButton: {
        width: '15%',
        height: 40,
        justifyContent: 'center'
    },
    searchText: {
        color: '#FFFFFF',
    },
    failureText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: '20%',
        color: '#FFFFFF'
    }

})

const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType,
        mangaCategories: state.classification.mangaCategories,
        animeCategories: state.classification.animeCategories,
        anime: state.classification.anime,
        manga: state.classification.manga,

    }
}

export default connect(mapStateToProps)(MainContentScreen);