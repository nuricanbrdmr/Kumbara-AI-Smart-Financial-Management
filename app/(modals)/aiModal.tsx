import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import {
  SmartSavingDataType,
  SavingsTargetType,
} from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  SmartSavingsModel,
  SavingsForecastModel,
  SmartMarketForecastModel,
} from "@/config/AiModel";
import IAInput from "@/components/IAInput";
import {
  createSavingForecastResult,
  createSmartMarketForecastResult,
  createSmartSavingResult,
} from "@/services/aiService";

const loadingGif = require("../../assets/images/ai-generator-loading.gif");

const AiModal = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [AiSavingsData, setAiSavingsData] = useState<SmartSavingDataType>({
    age: 0,
    job: "",
    city: "",
    income: 0,
    fixedExpenses: 0,
    dailyExpenses: 0,
    luxuryExpenses: 0,
    currentSavings: 0,
    savingsGoal: 0,
  });

  const [accumulationOrMarketData, setAccumulationOrMarketData] =
    useState<SavingsTargetType>({
      current_savings: 0,
      monthly_income: 0,
      monthly_expenses: 0,
      savings_goal: 0,
      target_date: new Date().toISOString(),
    });

  const TasarrufFieldsData = [
    {
      placeholder: "Yaşınızı girin",
      label: "Yaş",
      type: "age",
      value: AiSavingsData.age,
    },
    {
      placeholder: "Mesleğinizi girin",
      label: "Meslek",
      type: "job",
      value: AiSavingsData.job,
    },
    {
      placeholder: "Yaşadığınız Şehiri girin",
      label: "Şehir",
      type: "city",
      value: AiSavingsData.city,
    },
    {
      placeholder: "Aylık gelir miktarını girin (Maaş, kira, etc.)",
      label: "Aylık Gelir",
      type: "income",
      value: AiSavingsData.income,
    },
    {
      placeholder:
        "Aylık zorunlu gider miktarını girin (Faturalar, kira, market alışverişleri etc.)",
      label: "Aylık Zorunlu Gider",
      type: "fixedExpenses",
      value: AiSavingsData.fixedExpenses,
    },
    {
      placeholder:
        "Günlük gider miktarını girin (Kahve, yemek, yol ücreleri etc.)",
      label: "Günlük Gider",
      type: "dailyExpenses",
      value: AiSavingsData.dailyExpenses,
    },
    {
      placeholder: "Lüks gider miktarını girin (Oda hizmetleri, spor etc.)",
      label: "Lüks Gider",
      type: "luxuryExpenses",
      value: AiSavingsData.luxuryExpenses,
    },
    {
      placeholder: "Mevcut birikim miktarını girin",
      label: "Mevcut Birikim",
      type: "currentSavings",
      value: AiSavingsData.currentSavings,
    },
    {
      placeholder: "Hedef birikim miktarını girin",
      label: "Hedef Birikim",
      type: "savingsGoal",
      value: AiSavingsData.savingsGoal,
    },
  ];

  const BirikimVePiyasaFieldsData = [
    {
      placeholder: "Mevcut birikim miktarını girin ",
      label: "Mevcut Birikim",
      type: "current_savings",
      value: accumulationOrMarketData.current_savings,
    },
    {
      placeholder: "Aylık gelir miktarını girin (Maaş, kira, etc.)",
      label: "Aylık Gelir",
      type: "monthly_income",
      value: accumulationOrMarketData.monthly_income,
    },
    {
      placeholder:
        "Aylık girder miktarını girin (Kira, market alışverişleri, yemek, yol ücreleri etc.)",
      label: "Aylık Gider",
      type: "monthly_expenses",
      value: accumulationOrMarketData.monthly_expenses,
    },
    {
      placeholder: "Hedef birikim miktarını girin",
      label: "Hedef Birikim",
      type: "savings_goal",
      value: accumulationOrMarketData.savings_goal,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || accumulationOrMarketData.target_date;
    setAccumulationOrMarketData({
      ...accumulationOrMarketData,
      target_date: currentDate,
    });
    setShowDatePicker(Platform.OS === "ios" ? true : false);
  };

  const handleSmartSaving = async () => {
    const userData = {
      age: AiSavingsData.age,
      job: AiSavingsData.job,
      city: AiSavingsData.city,
      income: AiSavingsData.income,
      fixedExpenses: AiSavingsData.fixedExpenses,
      dailyExpenses: AiSavingsData.dailyExpenses,
      luxuryExpenses: AiSavingsData.luxuryExpenses,
      currentSavings: AiSavingsData.currentSavings,
      savingsGoal: AiSavingsData.savingsGoal,
    };
    try {
      setLoading(true);
      const response = await SmartSavingsModel(userData, "tr");
      const dbData = { ...response, uid: user?.uid };
      await createSmartSavingResult(dbData);
      setLoading(false);

      router.push({
        pathname: "/(ai)/smartSavings",
        params: { smartSaving: JSON.stringify(dbData) },
      });
    } catch (error) {
      console.error("AI Model Error:", error);
    }
  };

  const handleSavingsForecast = async () => {
    const userData = {
      current_savings: accumulationOrMarketData.current_savings,
      monthly_income: accumulationOrMarketData.monthly_income,
      monthly_expenses: accumulationOrMarketData.monthly_expenses,
      savings_goal: accumulationOrMarketData.savings_goal,
      target_date: accumulationOrMarketData.target_date,
    };
    try {
      setLoading(true);
      const recommendations = await SavingsForecastModel(userData, "tr");
      const recommendationData = Array.isArray(recommendations)
        ? recommendations[0]
        : recommendations;
      const dbData = { ...recommendationData, uid: user?.uid };
      await createSavingForecastResult(dbData);
      setLoading(false);

      router.push({
        pathname: "/(ai)/savingsForecast",
        params: { savingForecast: JSON.stringify(dbData) },
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
  };

  const handleGetSmartFinancialAdvice = async () => {
    const userData = {
      current_savings: accumulationOrMarketData.current_savings,
      monthly_income: accumulationOrMarketData.monthly_income,
      monthly_expenses: accumulationOrMarketData.monthly_expenses,
      savings_goal: accumulationOrMarketData.savings_goal,
      target_date: accumulationOrMarketData.target_date,
    };
    try {
      setLoading(true);
      const financialAdvice = await SmartMarketForecastModel(userData, "tr");
      const financialAdviceData = Array.isArray(financialAdvice)
        ? financialAdvice[0]
        : financialAdvice;
      const dbData = { ...financialAdviceData, uid: user?.uid };
      await createSmartMarketForecastResult(dbData);
      setLoading(false);

      router.push({
        pathname: "/(ai)/smartMarketForecast",
        params: { smartMarketForecast: JSON.stringify(dbData) },
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
  };

  const handleSave = async () => {
    if (id === "tasarruf") {
      const {
        age,
        job,
        city,
        income,
        fixedExpenses,
        dailyExpenses,
        luxuryExpenses,
        currentSavings,
        savingsGoal,
      } = AiSavingsData;

      if (
        !age ||
        !job ||
        !city ||
        !income ||
        !fixedExpenses ||
        !dailyExpenses ||
        !luxuryExpenses ||
        !currentSavings ||
        !savingsGoal
      ) {
        Alert.alert("Hata", "Lütfen tüm alanları doldurun");
        return;
      }
      await handleSmartSaving();
    } else {
      const {
        current_savings,
        monthly_income,
        monthly_expenses,
        savings_goal,
        target_date,
      } = accumulationOrMarketData;

      if (
        !current_savings ||
        !monthly_income ||
        !monthly_expenses ||
        !savings_goal ||
        !target_date
      ) {
        Alert.alert("Hata", "Lütfen tüm alanları doldurun");
        return;
      }
      if (id === "birikim") {
        await handleSavingsForecast();
      } else {
        await handleGetSmartFinancialAdvice();
      }
    }
  };

  if (loading) {
    return (
      <ModalWrapper style={{ paddingTop: 0 }}>
        <View style={styles.gifContainer}>
          <Image style={styles.gif} source={loadingGif} />
        </View>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={
            id === "tasarruf"
              ? "Akıllı Tasarruf Önerisi"
              : id === "birikim"
              ? "Akıllı Birikim Önerisi"
              : "Akıllı Piyasa Önerisi"
          }
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          {(id === "tasarruf"
            ? TasarrufFieldsData
            : BirikimVePiyasaFieldsData
          ).map((item, index) => (
            <View key={index} style={styles.inputContainer}>
              <Typo size={16} color={colors.neutral200}>
                {item.label}
              </Typo>
              <IAInput
                item={item}
                id={id}
                setAiSavingsData={setAiSavingsData}
                AiSavingsData={AiSavingsData}
                setAccumulationOrMarketData={setAccumulationOrMarketData}
                accumulationOrMarketData={accumulationOrMarketData}
              />
            </View>
          ))}
          {id !== "tasarruf" && (
            <View style={[styles.inputContainer, { marginBottom: 0 }]}>
              <Typo size={16} color={colors.neutral200}>
                Hedef Tarih
              </Typo>
              {!showDatePicker ? (
                <Pressable
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Typo size={14}>
                    {new Date(
                      accumulationOrMarketData.target_date
                    ).toLocaleDateString("tr-TR")}
                  </Typo>
                </Pressable>
              ) : (
                <View>
                  <RNDateTimePicker
                    themeVariant="dark"
                    value={new Date(accumulationOrMarketData.target_date)}
                    textColor={colors.white}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                  />
                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Typo size={15} fontWeight={"500"}>
                        Tamam
                      </Typo>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={handleSave} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight="700">
            Hesapla
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default AiModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._7,
    justifyContent: "space-between",
  },
  gifContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    height: 150,
    width: 150,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
  },
  form: {
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
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
    marginBottom: spacingY._20,
  },
  dateInput: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    justifyContent: "center",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
});
