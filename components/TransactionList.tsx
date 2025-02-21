import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TransactionListType, TransactionType } from '@/types'
import { colors, spacingY } from '@/constants/theme'
import Typo from './Typo'
import { FlashList } from "@shopify/flash-list";
import TransactionItem from './TransactionItem'
import Loading from './Loading'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import { Timestamp } from 'firebase/firestore'

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage
}: TransactionListType) => {
    const router = useRouter();
    const handleClick = (item: TransactionType) => {
        router.push({
            pathname: "/(modals)/transactionModal",
            params: {
                id: item?.id,
                type: item?.type,
                amount: item?.amount,
                category: item?.category,
                date: (item.date as Timestamp).toDate().toISOString(),
                description: item?.description,
                image: item?.image,
                uid: item?.uid,
                walletId: item?.walletId
            }
        })
    }

    return (
        <View style={styles.container}>
            {title && (
                <Typo size={18} fontWeight={"600"} color={colors.neutral200}>
                    {title}
                </Typo>
            )}

            <View style={styles.list}>
                <FlashList
                    data={data}
                    renderItem={({ item, index }) => <TransactionItem item={item} index={index} handleClick={handleClick} />}
                    estimatedItemSize={60}
                />
            </View>
            {!loading && data.length === 0 && (
                <Typo size={15} style={styles.emptyMsg} color={colors.neutral400}>
                    {emptyListMessage}
                </Typo>
            )}

            {loading && (
                <View style={styles.loading}>
                    <Loading />
                </View>
            )}
        </View>
    )
}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        gap: spacingY._10
    },
    list: {
        minHeight: 3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    emptyMsg: {
        textAlign: 'center',
        marginTop: spacingY._10
    },
    loading: {
        top: verticalScale(100)
    }
})