import { Image, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import BackButton from "@/components/BackButton";
import { useLocalSearchParams } from "expo-router";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import {
  Accordion,
  AccordionItem,
} from "@mustapha-ghlissi/react-native-accordion";
import { CurrencyCircleDollar, Lightbulb, MinusCircle } from "phosphor-react-native";

const SavingsForecast = () => {
  const { savingForecast } = useLocalSearchParams();
  const forecastData = savingForecast
    ? JSON.parse(savingForecast as string)
    : null;

  const formatLargeNumber = (num: number): string => {
    if (num === 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <Header
          title="Akıllı Birikim Önerisi"
          leftIcon={<BackButton routerName="/(tabs)" />}
          style={{ marginBottom: spacingY._17 }}
        />
        <View style={{ gap: spacingY._17, paddingBottom: spacingX._15 }}>
          <View style={styles.infoRow}>
            <View
              style={{ justifyContent: "space-between", paddingVertical: 8 }}
            >
              <Typo size={20} fontWeight={"500"}>
                Güncel Birikim
              </Typo>
              <Typo size={28} color={colors.primary}>
                {formatLargeNumber(forecastData?.current_savings)} ₺
              </Typo>
            </View>
            <Image
              source={require("../../assets/images/ai/current-saving.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.infoRow}>
            <View
              style={{ justifyContent: "space-between", paddingVertical: 8 }}
            >
              <Typo size={20} fontWeight={"500"}>
                Aylık Gelir
              </Typo>
              <Typo size={28} color={colors.primary}>
                {formatLargeNumber(forecastData?.monthly_income)} ₺
              </Typo>
            </View>
            <Image
              source={require("../../assets/images/ai/income.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.infoRow}>
            <View
              style={{ justifyContent: "space-between", paddingVertical: 8 }}
            >
              <Typo size={20} fontWeight={"500"}>
                Aylık Gider
              </Typo>
              <Typo size={28} color={colors.primary}>
                {formatLargeNumber(forecastData?.monthly_expenses)} ₺
              </Typo>
            </View>
            <Image
              source={require("../../assets/images/ai/expense.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.infoRow}>
            <View
              style={{ justifyContent: "space-between", paddingVertical: 8 }}
            >
              <Typo size={20} fontWeight={"500"}>
                Birikim Hedefi
              </Typo>
              <Typo size={28} color={colors.primary}>
                {formatLargeNumber(forecastData?.savings_goal)} ₺
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
                Gerekli Aylık Tasarruf
              </Typo>
              <Typo size={28} color={colors.primary}>
                {forecastData?.required_monthly_savings} ₺
              </Typo>
            </View>
            <Image
              source={require("../../assets/images/ai/monthly-savings.png")}
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
                {forecastData?.recommended_savings_percentage.split("%")[0]} %
              </Typo>
            </View>
            <Image
              source={require("../../assets/images/ai/savings-percentage.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.infoRow}>
            <View
              style={{ justifyContent: "space-between", paddingVertical: 8 }}
            >
              <Typo size={20} fontWeight={"500"}>
                Tamamlanma Tarihi
              </Typo>
              <Typo size={28} color={colors.primary}>
                {new Date(
                  forecastData?.projected_completion_date
                ).toLocaleDateString("tr-TR")}
              </Typo>
            </View>
            <Image
              source={require("../../assets/images/ai/completion-date.png")}
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
              <AccordionItem title="Gider Azaltma Önerisi" leftIcon={<MinusCircle weight='duotone' color={colors.primary} style={{justifyContent: 'center', alignSelf: 'center'}} />}>
                <Typo style={styles.accordionText}>
                  - {forecastData?.expense_category_to_reduce}
                </Typo>
              </AccordionItem>
              <AccordionItem title="Tasarruf İpuçları" leftIcon={<Lightbulb weight='duotone' color={colors.primary} style={{justifyContent: 'center', alignSelf: 'center'}} />}>
                {forecastData?.savings_tips.map(
                  (tip: string, index: number) => (
                    <Typo key={index} style={styles.accordionText}>
                      - {tip}
                    </Typo>
                  )
                )}
              </AccordionItem>
              <AccordionItem title="Ek Öneriler" leftIcon={<CurrencyCircleDollar weight='duotone' color={colors.primary} style={{justifyContent: 'center', alignSelf: 'center'}} />}>
                {forecastData?.additional_recommendations.map(
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
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SavingsForecast;

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
