import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import { WalletType } from '@/types'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ImageUpload from '@/components/ImageUpload'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import { Trash } from 'phosphor-react-native'

const WalletModal = () => {
    const { user } = useAuth();
    const [walletData, setWalletData] = useState<WalletType>({
        name: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const oldWallet: { name: string, image: string, id: string } = useLocalSearchParams();

    useEffect(() => {
        if (oldWallet.id) {
            setWalletData({
                name: oldWallet?.name,
                image: oldWallet?.image,
            });
        }
    }, [])

    const handleSave = async () => {
        let { name, image } = walletData;
        if (!name.trim() || !image) {
            Alert.alert("Kumbara", "Lütfen tüm alanları doldurun");
            return;
        }

        const data: WalletType = {
            name,
            image,
            uid: user?.uid as string,
        }

        if (oldWallet.id) {
            data.id = oldWallet?.id;
        }

        setLoading(true);
        const res = await createOrUpdateWallet(data);
        setLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Kumbara", res.msg);
        }
    }

    const alertDelete = () => {
        Alert.alert("Onaylayın", "Bu kumbarayı silmek istediğinizden emin misiniz?", [
            { text: "İptal", style: "cancel" },
            { text: "Sil", onPress: handleDelete, style: "destructive" }
        ])
    }

    const handleDelete = async () => {
        setLoading(true);
        const res = await deleteWallet(oldWallet?.id);
        setLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Kumbara", res.msg);
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title={oldWallet.id ? 'Kumbra Düzenle' : 'Yeni Kumbara'} leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Kumbara Adı</Typo>
                        <Input
                            value={walletData.name}
                            onChangeText={(text) => setWalletData({ ...walletData, name: text })}
                            placeholder='Örn: Maaş'
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Kumbara Logosu</Typo>
                        <ImageUpload
                            file={walletData.image}
                            onSelect={(file) => setWalletData({ ...walletData, image: file })}
                            onClear={() => setWalletData({ ...walletData, image: null })}
                            placeholder='Logo Yükle'
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    oldWallet.id && !loading && (
                        <Button onPress={alertDelete} style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15 }}>
                            <Trash
                                size={verticalScale(24)}
                                weight='bold'
                                color={colors.white}
                            />
                        </Button>
                    )
                }
                <Button onPress={handleSave} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight='700'>
                        {oldWallet.id ? 'Kumbarayı Güncelle' : 'Kumbarayı Ekle'}
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default WalletModal

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