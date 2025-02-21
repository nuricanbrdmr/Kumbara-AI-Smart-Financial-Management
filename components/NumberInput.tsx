import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'

const NumberInput = (props: InputProps) => {
    const handleTextChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        props.onChangeText && props.onChangeText(numericValue)
    }

    return (
        <View style={[styles.container, props.containerStyle]}>
            {props.icon && props.icon}
            <TextInput
                style={[styles.input, props.inputStyle]}
                placeholder={props.placeholder}
                placeholderTextColor={colors.neutral400}
                keyboardType="numeric"
                inputMode="numeric"
                onChangeText={handleTextChange}
                ref={props.inputRef}
                {...props}
            />
        </View>
    )
}

export default NumberInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,
        gap: spacingX._10
    },
    input: {
        flex: 1,
        color: colors.white,
        fontSize: verticalScale(14),
    }
})
