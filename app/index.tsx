import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'

const Page = () => {
    const router = useRouter();
    const { user } = useAuth();

    /* useEffect(() => {
        if (user) {
            router.push('/(tabs)')
        } else {
            setTimeout(() => {
                router.push('/(auth)/welcome')
            }, 2000)
        }
    }, []) */

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                resizeMode='contain'
                source={require('@/assets/images/splashImage.png')}
            />
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral900,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
    }
})