import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import Typo from '@/components/Typo'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
const Welcome = () => {
    const router = useRouter()
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* login button & image */}
                <View>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login')}>
                        <Typo fontWeight={"400"}>Giriş Yap</Typo>
                    </TouchableOpacity>

                    <Animated.Image
                        entering={FadeIn.duration(1000)}
                        source={require('@/assets/images/welcome.png')}
                        style={styles.welcomeImage}
                        resizeMode='contain'
                    />
                </View>

                {/* footer */}
                <Animated.View
                    entering={FadeInDown.duration(1500).springify().damping(12)}
                    style={styles.footer}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Typo size={30} fontWeight={"700"}>
                            Finansal Durumun
                        </Typo>
                        <Typo size={30} fontWeight={"700"}>
                            Her Zaman Kontrol Altında
                        </Typo>
                    </View>

                    <Animated.View
                        entering={FadeInDown.duration(1500).delay(100).springify().damping(12)}
                        style={{ alignItems: 'center', gap: 2 }}
                    >
                        <Typo size={16} color={colors.textLight}>
                            Gelecekte daha iyi bir yaşam için
                        </Typo>
                        <Typo size={16} color={colors.textLight}>
                            finanslarını şimdiden yönet!
                        </Typo>
                    </Animated.View>
                    {/* button */}
                    <Animated.View
                        entering={FadeInDown.duration(1500).delay(200).springify().damping(12)}
                        style={styles.buttonContainer}
                    >
                        <Button onPress={() => router.push('/(auth)/register')}>
                            <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
                                Kayıt Ol
                            </Typo>
                        </Button>
                    </Animated.View>
                </Animated.View>

            </View>
        </ScreenWrapper>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: spacingY._7
    },
    welcomeImage: {
        width: '100%',
        height: verticalScale(300),
        alignSelf: 'center',
        marginTop: verticalScale(100)
    },
    loginButton: {
        alignSelf: 'flex-end',
        marginRight: spacingX._20
    },
    footer: {
        backgroundColor: colors.neutral900,
        alignItems: 'center',
        paddingTop: verticalScale(30),
        paddingBottom: verticalScale(45),
        gap: spacingY._20,
        shadowColor: "white",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 10
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: spacingX._25
    }
})