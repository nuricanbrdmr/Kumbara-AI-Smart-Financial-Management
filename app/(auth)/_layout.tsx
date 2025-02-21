import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { colors } from '@/constants/theme'

const _layout = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor={colors.neutral900} barStyle="light-content" />
            <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
    )
}

export default _layout

const styles = StyleSheet.create({})