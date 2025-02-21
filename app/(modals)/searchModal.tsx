import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import { TransactionType, WalletType } from '@/types'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ImageUpload from '@/components/ImageUpload'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import { Trash } from 'phosphor-react-native'
import { orderBy, where } from 'firebase/firestore'
import { useFetchData } from '@/hooks/useFetchData'
import TransactionList from '@/components/TransactionList'

const SearchModal = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [search, setSearch] = useState('');

    const constraints = [
        where("uid", "==", user?.uid),
        orderBy("date", "desc")
    ];

    const {
        data: allTransactions,
        loading: transactionsLoading,
        error,
    } = useFetchData<TransactionType>("transactions", constraints);

    const filteredTransactions = allTransactions?.filter((transaction) => {
        if (search.length > 1) {
            if (
                transaction.category?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                transaction.type?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                transaction.description?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
            ) {
                return true;
            }
            return false;
        }
        return true;
    });

    return (
        <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
            <View style={styles.container}>
                <Header title={"Arama"} leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.inputContainer}>
                        <Input
                            value={search}
                            containerStyle={{ backgroundColor: colors.neutral800 }}
                            placeholderTextColor={colors.neutral400}
                            onChangeText={(text) => setSearch(text)}
                            placeholder='Örn: Ayakkabılar...'
                        />
                    </View>
                    <View>
                        <TransactionList
                            loading={transactionsLoading}
                            data={filteredTransactions}
                            emptyListMessage='Arama anahtar kelimenizle eşleşen işlem yok'
                        />
                    </View>
                </ScrollView>
            </View>
        </ModalWrapper>
    )
}

export default SearchModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._7,
        justifyContent: 'space-between',
    },
    form: {
        marginTop: spacingY._15,
        gap: spacingY._30,
    },
    inputContainer: {
        gap: spacingY._10,
    }
})