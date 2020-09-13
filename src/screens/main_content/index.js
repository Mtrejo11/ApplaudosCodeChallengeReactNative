import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Text,
    View,
    Button,
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
        console.log('GETTING CATEGORIES', this.props.route.params.type);
        const categories = await getCategories();
        if (categories.status) {
            const currentCategories = [];
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
                    categories: currentCategories
                }
            });
        } else {
            console.log('SOMETHING WENT WRONG', categories.message);
        }
    }

    getContentCharacters = async () => {
        return 'CHARACTERS'
    }

    _navigateDetailHandler = (data) => {
        this.props.navigation.navigate('Details', { content: data })
    }

    componentDidMount() {
        console.log('DIDMOUNT', this.props.route.params.type);
        this.loadCategoryContent()
    }

    loadCategoryContent = async () => {
        const categoriesSaved = this.props.categories
        let fullContent = []
        categoriesSaved.forEach(async (category, index) => {
            const categoryContent = await getContentList(category.reference, this.props.route.params.type)
            categoriesSaved[index].content = categoryContent.message.data;
            fullContent = fullContent.concat(categoriesSaved[index].content);
            this.props.dispatch({
                type: GET_CATEGORIES,
                payload: {
                    categories: categoriesSaved,
                    [this.props.route.params.type]: fullContent
                }
            });
            this.setState({ changeFlag: !this.state.changeFlag })
        })
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
                foundTitles.push(title)
            }
        });
        this.setState({ search, searchResults: foundTitles, });
    };


    componentWillUnmount() {
        console.log('UMONUNTING COMPONENT', this.props.route.params.type);
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
                        <TouchableOpacity style={styles.menuButton} onPress={() => this.props.navigation.openDrawer()}>
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
                <ScrollView  >
                    {
                        this.props.categories.map(category =>
                            <CategorySection key={category.title + category.categoryId} category={category} dataFlag={this.state.changeFlag} navigationHandler={this._navigateDetailHandler} />
                        )
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
    }

})

const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType,
        categories: state.classification.categories,
        anime: state.classification.anime,
        manga: state.classification.manga,

    }
}

export default connect(mapStateToProps)(MainContentScreen);