import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

const SectionText = props => {
    console.log('CURRENY PROPS', props);
    return (
        <>
            <Text style={styles.mainText}>{props.mainText}</Text>
            <Text style={styles.secondaryText}>{props.secondaryText ? props.secondaryText : 'N/E'}</Text>
        </>
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
    }

})
export default SectionText