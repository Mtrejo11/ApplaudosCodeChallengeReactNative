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
    SafeAreaView,
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
        const categories = await getCategories();
        if (categories.status) {
            const currentCategories = [];
            categories.message.data.forEach(async category => {
                currentCategories.push({
                    categoryId: category.id,
                    reference: category.links.self,
                    title: category.attributes.title,
                    content: []
                });
            });
            this.props.dispatch({
                type: GET_CATEGORIES,
                payload: {
                    categories: currentCategories
                }
            });
            this.loadCategoryContent()
        } else {
            console.log('SOMETHING WENT WRONG', categories.message);
        }
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

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Text>Main Screen {this.props.initialType}</Text>
                {
                    this.props.categories.map(category =>
                        <CategorySection key={category.title + category.categoryId} category={category} dataFlag={this.state.changeFlag} />
                    )
                }
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType,
        categories: state.classification.categories

    }
}

export default connect(mapStateToProps)(MainContentScreen);