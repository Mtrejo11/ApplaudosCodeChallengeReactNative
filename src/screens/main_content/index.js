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
import { GET_CATEGORIES } from "../../states/actions";
import { getCategories, getContentList } from "../../api/requests";

import CategorySection from '../../components/category'

const initialStates = {
    changeFlag: false,
}
class MainContentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...initialStates
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
        categoriesSaved.forEach(async (category, index) => {
            const categoryContent = await getContentList(category.reference, this.props.route.params.type)
            categoriesSaved[index].content = categoryContent.message.data
            this.props.dispatch({
                type: GET_CATEGORIES,
                payload: {
                    categories: categoriesSaved
                }
            });
            this.setState({ changeFlag: !this.state.changeFlag })
        })
    }


    componentWillUnmount() {
        console.log('UMONUNTING COMPONENT', this.props.route.params.type);
    }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView>
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

})

const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType,
        categories: state.classification.categories

    }
}

export default connect(mapStateToProps)(MainContentScreen);