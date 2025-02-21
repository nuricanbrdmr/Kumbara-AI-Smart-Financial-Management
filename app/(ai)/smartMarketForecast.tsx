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
import {
  ChartLineUp,
  Coins,
  CurrencyCircleDollar,
  HandCoins,
  Lightbulb,
  MinusCircle,
  Money,
  SealPercent,
  SketchLogo,
} from "phosphor-react-native";

const SmartMarketForecast = () => {
  const { smartMarketForecast } = useLocalSearchParams();
  const smartMarketData = smartMarketForecast
    ? JSON.parse(smartMarketForecast as string)
    : null;

  const formatLargeNumber = (num: number): string => {
    if (num === 0) return "";
    return num
      .toString()
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <View style={styles.infoRow}>
              <View
                style={{ justifyContent: "space-between", paddingVertical: 8 }}
              >
                <Typo size={18} fontWeight={"500"}>
                  Güncel Birikim
                </Typo>
                <Typo size={22} color={colors.primary}>
                  {formatLargeNumber(smartMarketData?.current_savings)} ₺
                </Typo>
              </View>
              <Image
                source={require("../../assets/images/ai/current-saving.png")}
                style={[
                  styles.icon,
                  {
                    width: 50,
                    height: 50,
                  },
                ]}
              />
            </View>
            <View style={styles.infoRow}>
              <View
                style={{ justifyContent: "space-between", paddingVertical: 8 }}
              >
                <Typo size={18} fontWeight={"500"}>
                  Aylık Gelir
                </Typo>
                <Typo size={22} color={colors.primary}>
                  {formatLargeNumber(smartMarketData?.monthly_income)} ₺
                </Typo>
              </View>
              <Image
                source={require("../../assets/images/ai/income.png")}
                style={[styles.icon, { width: 50, height: 50 }]}
              />
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <View style={styles.infoRow}>
              <View
                style={{ justifyContent: "space-between", paddingVertical: 8 }}
              >
                <Typo size={18} fontWeight={"500"}>
                  Aylık Gider
                </Typo>
                <Typo size={22} color={colors.primary}>
                  {formatLargeNumber(smartMarketData?.monthly_expenses)} ₺
                </Typo>
              </View>
              <Image
                source={require("../../assets/images/ai/expense.png")}
                style={[styles.icon, { width: 50, height: 50 }]}
              />
            </View>
            <View style={styles.infoRow}>
              <View
                style={{ justifyContent: "space-between", paddingVertical: 8 }}
              >
                <Typo size={18} fontWeight={"500"}>
                  Birikim Hedefi
                </Typo>
                <Typo size={22} color={colors.primary}>
                  {formatLargeNumber(smartMarketData?.savings_goal)} ₺
                </Typo>
              </View>
              <Image
                source={require("../../assets/images/ai/goal.png")}
                style={[styles.icon, { width: 50, height: 50 }]}
              />
            </View>
          </View>
          <View style={styles.infoRow}>
            <View
              style={{ justifyContent: "space-between", paddingVertical: 8 }}
            >
              <Typo size={20} fontWeight={"500"}>
                Gerekli Aylık Tasarruf
              </Typo>
              <Typo size={28} color={colors.primary}>
                {formatLargeNumber(smartMarketData?.required_monthly_savings)} ₺
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
                %{" "}
                {smartMarketData?.recommended_savings_percentage
                  .split("%")[0]
                  .replace(".", ",")}
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
                {new Date(smartMarketData?.target_date).toLocaleDateString(
                  "tr-TR"
                )}
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
              <AccordionItem
                title="Genel Yatırım Önerisi"
                leftIcon={
                  <HandCoins
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                <Typo style={styles.accordionText}>
                  - {smartMarketData?.investment_recommendation}
                </Typo>
              </AccordionItem>
              <AccordionItem
                title="Döviz Yatırım Önerisi"
                leftIcon={
                  <Money
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                <Typo style={styles.accordionText}>
                  - {smartMarketData?.currency_investment_advice}
                </Typo>
              </AccordionItem>
              <AccordionItem
                title="Altın Yatırım Önerisi"
                leftIcon={
                  <Coins
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                <Typo style={styles.accordionText}>
                  - {smartMarketData?.gold_investment_advice}
                </Typo>
              </AccordionItem>
              <AccordionItem
                title="Faiz Yatırım Önerisi"
                leftIcon={
                  <SealPercent
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                <Typo style={styles.accordionText}>
                  - {smartMarketData?.interest_rate_advice}
                </Typo>
              </AccordionItem>
              <AccordionItem
                title="Gümüş Yatırım Önerisi"
                leftIcon={
                  <SketchLogo
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                <Typo style={styles.accordionText}>
                  - {smartMarketData?.silver_investment_advice}
                </Typo>
              </AccordionItem>
              <AccordionItem
                title="Borsa Yatırım Önerisi"
                leftIcon={
                  <ChartLineUp
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                <Typo style={styles.accordionText}>
                  - {smartMarketData?.stock_market_advice}
                </Typo>
              </AccordionItem>
            </Accordion>
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
                title="Gider Azaltma Önerisi"
                leftIcon={
                  <MinusCircle
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                <Typo style={styles.accordionText}>
                  - {smartMarketData?.expense_reduction_plan}
                </Typo>
              </AccordionItem>
              <AccordionItem
                title="Ek Öneriler"
                leftIcon={
                  <Lightbulb
                    weight="duotone"
                    color={colors.primary}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                }
              >
                {smartMarketData?.additional_recommendations.map(
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

export default SmartMarketForecast;

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
    alignItems: "center",
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
