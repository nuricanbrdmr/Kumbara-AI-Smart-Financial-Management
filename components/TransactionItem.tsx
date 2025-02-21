import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { TransactionItemProps } from '@/types'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { expenseCategories, incomeCategory } from '@/constants/data'
import Typo from './Typo'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Timestamp } from 'firebase/firestore'

const TransactionItem = ({
    item,
    index,
    handleClick
}: TransactionItemProps) => {
    let category = item.type === "income" ? incomeCategory : expenseCategories[item.category!];
    const IconComponent = category.icon;
    const date = (item.date as Timestamp).toDate().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
    });
    return (
        <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(14)}>
            <TouchableOpacity onPress={() => handleClick(item)} style={styles.row}>
                <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
                    {IconComponent && (
                        <IconComponent
                            size={verticalScale(25)}
                            color={colors.white}
                            weight='fill'
                        />
                    )}
                </View>
                <View style={styles.categoryDes}>
                    <Typo size={17} fontWeight='500' color={colors.neutral200}>
                        {category.label}
                    </Typo>
                    <Typo size={12} textProps={{ numberOfLines: 1 }} color={colors.neutral400}>
                        {item.description!.length > 0 ? item.description : "No description"}
                    </Typo>
                </View>

                <View style={styles.amountDate}>
                    <Typo size={17} fontWeight='500' color={item.type === "income" ? colors.green : colors.rose}>
                        {`${item.type === "income" ? "+" : "-"}${item.amount} ₺`}
                    </Typo>
                    <Typo size={12} color={colors.neutral400}>
                        {date}
                    </Typo>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default TransactionItem

const styles = StyleSheet.create({
    container: {
        gap: spacingY._17
    },
    list: {
        minHeight: 3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacingX._12,
        marginBottom: spacingY._12,
        backgroundColor: colors.neutral800,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._12
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius._12,
        borderCurve: 'continuous'
    },
    categoryDes: {
        flex: 1,
        gap: 2.5
    },
    amountDate: {
        alignItems: "flex-end",
        gap: 3
    }
})