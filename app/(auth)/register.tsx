import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { At, Lock, User } from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'

const Register = () => {
    const nameRef = useRef("")
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const confirmPasswordRef = useRef("")
    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const { register } = useAuth();

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current || !confirmPasswordRef.current) {
            Alert.alert("Lütfen tüm alanları doldurun!")
            return
        }

        if (passwordRef.current !== confirmPasswordRef.current) {
            Alert.alert("Parolalar eşleşmiyor!")
            return
        }

        setLoading(true);
        const response = await register(emailRef.current, passwordRef.current, nameRef.current);
        setLoading(false);
        if (response.success) {
            router.push("/(tabs)")
        } else {
            Alert.alert(response.msg || "Bir şeyler ters gitti")
        }
    }

    return (
        <ScreenWrapper>
            <ScrollView style={styles.container}>
                {/* <BackButton /> */}

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={"800"}>Hadi</Typo>
                    <Typo size={30} fontWeight={"800"}>Başlayın</Typo>
                </View>

                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter} style={{ paddingTop: 10 }}>
                        Tüm harcamalarınızı takip etmek için bir hesap oluşturun
                    </Typo>
                    <Input
                        placeholder='Adınızı girin'
                        onChangeText={(value) => (nameRef.current = value)}
                        icon={<User size={verticalScale(24)} color={colors.neutral400} />}
                    />
                    <Input
                        placeholder='E-posta adresinizi girin'
                        keyboardType='email-address'
                        onChangeText={(value) => (emailRef.current = value)}
                        icon={<At size={verticalScale(24)} color={colors.neutral400} />}
                    />
                    <Input
                        placeholder='Şifrenizi girin'
                        secureTextEntry={true}
                        onChangeText={(value) => (passwordRef.current = value)}
                        icon={<Lock size={verticalScale(24)} color={colors.neutral400} />}
                    />
                    <Input
                        placeholder='Şifrenizi doğrulayın'
                        secureTextEntry={true}
                        onChangeText={(value) => (confirmPasswordRef.current = value)}
                        icon={<Lock size={verticalScale(24)} color={colors.neutral400} />}
                    />

                    <Button onPress={handleLogin} loading={loading}>
                        <Typo size={20} color={colors.black} fontWeight={"700"}>
                            Kaydolun
                        </Typo>
                    </Button>

                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Typo size={15} color={colors.textLighter}>
                        Zaten bir hesabınız var mı?
                    </Typo>
                    <Pressable onPress={() => router.push("/(auth)/login")}>
                        <Typo size={16} color={colors.primary}>
                            Giriş Yap
                        </Typo>
                    </Pressable>
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._10,
        paddingTop: spacingY._10
    },
    loginText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: 'right',
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacingX._5,
        paddingTop: 20
    },
    footerText: {
        textAlign: 'center',
        color: colors.text,
        fontSize: verticalScale(15),
        fontWeight: "bold"
    }
})