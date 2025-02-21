import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useAuth } from '@/contexts/authContext'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import { Image } from "expo-image"
import { getProfileImage } from '@/services/imageService'
import { accountOptionType } from '@/types'
import { CaretRight, GearSix, Lock, Power, User } from 'phosphor-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useRouter } from 'expo-router'

const Profile = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const accountOptions: accountOptionType[] = [
        {
            title: 'Profil Güncelle',
            icon: (
                <User
                    size={26}
                    color={colors.white}
                    weight='fill'
                />
            ),
            bgColor: "#6366f1",
            onPress: () => {
                router.push('/(modals)/profileModal');
            },
        },
        {
            title: 'Ayarlar',
            icon: (
                <GearSix
                    size={26}
                    color={colors.white}
                    weight='fill'
                />
            ),
            bgColor: "#059669",
        },
        {
            title: 'Gizlilik Politikası',
            icon: (
                <Lock
                    size={26}
                    color={colors.white}
                    weight='fill'
                />
            ),
            bgColor: colors.neutral600,
        },
        {
            title: 'Çıkış Yap',
            icon: (
                <Power
                    size={26}
                    color={colors.white}
                    weight='fill'
                />
            ),
            bgColor: "#e11d48",
            onPress: () => showLogoutAlert(),
        }
    ];

    const showLogoutAlert = () => {
        Alert.alert('Onaylayın', 'Oturumu kapatmak istediğinizden emin misiniz?', [
            { text: 'İptal', style: 'cancel', onPress: () => { } },
            { text: 'Çıkış Yap', onPress: () => logout(), style: 'destructive' },
        ]);
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Header title='Profil' style={{ marginVertical: spacingY._10 }} />

                {/* User Info */}
                <View style={styles.userInfo}>
                    {/* Avatar */}
                    <View>
                        <Image
                            source={getProfileImage(user?.image)}
                            style={styles.avatar}
                            contentFit='cover'
                            transition={100}
                        />
                    </View>
                    {/* Name and Email */}
                    <View style={styles.nameContainer}>
                        <Typo size={24} fontWeight='600' color={colors.neutral100}>{user?.name}</Typo>
                        <Typo size={15} fontWeight='400' color={colors.neutral400}>{user?.email}</Typo>
                    </View>
                </View>

                {/* Account Options */}
                <View style={styles.accountOptions}>
                    {accountOptions.map((option, index) => (
                        <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(14)} style={styles.listItem} key={index}>
                            <TouchableOpacity style={styles.flexRow} onPress={option.onPress}>
                                <View style={[styles.listIcon, { backgroundColor: option.bgColor }]}>
                                    {option.icon && option.icon}
                                </View>
                                <Typo size={16} fontWeight='500' style={{ flex: 1 }}>{option.title}</Typo>
                                <CaretRight
                                    size={verticalScale(20)}
                                    weight='bold'
                                    color={colors.white}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    userInfo: {
        marginTop: verticalScale(30),
        alignItems: 'center',
        gap: spacingY._15,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral400,
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        borderRadius: 50,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: 5,
    },
    nameContainer: {
        alignItems: 'center',
        gap: verticalScale(4),
    },
    listIcon: {
        width: verticalScale(44),
        height: verticalScale(44),
        backgroundColor: colors.neutral500,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius._15,
        borderCurve: 'continuous',
    },
    listItem: {
        marginBottom: verticalScale(17),
    },
    accountOptions: {
        marginTop: spacingY._35,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._10,
    }
})