import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { At, Lock } from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'

const Login = () => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Lütfen e-posta adresinizi ve şifrenizi girin!")
            return
        }

        setLoading(true)
        const response = await login(emailRef.current, passwordRef.current);
        setLoading(false)
        if (response.success) {
            router.push("/(tabs)")
        } else {
            Alert.alert(response.msg || "Bir şeyler ters gitti!")
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* <BackButton /> */}

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={"800"}>Merhaba</Typo>
                    <Typo size={30} fontWeight={"800"}>Tekrar Hoş Geldiniz</Typo>
                </View>

                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>
                        Tüm gelir ve giderlerinizi takip etmek için şimdi giriş yapın!
                    </Typo>
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
                    <TouchableOpacity>
                        <Typo size={14} color={colors.text} style={styles.forgotPassword}>
                            Şifrenizi mi unuttunuz?
                        </Typo>
                    </TouchableOpacity>


                    <Button onPress={handleLogin} loading={loading}>
                        <Typo size={20} color={colors.black} fontWeight={"700"}>Giriş Yap</Typo>
                    </Button>

                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Typo size={15} color={colors.textLighter}>
                        Hesabınız yok mu?
                    </Typo>
                    <Pressable onPress={() => router.push("/(auth)/register")}>
                        <Typo size={16} color={colors.primary}>
                            Kayıt Ol
                        </Typo>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Login

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
        gap: spacingX._5
    },
    footerText: {
        textAlign: 'center',
        color: colors.text,
        fontSize: verticalScale(15),
        fontWeight: "bold"
    }
})