import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext';
import Typo from '@/components/Typo';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { MagnifyingGlass, Plus } from 'phosphor-react-native';
import HomeCard from '@/components/HomeCard';
import TransactionList from '@/components/TransactionList';
import { useRouter } from 'expo-router';
import { limit, orderBy, where } from 'firebase/firestore';
import { useFetchData } from '@/hooks/useFetchData';
import { TransactionType } from '@/types';

const Home = () => {
    const { user } = useAuth();
    const router = useRouter();

    const constraints = [
        where("uid", "==", user?.uid),
        orderBy("date", "desc"),
        limit(30)
    ];

    const {
        data: recentTransactions,
        error,
        loading: transactionsLoading,
    } = useFetchData<TransactionType>("transactions", constraints);

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ gap: 4 }}>
                        <Typo size={16} color={colors.neutral400}>
                            Merhaba,
                        </Typo>
                        <Typo size={24} fontWeight='500'>
                            {user?.name}
                        </Typo>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/(modals)/searchModal")} style={styles.searchIcon}>
                        <MagnifyingGlass
                            size={verticalScale(22)}
                            color={colors.neutral200}
                            weight='bold'
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollViewStyle}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <HomeCard />
                    </View>
                    <TransactionList
                        data={recentTransactions}
                        title='Son İşlemler'
                        loading={transactionsLoading}
                        emptyListMessage='Henüz işlem eklenmedi!'
                    />
                </ScrollView>

                <Button style={styles.floatingButton} onPress={() => router.push('/(modals)/transactionModal')}>
                    <Plus
                        size={verticalScale(22)}
                        color={colors.black}
                        weight='bold'
                    />
                </Button>

            </View>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        marginTop: verticalScale(8),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacingY._10,
    },
    searchIcon: {
        backgroundColor: colors.neutral700,
        padding: spacingX._10,
        borderRadius: 50,
    },
    floatingButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: 'absolute',
        bottom: verticalScale(30),
        right: verticalScale(30),
    },
    scrollViewStyle: {
        marginTop: spacingY._10,
        paddingBottom: verticalScale(100),
        gap: spacingY._25,
    }
})