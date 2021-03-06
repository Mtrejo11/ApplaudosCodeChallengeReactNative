import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

const SectionText = props => {
    return (
        <View>
            <Text style={styles.mainText}>{props.mainText}</Text>
            <Text style={styles.secondaryText}>{props.secondaryText ? props.secondaryText : 'N/E'}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    mainText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    secondaryText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'justify'
    }

})
export default SectionText