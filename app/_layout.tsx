import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/contexts/authContext'
import { enableScreens } from 'react-native-screens';
import { colors } from '@/constants/theme';

enableScreens();

const _layout = () => {
    return (
        <AuthProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor={colors.neutral900} barStyle="light-content" />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name='(modals)/profileModal' options={{ presentation: 'modal' }} />
                    <Stack.Screen name='(modals)/walletModal' options={{ presentation: 'modal' }} />
                    <Stack.Screen name='(modals)/transactionModal' options={{ presentation: 'modal' }} />
                    <Stack.Screen name='(modals)/aiModal' options={{ presentation: 'modal' }} />
                    <Stack.Screen name='(modals)/searchModal' options={{ presentation: 'modal' }} />
                </Stack>
            </SafeAreaView>
        </AuthProvider>
    )
}

export default _layout

const styles = StyleSheet.create({})