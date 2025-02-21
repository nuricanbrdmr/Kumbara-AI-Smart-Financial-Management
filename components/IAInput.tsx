import React from "react";
import Input from "./Input";
import NumberInput from "./NumberInput";
import { SmartSavingDataType, SavingsTargetType } from "@/types";

interface FieldItem {
  placeholder: string;
  label: string;
  type: string;
  value: string | number;
}

interface IAInputProps {
  item: FieldItem;
  id: string | string[];
  setAiSavingsData: React.Dispatch<React.SetStateAction<SmartSavingDataType>>;
  AiSavingsData: SmartSavingDataType;
  setAccumulationOrMarketData: React.Dispatch<React.SetStateAction<SavingsTargetType>>;
  accumulationOrMarketData: SavingsTargetType;
}

const formatLargeNumber = (num: number): string => {
  if (num === 0) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const IAInput: React.FC<IAInputProps> = ({
  item,
  id,
  setAiSavingsData,
  AiSavingsData,
  setAccumulationOrMarketData,
  accumulationOrMarketData,
}) => {
  if (id === "tasarruf" && (item.type === "city" || item.type === "job")) {
    return (
      <Input
        value={item.value as string}
        onChangeText={(value: string) =>
          setAiSavingsData({
            ...AiSavingsData,
            [item.type]: value,
          })
        }
        placeholder={item.placeholder}
      />
    );
  }

  return (
    <NumberInput
      value={item.value === 0 ? "" : formatLargeNumber(item.value as number)}
      onChangeText={(value: string) =>
        id === "tasarruf"
          ? setAiSavingsData({
              ...AiSavingsData,
              [item.type]: Number(value.replace(/\./g, "")),
            })
          : setAccumulationOrMarketData({
              ...accumulationOrMarketData,
              [item.type]: Number(value.replace(/\./g, "")),
            })
      }
      placeholder={item.placeholder}
    />
  );
};

export default IAInput;