import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageService'
import { Pencil } from 'phosphor-react-native'
import Typo from '@/components/Typo'
import { UserDataType } from '@/types'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext'
import { UpdateUser } from '@/services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

const ProfileModal = () => {
    const { user, updateUserData } = useAuth();
    const [userData, setUserData] = useState<UserDataType>({
        name: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setUserData({
            name: user?.name || '',
            image: user?.image || null,
        });
    }, [user]);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUserData({ ...userData, image: result.assets[0] });
        }
    };

    const handleSave = async () => {
        let { name, image } = userData;
        if (!name.trim()) {
            Alert.alert("User", "Please fill all the fields");
            return;
        }
        setLoading(true);
        const res = await UpdateUser(user?.uid as string, userData);
        setLoading(false);
        if (res.success) {
            updateUserData(user?.uid as string);
            router.back();
        } else {
            Alert.alert("User", res.msg);
        }
    }


    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title='Update Profile' leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={getProfileImage(userData.image)}
                            contentFit='cover'
                            transition={100}
                        />
                        <TouchableOpacity onPress={handlePickImage} style={styles.editIcon}>
                            <Pencil size={verticalScale(20)} color={colors.neutral800} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Name</Typo>
                        <Input
                            value={userData.name}
                            onChangeText={(text) => setUserData({ ...userData, name: text })}
                            placeholder='Name'
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <Button onPress={handleSave} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight='700'>Save</Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default ProfileModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._7,
        justifyContent: 'space-between',
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        borderTopWidth: 1,
        marginBottom: spacingY._5,
    },
    form: {
        marginTop: spacingY._15,
        gap: spacingY._30,
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
        borderColor: colors.neutral500,
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._10,
    }
})