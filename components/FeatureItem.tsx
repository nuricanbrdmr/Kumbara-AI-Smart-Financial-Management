import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

const FeatureItem = ({ item, index }: { item: any; index: number }) => {
  const router = useRouter();
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(modals)/aiModal",
            params: {
              id: item?.type,
            },
          })
        }
        style={[styles.container, { backgroundColor: item.bg }]}
      >
        <View style={styles.flexRow}>
          <Image
            source={item.image}
            style={[styles.image, { borderColor: item.bg }]}
          />
          <Typo size={16} fontWeight={"700"}>
            {item.name}
          </Typo>
        </View>
        <Typo
          size={14}
          style={styles.description}
          color={colors.neutral900}
          fontWeight={"500"}
        >
          {item.description}
        </Typo>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FeatureItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral800,
    marginBottom: verticalScale(17),
    padding: spacingX._12,
    borderRadius: radius._12,
  },
  image: {
    width: verticalScale(45),
    height: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._10,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  description: {
    paddingTop: spacingX._10,
  },
});
