import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import React from 'react'
import { ModalWrapperProps } from '@/types'
import { colors, spacingY } from '@/constants/theme'

const isIOS = Platform.OS === 'ios';

const ModalWrapper = ({
    style,
    children,
    bg = colors.neutral900
}: ModalWrapperProps) => {
    return (
        <View style={[styles.container, { backgroundColor: bg }, style]}>
            <StatusBar translucent backgroundColor={colors.neutral900} barStyle="light-content" />

            {children}
        </View>
    )
}

export default ModalWrapper

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: isIOS ? spacingY._15 : 60,
        paddingBottom: isIOS ? spacingY._20 : spacingY._10,
    }
})