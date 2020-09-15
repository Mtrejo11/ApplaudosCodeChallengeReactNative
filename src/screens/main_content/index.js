import React, { Component, useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
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

// Redux actions
import { GET_CATEGORIES } from "../../states/actions";

//API calls
import { getCategories, getContentList } from "../../api/requests";

//Components
import CategorySection from '../../components/category'
import TitleCard from "../../components/title_card";
import { SearchBar } from "react-native-elements";
import Spinner from "react-native-spinkit";

//Images
import menuIcon from '../../assets/menu.png'

const screenHeight = Dimensions.get('window').height


const MainContentScreen = props => {
    const { animeCategories } = useSelector(state => ({ animeCategories: state.classification.animeCategories }))
    const { mangaCategories } = useSelector(state => ({ mangaCategories: state.classification.mangaCategories }))
    const { anime } = useSelector(state => ({ anime: state.classification.anime }))
    const { manga } = useSelector(state => ({ manga: state.classification.manga }))

    const [changeFlag, setChangeFlag] = useState(false)
    const [animationValue, setAnimationValue] = useState(new Animated.Value(0))
    const [viewState, setViewState] = useState(true)
    const [loadingContent, setLoadingContent] = useState(true)
    const [search, setSearch] = useState('')
    const [categoriesStep, setCategoriesStep] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const [fetchingApi, setFetchingApi] = useState(true)


    useEffect(() => {
        fetchCategories()
    }, [])


    const fetchCategories = async () => {
        if (fetchingApi) {
            setFetchingApi(false)
            const categories = await getCategories(categoriesStep);
            if (categories.status) {
                const currentCategories = categoriesStep === 0 ? [] : props.route.params.type === 'anime' ? animeCategories : mangaCategories;
                categories.message.data.forEach(async category => {
                    currentCategories.push({
                        categoryId: category.id,
                        reference: category.links.self,
                        title: category.attributes.title,
                        content: [],
                        relationships: category.relationships,
                    });
                });
                props.dispatch({
                    type: GET_CATEGORIES,
                    payload: {
                        [props.route.params.type === 'anime' ? 'animeCategories' : 'mangaCategories']: currentCategories
                    }
                });
                await loadCategoryContent()
                setLoadingContent(false)
            } else {
                ToastAndroid.show("Couldn't connect to the server", ToastAndroid.SHORT);
                await loadCategoryContent();
                setLoadingContent(false)
            }
        }
    }


    const _navigateDetailHandler = (data) => {
        props.navigation.navigate('Details', { content: data })
    }


    const loadCategoryContent = async () => {
        if (fetchingApi) {

            const categoriesSaved = props.route.params.type === 'anime' ? animeCategories : mangaCategories
            let fullContent = []
            if (categoriesSaved.length > 0) {
                const steps = categoriesStep
                for (let index = categoriesStep; index < steps + 5; index++) {
                    const categoryContent = await getContentList(categoriesSaved[index].reference, props.route.params.type)
                    if (categoryContent.status) {
                        categoriesSaved[index].content = categoryContent.message.data;
                        fullContent = fullContent.concat(categoriesSaved[index].content);
                        props.dispatch({
                            type: GET_CATEGORIES,
                            payload: {
                                [props.route.params.type === 'anime' ? 'animeCategories' : 'mangaCategories']: categoriesSaved,
                                [props.route.params.type]: fullContent
                            }
                        });
                        setChangeFlag(!changeFlag)
                    }

                }
                setCategoriesStep(categoriesStep + 5)
                setFetchingApi(true)
            }
        }

    }

    const toggleAnimation = (opt) => {

        if (opt) {
            Animated.timing(animationValue, {
                toValue: screenHeight,
                duration: 500,
                useNativeDriver: false
            }).start(() => {
                setViewState(false)
            });
        }
        else {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }).start(() => {
                setViewState(true)
                setSearch('')
            }
            );
        }
    }

    const _searchHandler = (search) => {
        const content = props.route.params.type === 'anime' ? anime : manga
        let foundTitles = [];
        content.forEach(title => {
            let tmp = title.attributes.canonicalTitle.indexOf(search)
            if (tmp !== -1 && search !== '') {
                foundTitles.push(title);
            }
        });
        setSearch(search)
        setSearchResults(foundTitles)
    };

    const _drawerHandler = () => {
        props.navigation.openDrawer()
    }

    const _scrollEndHandler = () => {
        fetchCategories();
    }
    const animatedStyle = {
        width: '100%',
        height: animationValue
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ paddingHorizontal: 10 }}>
                <View style={styles.topContainer}>
                    <TouchableOpacity style={styles.menuButton} onPress={_drawerHandler}>
                        <Image source={menuIcon} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                    <SearchBar
                        placeholder="Search"
                        platform='ios'
                        onChangeText={_searchHandler}
                        inputStyle={{ color: '#FCFCFC' }}
                        cancelIcon={null}
                        value={search}
                        containerStyle={{ backgroundColor: 'trasnparent', padding: 0, width: '85%', height: 40 }}
                        inputContainerStyle={{ backgroundColor: 'trasnparent', margin: 0, height: 30 }}
                        onFocus={() => toggleAnimation(true)}
                        onCancel={() => toggleAnimation(false)}
                    />

                </View>
                <Animated.View style={[styles.animatedBox, animatedStyle]}>
                    {
                        !viewState ?
                            <>
                                {
                                    searchResults.length > 0 ? null : <Text style={styles.searchText}>No results</Text>
                                }
                                <FlatList
                                    data={searchResults}
                                    extraData={searchResults}
                                    style={{ width: '100%', marginTop: 5 }}
                                    keyExtractor={(element, index) => `${element.id}-${index}`}
                                    numColumns={3}
                                    renderItem={title => <TitleCard title={title.item} navigationHandler={_navigateDetailHandler} />}
                                />
                            </>
                            : null
                    }
                </Animated.View>
            </View>
            <ScrollView style={{ paddingHorizontal: 10 }} showsVerticalScrollIndicator={false} onScrollEndDrag={_scrollEndHandler} >
                {
                    loadingContent ?
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Spinner style={{ marginTop: '40%' }} isVisible={true} size={200} type={'Bounce'} color={'#D2F898'} />
                        </View>
                        :
                        <>
                            {props.route.params.type === 'anime' ?
                                animeCategories.length > 0 ?
                                    animeCategories.map(category =>
                                        <CategorySection key={category.title + category.categoryId} category={category} dataFlag={changeFlag} navigationHandler={_navigateDetailHandler} />
                                    ) :
                                    <>
                                        <Text style={styles.failureText}>Could't retrieve {props.route.params.type} information</Text>
                                        <TouchableOpacity onPress={fetchCategories}>
                                            <Text style={[styles.failureText, { color: '#F6F930', marginTop: 5 }]}>Retry</Text>
                                        </TouchableOpacity>
                                    </>
                                :
                                mangaCategories.length > 0 ?
                                    mangaCategories.map(category =>
                                        <CategorySection key={category.title + category.categoryId} category={category} dataFlag={changeFlag} navigationHandler={_navigateDetailHandler} />
                                    ) :
                                    <>
                                        <Text style={styles.failureText}>Could't retrieve {props.route.params.type} information</Text>
                                        <TouchableOpacity onPress={fetchCategories}>
                                            <Text style={[styles.failureText, { color: '#F6F930', marginTop: 5 }]}>Retry</Text>
                                        </TouchableOpacity>
                                    </>
                            }
                            {
                                fetchingApi ? <ActivityIndicator size="small" color="#D2F898" style={{ marginTop: 20 }} /> : null
                            }

                        </>
                }
            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#2F2F2F',
        padding: 35,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 10,
        backgroundColor: '#2F2F2F'
    },
    animatedBox:
    {
        marginTop: 25,
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