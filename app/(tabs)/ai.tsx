import { Image, StyleSheet, View } from "react-native";
import React, { useMemo, useCallback } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import FeatureItem from "@/components/FeatureItem";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/contexts/authContext";
import { useFetchData } from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import { SavingsTargetResultType } from "@/types";
import AiItem from "@/components/AiItem";
import { FlashList } from "@shopify/flash-list";
import { ImageSourcePropType } from "react-native";

interface FeatureType {
  image: ImageSourcePropType;
  name: string;
  description: string;
  bg: string;
  type: "tasarruf" | "birikim" | "piyasa";
}

interface CombinedRecommendationType extends SavingsTargetResultType {
  recommendationType: "tasarruf" | "birikim" | "piyasa";
  name: string;
  title: string;
  image: ImageSourcePropType;
}

const Features: FeatureType[] = [
  {
    image: require("@/assets/images/tasarruf_ai.jpeg"),
    name: "Akıllı Tasarruf Önerileri",
    description:
      "Kullanıcıların tasarruf hedeflerine göre kişiselleştirilmiş öneriler sunarak, daha verimli bir birikim planı oluşturmalarına yardımcı olur.",
    bg: "#46bd9d",
    type: "tasarruf",
  },
  {
    image: require("@/assets/images/birikim_ai.jpeg"),
    name: "Birikim Tahmini ve Simülasyon",
    description:
      "Kullanıcıların mevcut birikimlerini ve hedeflerini göz önde bulundurarak, gelecekteki finansal durumlarını tahmin eder ve simülasyonlar sunar.",
    bg: "#57c8c6",
    type: "birikim",
  },
  {
    image: require("@/assets/images/piyasa_ai.jpeg"),
    name: "Piyasa Verileriyle Akıllı Tavsiyeler",
    description:
      "Güncel piyasa verilerini analiz ederek, kullanıcılara yatırım ve tasarruf stratejileri konusunda akıllıca tavsiyeler sunar.",
    bg: "#1b8db0",
    type: "piyasa",
  },
];

const Header = React.memo(() => (
  <View>
    <View style={{ paddingVertical: spacingY._10 }}>
      <Image
        source={require("@/assets/images/ai-technology.png")}
        style={styles.aiImage}
        resizeMode="contain"
      />
    </View>
    <View style={{ paddingBottom: 10 }}>
      <Typo size={24} fontWeight={"700"}>
        Yapay Zeka Ürünlerimiz
      </Typo>
    </View>
  </View>
));

const MemoizedFeatureItem = React.memo(FeatureItem);
const MemoizedAiItem = React.memo(AiItem);

const Ai = () => {
  const { user } = useAuth();

  const useAllData = () => {
    const smartSavings = useFetchData<SavingsTargetResultType>("smartSavings", [
      where("uid", "==", user?.uid),
      orderBy("created", "desc"),
    ]);

    const savingsForecasts = useFetchData<SavingsTargetResultType>("savingForecasts", [
      where("uid", "==", user?.uid),
      orderBy("created", "desc"),
    ]);

    const smartMarkets = useFetchData<SavingsTargetResultType>("smartMarket", [
      where("uid", "==", user?.uid),
      orderBy("created", "desc"),
    ]);

    return {
      data: {
        smartSavings: smartSavings.data,
        savingsForecasts: savingsForecasts.data,
        smartMarkets: smartMarkets.data,
      },
      loading: smartSavings.loading || savingsForecasts.loading || smartMarkets.loading,
      error: smartSavings.error || savingsForecasts.error || smartMarkets.error,
    };
  };

  const { data, loading, error } = useAllData();

  const combinedRecommendations = useMemo<CombinedRecommendationType[]>(() => {
    const recommendations: CombinedRecommendationType[] = [];

    if (data.smartSavings?.length) {
      recommendations.push(
        ...data.smartSavings.map(saving => ({
          ...saving,
          recommendationType: "tasarruf" as const,
          name: "Akıllı Tasarruf Önerisi",
          title: "Akıllı Tasarruf Önerisi",
          image: require("@/assets/images/tasarruf_ai.jpeg"),
        }))
      );
    }

    if (data.savingsForecasts?.length) {
      recommendations.push(
        ...data.savingsForecasts.map(forecast => ({
          ...forecast,
          recommendationType: "birikim" as const,
          name: "Birikim Tahmini",
          title: "Birikim Tahmini",
          image: require("@/assets/images/birikim_ai.jpeg"),
        }))
      );
    }

    if (data.smartMarkets?.length) {
      recommendations.push(
        ...data.smartMarkets.map(market => ({
          ...market,
          recommendationType: "piyasa" as const,
          name: "Piyasa Analizi",
          title: "Piyasa Analizi",
          image: require("@/assets/images/piyasa_ai.jpeg"),
        }))
      );
    }

    return recommendations;
  }, [data]);

  const renderFeatureItem = useCallback(({ item, index }: { item: FeatureType; index: number }) => (
    <MemoizedFeatureItem item={item} index={index} />
  ), []);

  const renderAiItem = useCallback(({ item, index }: { item: CombinedRecommendationType; index: number }) => (
    <MemoizedAiItem item={item} index={index} />
  ), []);

  const ListFooter = useCallback(() => (
    <View>
      <Typo size={24} style={{ paddingBottom: 10 }} fontWeight={"700"}>
        Son Önerileriniz
      </Typo>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Typo>Yükleniyor...</Typo>
        </View>
      ) : combinedRecommendations.length > 0 ? (
        <FlashList
          data={combinedRecommendations}
          renderItem={renderAiItem}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Typo>Henüz öneri bulunmamaktadır.</Typo>
        </View>
      )}
    </View>
  ), [loading, combinedRecommendations, renderAiItem]);

  return (
    <ScreenWrapper >
      <FlashList
        ListHeaderComponent={Header}
        data={Features}
        renderItem={renderFeatureItem}
        estimatedItemSize={150}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.header}
      />
    </ScreenWrapper>
  );
};

export default React.memo(Ai);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacingX._15,
  },
  aiImage: {
    width: "100%",
    height: verticalScale(100),
    alignSelf: "center",
    marginBottom: spacingY._15,
  },
  loadingContainer: {
    padding: spacingY._20,
    alignItems: "center",
    backgroundColor: colors.neutral800,
    borderRadius: 12,
  },
  emptyContainer: {
    padding: spacingY._20,
    alignItems: "center",
    backgroundColor: colors.neutral800,
    borderRadius: 12,
  },
});