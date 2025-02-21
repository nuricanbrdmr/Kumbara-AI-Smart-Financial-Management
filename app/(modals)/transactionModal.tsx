import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
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
import { deleteWallet } from '@/services/walletService'
import { Trash } from 'phosphor-react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { expenseCategories, transactionTypes } from '@/constants/data'
import { useFetchData } from '@/hooks/useFetchData'
import { orderBy, where } from 'firebase/firestore'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService'

const TransactionModal = () => {
    const { user } = useAuth();
    const [transactionData, setTransactionData] = useState<TransactionType>({
        type: 'expense',
        amount: 0,
        description: '',
        category: '',
        date: new Date(),
        walletId: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    const {
        data: wallets,
        error: WalletError,
        loading: WalletLoading
    } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid),
        orderBy("created", "desc")
    ]);

    const onDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || transactionData.date;
        setTransactionData({ ...transactionData, date: currentDate });
        setShowDatePicker(Platform.OS === 'ios' ? true : false);
    }

    type paramType = {
        id: string,
        type: string,
        amount: string,
        category?: string,
        date: string,
        description?: string,
        image?: any,
        uid?: string,
        walletId: string,
    }

    const oldTransaction: paramType = useLocalSearchParams();
    useEffect(() => {
        if (oldTransaction.id) {
            setTransactionData({
                type: oldTransaction.type,
                amount: Number(oldTransaction.amount),
                description: oldTransaction.description || "",
                category: oldTransaction.category || "",
                date: new Date(oldTransaction.date),
                walletId: oldTransaction.walletId,
                image: oldTransaction?.image,
            });
        }
    }, [])

    const handleSave = async () => {
        const { type, amount, description, category, date, walletId, image } = transactionData;

        if (!type || !amount || !date || !walletId || (type === 'expense' && !category)) {
            Alert.alert("Transaction", "Please fill all the required fields");
            return;
        }

        const data: TransactionType = {
            type,
            amount,
            description,
            category,
            date,
            walletId,
            image: image ? image : null,
            uid: user?.uid,
        };

        if (oldTransaction.id) {
            data.id = oldTransaction.id;
        }

        setLoading(true);
        const res = await createOrUpdateTransaction(data);
        setLoading(false);

        if (res.success) {
            router.back();
        } else {
            Alert.alert("Transaction", res.msg);
        }
    };

    const alertDelete = () => {
        Alert.alert("Onaylayın", "Bu cüzdanı silmek istediğinizden emin misiniz?", [
            { text: "İptal", style: "cancel" },
            { text: "Sil", onPress: handleDelete, style: "destructive" }
        ])
    }

    const handleDelete = async () => {
        setLoading(true);
        const res = await deleteTransaction(oldTransaction?.id, oldTransaction?.walletId);
        setLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Transaction", res.msg);
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title={oldTransaction.id ? 'İşlem Güncelleme' : 'Yeni İşlem'} leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />
                <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                    {/* type */}
                    <View style={styles.inputContainer}>
                        <Typo size={16} color={colors.neutral200}>İşlem Tipi</Typo>
                        <Dropdown
                            style={styles.dropdownContainer}
                            activeColor={colors.neutral700}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            iconStyle={styles.dropdownIcon}
                            data={transactionTypes}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemContainerStyle={styles.dropdownItemContainer}
                            itemTextStyle={styles.dropdownItemText}
                            containerStyle={styles.dropdownListContainer}
                            placeholder={'Tipi seçin'}
                            value={transactionData.type}
                            onChange={item => {
                                setTransactionData({ ...transactionData, type: item.value })
                            }}
                        />
                    </View>
                    {/* Wallet */}
                    <View style={styles.inputContainer}>
                        <Typo size={16} color={colors.neutral200}>Kumbara</Typo>
                        <Dropdown
                            style={styles.dropdownContainer}
                            activeColor={colors.neutral700}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            iconStyle={styles.dropdownIcon}
                            data={wallets.map(wallet => ({
                                label: `${wallet.name} (${wallet.amount} ₺)`,
                                value: wallet.id
                            }))}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemContainerStyle={styles.dropdownItemContainer}
                            itemTextStyle={styles.dropdownItemText}
                            containerStyle={styles.dropdownListContainer}
                            placeholder={'Kumbara seçin'}
                            value={transactionData.walletId}
                            onChange={item => {
                                setTransactionData({ ...transactionData, walletId: item.value || "" })
                            }}
                        />
                    </View>
                    {/* Expense Category */}
                    {
                        transactionData.type === 'expense' && (
                            <View style={styles.inputContainer}>
                                <Typo size={16} color={colors.neutral200}>Gider Kategorisi</Typo>
                                <Dropdown
                                    style={styles.dropdownContainer}
                                    activeColor={colors.neutral700}
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    selectedTextStyle={styles.dropdownSelectedText}
                                    iconStyle={styles.dropdownIcon}
                                    data={Object.values(expenseCategories)}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    itemContainerStyle={styles.dropdownItemContainer}
                                    itemTextStyle={styles.dropdownItemText}
                                    containerStyle={styles.dropdownListContainer}
                                    placeholder={'Kategori seçin'}
                                    value={transactionData.category}
                                    onChange={item => {
                                        setTransactionData({ ...transactionData, category: item.value || "" })
                                    }}
                                />
                            </View>
                        )
                    }

                    {/* Date Picker */}
                    <View style={styles.inputContainer}>
                        <Typo size={16} color={colors.neutral200}>Tarih</Typo>
                        {
                            !showDatePicker ? (
                                <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                                    <Typo size={14}>
                                        {(transactionData.date as Date).toLocaleDateString("tr-TR")}
                                    </Typo>
                                </Pressable>
                            ) : (
                                <View>
                                    <RNDateTimePicker
                                        themeVariant='dark'
                                        value={transactionData.date as Date}
                                        textColor={colors.white}
                                        mode='date'
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={onDateChange}
                                    />
                                    {
                                        Platform.OS === 'ios' && (
                                            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(false)}>
                                                <Typo size={15} fontWeight={"500"}>Done</Typo>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            )
                        }
                    </View>

                    {/* Amount */}
                    <View style={styles.inputContainer}>
                        <Typo size={16} color={colors.neutral200}>Miktar</Typo>
                        <Input
                            keyboardType='numeric'
                            value={transactionData.amount?.toString()}
                            onChangeText={(value) =>
                                setTransactionData({
                                    ...transactionData,
                                    amount: Number(value.replace(/[^0-9]/g, ''))
                                })
                            }
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputContainer}>
                        <View style={styles.flexRow}>
                            <Typo size={16} color={colors.neutral200}>Açıklama</Typo>
                            <Typo size={14} color={colors.neutral500}>(isteğe bağlı)</Typo>
                        </View>
                        <Input
                            value={transactionData.description}
                            multiline
                            containerStyle={{
                                flexDirection: 'row',
                                height: verticalScale(100),
                                alignItems: 'flex-start',
                                paddingVertical: 15
                            }}
                            onChangeText={(value) =>
                                setTransactionData({
                                    ...transactionData,
                                    description: value
                                })
                            }
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.flexRow}>
                            <Typo size={16} color={colors.neutral200}>Makbuz</Typo>
                            <Typo size={14} color={colors.neutral500}>(isteğe bağlı)</Typo>
                        </View>
                        <ImageUpload
                            file={transactionData.image}
                            onSelect={(file) => setTransactionData({ ...transactionData, image: file })}
                            onClear={() => setTransactionData({ ...transactionData, image: null })}
                            placeholder='Resim Yükle'
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    oldTransaction.id && !loading && (
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
                        {oldTransaction.id ? 'Güncelle' : 'Gönder'}
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default TransactionModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingY._20,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._5
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
        gap: spacingY._20,
        paddingVertical: spacingY._15,
        paddingBottom: spacingY._40,
    },
    inputContainer: {
        gap: spacingY._10,
    },
    dropdownContainer: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._15,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15,
    },
    dropdownItemText: {
        color: colors.white
    },
    dropdownSelectedText: {
        color: colors.white,
        fontSize: verticalScale(14)
    },
    dropdownListContainer: {
        backgroundColor: colors.neutral900,
        borderRadius: radius._15,
        borderCurve: "continuous",
        paddingVertical: spacingY._7,
        top: 5,
        borderColor: colors.neutral500,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5
    },
    dropdownPlaceholder: {
        color: colors.white
    },
    dropdownItemContainer: {
        borderRadius: radius._15,
        marginHorizontal: spacingX._7
    },
    dropdownIcon: {
        height: verticalScale(30),
        tintColor: colors.neutral300
    },
    dateInput: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15,
        justifyContent: 'center'
    },
    datePickerButton: {
        backgroundColor: colors.neutral700,
        alignSelf: "flex-end",
        padding: spacingY._7,
        marginRight: spacingX._7,
        paddingHorizontal: spacingY._15,
        borderRadius: radius._10,
    }
})