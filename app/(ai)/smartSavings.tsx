import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import BackButton from "@/components/BackButton";
import { useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";
import { colors, spacingX, spacingY } from "@/constants/theme";
import {
  Accordion,
  AccordionItem,
} from "@mustapha-ghlissi/react-native-accordion";
import {
  CurrencyCircleDollar,
  Lightbulb,
} from "phosphor-react-native";

const SmartSavings = () => {
  const { smartSaving } = useLocalSearchParams();
  const smartSavingData = smartSaving
    ? JSON.parse(smartSaving as string)
    : null;

  const formatLargeNumber = (num: number): string => {
    if (num === 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const userData = [
    {
      label: "Yaş",
      value: smartSavingData?.age,
    },
    {
      label: "Meslek",
      value: smartSavingData?.job,
    },
    {
      label: "Şehir",
      value: smartSavingData?.city,
    },
  ];
  const userIncomeAndExpensesData = [
    {
      label: "Mevcut Birikim",
      value: smartSavingData?.currentSavings,
    },
    {
      label: "Aylık Gelir",
      value: smartSavingData?.income,
    },
    {
      label: "Düzenli Giderler",
      value: smartSavingData?.fixedExpenses,
    },
    {
      label: "Günlük Giderler",
      value: smartSavingData?.dailyExpenses,
    },
    {
      label: "Lüks Giderler",
      value: smartSavingData?.luxuryExpenses,
    },
  ];
  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacingX._15 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Header
            title="Akıllı Tasarruf Önerisi"
            leftIcon={<BackButton routerName="/(tabs)" />}
            style={{ marginBottom: spacingY._17 }}
          />

          <View style={{ marginBottom: 16 }}>
            <Typo size={20} fontWeight={"500"} style={{ marginBottom: 8 }}>
              Kişisel Bilgiler
            </Typo>
            <FlatList
              data={userData}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingRight: 16 }}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  <View
                    style={{
                      justifyContent: "space-between",
                      paddingVertical: 8,
                    }}
                  >
                    <Typo size={14} fontWeight={"500"}>
                      {item.label}
                    </Typo>
                    <Typo size={20} color={colors.primary}>
                      {item.value}
                    </Typo>
                  </View>
                </View>
              )}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Typo size={20} fontWeight={"500"} style={{ marginBottom: 8 }}>
              Gelir ve Giderler
            </Typo>
            <FlatList
              data={userIncomeAndExpensesData}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingRight: 16 }}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  <View
                    style={{
                      justifyContent: "space-between",
                      paddingVertical: 8,
                    }}
                  >
                    <Typo size={14} fontWeight={"500"}>
                      {item.label}
                    </Typo>
                    <Typo size={20} color={colors.primary}>
                      {formatLargeNumber(item.value)} ₺
                    </Typo>
                  </View>
                </View>
              )}
            />
          </View>

          <View style={{ gap: spacingY._17 }}>
            <View style={styles.infoRow}>
              <View
                style={{ justifyContent: "space-between", paddingVertical: 8 }}
              >
                <Typo size={20} fontWeight={"500"}>
                  Hedef Birikim
                </Typo>
                <Typo size={28} color={colors.primary}>
                  {formatLargeNumber(smartSavingData?.savingsGoal)} ₺
                </Typo>
              </View>
              <Image
                source={require("../../assets/images/ai/goal.png")}
                style={styles.icon}
              />
            </View>

            <View style={styles.infoRow}>
              <View
                style={{ justifyContent: "space-between", paddingVertical: 8 }}
              >
                <Typo size={20} fontWeight={"500"}>
                  Tahmini Zaman
                </Typo>
                <Typo size={28} color={colors.primary}>
                  {smartSavingData?.estimated_months_to_goal} Ay
                </Typo>
              </View>
              <Image
                source={require("../../assets/images/ai/completion-date.png")}
                style={styles.icon}
              />
            </View>

            <View style={styles.infoRow}>
              <View
                style={{ justifyContent: "space-between", paddingVertical: 8 }}
              >
                <Typo size={20} fontWeight={"500"}>
                  Önerilen Tasarruf Oranı
                </Typo>
                <Typo size={28} color={colors.primary}>
                  %{" "}
                  {
                    smartSavingData?.recommended_savings_percentage.split(
                      "%"
                    )[0]
                  }
                </Typo>
              </View>
              <Image
                source={require("../../assets/images/ai/savings-percentage.png")}
                style={styles.icon}
              />
            </View>

            <View
              style={{
                backgroundColor: colors.neutral800,
                padding: 6,
                borderRadius: 12,
              }}
            >
              <Accordion
                headerStyle={styles.contentContainerStyle}
                itemContainerStyle={{ backgroundColor: colors.neutral800 }}
                titleStyle={{ color: colors.neutral100 }}
              >
                <AccordionItem
                  title="Gelir Arttırma Önerisi"
                  leftIcon={
                    <CurrencyCircleDollar
                      weight="duotone"
                      color={colors.primary}
                    />
                  }
                >
                  {smartSavingData?.income_increase_strategies.map(
                    (tip: string, index: number) => (
                      <Typo key={index} style={styles.accordionText}>
                        - {tip}
                      </Typo>
                    )
                  )}
                </AccordionItem>

                <AccordionItem
                  title="Tasarruf İpuçları"
                  leftIcon={
                    <Lightbulb weight="duotone" color={colors.primary} />
                  }
                >
                  {smartSavingData?.savings_tips.map(
                    (tip: string, index: number) => (
                      <Typo key={index} style={styles.accordionText}>
                        - {tip}
                      </Typo>
                    )
                  )}
                </AccordionItem>
              </Accordion>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SmartSavings;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacingX._5,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._15,
    borderRadius: 12,
  },
  userRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingY._25,
    borderRadius: 22,
  },
  icon: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  contentContainerStyle: {
    backgroundColor: colors.neutral600,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  accordionText: {
    paddingTop: 8,
    textAlign: "justify",
  },
});
