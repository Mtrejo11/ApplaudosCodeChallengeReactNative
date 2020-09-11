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

class MainContentScreen extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Text>Main Screen {this.props.initialType}</Text>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        initialType: state.classification.initialType
    }
}

export default connect(mapStateToProps)(MainContentScreen);