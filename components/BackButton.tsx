import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { CaretLeft } from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import { useRouter } from "expo-router";

const BackButton = ({ style, iconSize = 26, routerName }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[style, styles.button]}
      onPress={() => {
        routerName ? router.push(routerName) : router.back();
      }}
    >
      <CaretLeft size={iconSize} color={colors.white} weight="bold" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
