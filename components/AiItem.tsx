import { StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native'
import React from 'react'
import { AiItemProps } from '@/types'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Typo from './Typo'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Timestamp } from 'firebase/firestore'
import { useRouter } from 'expo-router'
import { deleteAiResult } from '@/services/aiService'
import { Ionicons } from '@expo/vector-icons'

const AiItem = ({
    item,
    index,
}: AiItemProps) => {
    const router = useRouter();

    const formatDate = (dateValue: Date | Timestamp | undefined) => {
        if (!dateValue) return new Date().toLocaleDateString('tr-TR')
        if (dateValue instanceof Timestamp) {
            return dateValue.toDate().toLocaleDateString('tr-TR')
        }
        return dateValue.toLocaleDateString('tr-TR')
    }

    const handleClick = (item: any) => {
        if (item.recommendationType === 'tasarruf') {
            router.push({
                pathname: "/(ai)/smartSavings",
                params: { smartSaving: JSON.stringify(item) },
            });
        } else if (item.recommendationType === 'birikim') {
            router.push({
                pathname: "/(ai)/savingsForecast",
                params: { savingForecast: JSON.stringify(item) },
            });
        } else if (item.recommendationType === 'piyasa') {
            router.push({
                pathname: "/(ai)/smartMarketForecast",
                params: { smartMarketForecast: JSON.stringify(item) },
            });
        }
    }

    const handleDelete = async () => {
        Alert.alert(
            "Öneriyi Sil",
            "Bu öneriyi silmek istediğinizden emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        const collectionName = item.recommendationType === 'tasarruf'
                            ? 'smartSavings'
                            : item.recommendationType === 'birikim'
                                ? 'savingForecasts'
                                : 'smartMarket';

                        const result = await deleteAiResult(item.id!, collectionName);
                        if (result.success) {
                            // The Firestore listener will automatically update the UI
                        } else {
                            Alert.alert("Hata", "Öneri silinirken bir hata oluştu");
                        }
                    }
                }
            ]
        );
    };

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(14)}>
            <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
                <Image source={item.image} style={styles.icon} resizeMode="cover" />
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Typo size={17} fontWeight='500' color={colors.neutral200}>
                            {item.name}
                        </Typo>
                        <Typo size={13} color={colors.neutral400}>
                            {formatDate(item.created)}
                        </Typo>
                    </View>
                    <View style={styles.detailsContainer}>
                        {item.recommendationType === 'tasarruf' && (
                            <Typo size={14} color={colors.neutral400}>
                                Hedef: {item.savingsGoal?.toLocaleString('tr-TR')} ₺
                            </Typo>
                        )}
                        {['birikim', 'piyasa'].includes(item.recommendationType || '') && (
                            <Typo size={14} color={colors.primary}>
                                Hedef: {item.savings_goal?.toLocaleString('tr-TR')} ₺
                            </Typo>
                        )}
                        <TouchableOpacity
                            onPress={handleDelete}
                            style={styles.deleteButton}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.rose} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default AiItem

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._12,
        marginBottom: spacingY._12,
        backgroundColor: colors.neutral800,
        padding: spacingY._12,
        borderRadius: radius._12
    },
    icon: {
        height: verticalScale(60),
        width: verticalScale(60),
        borderRadius: radius._12,
    },
    contentContainer: {
        flex: 1,
        gap: spacingY._10
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detailsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingY._5
    },
    deleteButton: {
        paddingRight: 3,
    },
})