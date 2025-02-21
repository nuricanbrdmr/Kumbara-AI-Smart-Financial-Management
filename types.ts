import { Href } from "expo-router";
import { Firestore, Timestamp } from "firebase/firestore";
import { Icon } from "phosphor-react-native";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  ImageStyle,
  PressableProps,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};
export type ModalWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};
export type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
  onPress?: () => void;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}>;

export type IconProps = {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
  routerName?: Href;
};

export type TransactionType = {
  id?: string;
  type: string;
  amount: number;
  category?: string;
  date: Date | Timestamp | string;
  description?: string;
  image?: any;
  uid?: string;
  walletId: string;
};

export type CategoryType = {
  label: string;
  value: string;
  icon: Icon;
  bgColor: string;
};
export type ExpenseCategoriesType = {
  [key: string]: CategoryType;
};

export type TransactionListType = {
  data: TransactionType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
};

export type TransactionItemProps = {
  item: TransactionType;
  index: number;
  handleClick: Function;
};

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
  //   label?: string;
  //   error?: string;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};

export type UserType = {
  uid?: string;
  email?: string | null;
  name: string | null;
  image?: any;
} | null;

export type UserDataType = {
  name: string;
  image?: any;
};

export type AuthContextType = {
  user: UserType;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

export type WalletType = {
  id?: string;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  image: any;
  uid?: string;
  created?: Date;
};

export type AiType = {
  id?: string;
  name: string;
  title: string;
  image: any;
  uid?: string;
  created?: Date;
  recommendationType?: string;
  savingsGoal?: number;
  savings_goal?: number;
  current_savings?: number;
  monthly_income?: number;
  monthly_expenses?: number;
  target_date?: string;
};

export type AiItemProps = {
  item: AiType;
  index: number;
};

export type SmartSavingDataType = {
  age: number;
  job: string;
  city: string;
  income: number;
  fixedExpenses: number;
  dailyExpenses: number;
  luxuryExpenses: number;
  currentSavings: number;
  savingsGoal: number;
};

export type SmartSavingResultType = {
  id?: string;
  uid?: string;
  age: number;
  job: string;
  city: string;
  income: number;
  fixedExpenses: number;
  dailyExpenses: number;
  luxuryExpenses: number;
  currentSavings: number;
  savingsGoal: number;
  recommended_savings_percentage: string;
  expense_categories_to_reduce: string[];
  estimated_months_to_goal: number;
  savings_tips: string[];
  income_increase_strategies: string[];
  created?: Date;
};

export type SavingsTargetType = {
  current_savings: number; // Şu anki birikim miktarı
  monthly_income: number; // Aylık gelir
  monthly_expenses: number; // Aylık giderler
  savings_goal: number; // Hedef birikim miktarı
  target_date: string; // Hedef tarih (ISO 8601 formatında)
};

export type SavingsTargetResultType = {
  id?: string;
  uid?: string;
  current_savings: number; // Mevcut birikim
  monthly_income: number; // Aylık gelir
  monthly_expenses: number; // Aylık giderler
  savings_goal: number; // Hedeflenen birikim
  target_date: string; // Hedef tarih
  required_monthly_savings: number;
  recommended_expense_reduction: number;
  projected_completion_date: string;
  additional_recommendations: string[];
  recommended_savings_percentage: string;
  expense_category_to_reduce: string;
  estimated_months_to_goal: number;
  savings_tips: string[];
  created?: Date;
};

// Kullanıcının finansal verileri
export type SmartMarketDataType = {
  current_savings: number; // Mevcut birikim
  monthly_income: number; // Aylık gelir
  monthly_expenses: number; // Aylık giderler
  savings_goal: number; // Hedeflenen birikim miktarı
  target_date: string; // Hedef tarih
};

// Yatırım tavsiyelerinin döneceği tip
export type SmartMarketResultType = {
  id?: string;
  uid?: string;
  current_savings: number; // Mevcut birikim
  monthly_income: number; // Aylık gelir
  monthly_expenses: number; // Aylık giderler
  savings_goal: number; // Hedeflenen birikim
  target_date: string; // Hedef tarih
  required_monthly_savings: number; // Gerekli aylık birikim
  recommended_savings_percentage: string; // Gerekli aylık birikim oranı
  investment_recommendation: string; // Genel yatırım önerisi
  gold_investment_advice: string; // Altın yatırımı önerisi
  silver_investment_advice: string; // Gümüş yatırımı önerisi
  currency_investment_advice: string; // Döviz yatırımı önerisi
  expense_reduction_plan: string; // Gider azaltma planı
  interest_rate_advice: string; // Faiz oranı tavsiyesi
  stock_market_advice: string; // Hisse senedi piyasası tavsiyesi
  additional_recommendations: string[]; // Ekstra öneriler
  created?: Date;
};
