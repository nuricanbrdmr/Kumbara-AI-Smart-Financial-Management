import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { PlusCircle } from 'phosphor-react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import { useFetchData } from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { orderBy, where } from 'firebase/firestore'
import Loading from '@/components/Loading'
import WalletListItem from '@/components/WalletListItem'

const Wallet = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { data: wallets, loading, error } = useFetchData<WalletType>('wallets',
        [
            where('uid', '==', user?.uid),
            orderBy('created', 'desc')
        ]
    );

    const getTotalBalance = () => {
        return wallets?.reduce((total, wallet) => {
            total += wallet?.amount || 0;
            return total;
        }, 0);
    }

    return (
        <ScreenWrapper style={{ backgroundColor: colors.black }}>
            <View style={styles.container}>
                <View style={styles.balanceView}>
                    <View style={{ alignItems: 'center' }}>
                        <Typo size={45} fontWeight={"500"}>
                            {getTotalBalance()?.toFixed(2) || 0} TL
                        </Typo>
                        <Typo size={16} color={colors.neutral300}>
                            Toplam Bakiye
                        </Typo>
                    </View>
                </View>

                <View style={styles.wallets}>
                    <View style={styles.flexRow}>
                        <Typo size={20} fontWeight={"500"}>
                            Kumbaralarım
                        </Typo>
                        <TouchableOpacity onPress={() => router.push('/(modals)/walletModal')}>
                            <PlusCircle
                                size={verticalScale(33)}
                                color={colors.primary}
                                weight='fill'
                            />
                        </TouchableOpacity>
                    </View>

                    {loading ?
                        <Loading />
                        :
                        <FlatList
                            data={wallets}
                            renderItem={({ item, index }) => {
                                return <WalletListItem item={item} index={index} router={router} />
                            }}
                            contentContainerStyle={styles.listStyle}
                        />
                    }

                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Wallet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    balanceView: {
        height: verticalScale(160),
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacingY._10,
    },
    wallets: {
        flex: 1,
        backgroundColor: colors.neutral900,
        borderTopRightRadius: radius._30,
        borderTopLeftRadius: radius._30,
        padding: spacingX._20,
        paddingTop: spacingY._25,
    },
    listStyle: {
        paddingVertical: spacingY._25,
        paddingTop: spacingY._15,
    }
})