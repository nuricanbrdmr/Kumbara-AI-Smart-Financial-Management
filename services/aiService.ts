import {
  ResponseType,
  SavingsTargetResultType,
  SmartMarketResultType,
  SmartSavingDataType,
  SmartSavingResultType,
} from "@/types";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createSmartSavingResult = async (
  aiData: Partial<SmartSavingResultType>
): Promise<ResponseType> => {
  try {
    let aiToSave = { ...aiData };

    if (!aiData?.id) {
      aiToSave.created = new Date();
    }

    const aiRef = aiData.id
      ? doc(firestore, "smartSavings", aiData.id)
      : doc(collection(firestore, "smartSavings"));

    await setDoc(aiRef, aiToSave, { merge: true });
    return { success: true, data: { ...aiToSave, id: aiRef.id } };
  } catch (error) {
    return {
      success: false,
      msg: "Error creating or updating smart saving result",
    };
  }
};

export const createSavingForecastResult = async (
  aiData: Partial<SavingsTargetResultType>
): Promise<ResponseType> => {
  try {
    let aiToSave = { ...aiData };

    if (!aiData?.id) {
      aiToSave.created = new Date();
    }

    const aiRef = aiData.id
      ? doc(firestore, "savingForecasts", aiData.id)
      : doc(collection(firestore, "savingForecasts"));

    await setDoc(aiRef, aiToSave, { merge: true });
    return { success: true, data: { ...aiToSave, id: aiRef.id } };
  } catch (error) {
    return {
      success: false,
      msg: "Error creating or updating saving forecast result",
    };
  }
};

export const createSmartMarketForecastResult = async (
  aiData: Partial<SmartMarketResultType>
): Promise<ResponseType> => {
  try {
    let aiToSave = { ...aiData };

    if (!aiData?.id) {
      aiToSave.created = new Date();
    }

    const aiRef = aiData.id
      ? doc(firestore, "smartMarket", aiData.id)
      : doc(collection(firestore, "smartMarket"));

    await setDoc(aiRef, aiToSave, { merge: true });
    return { success: true, data: { ...aiToSave, id: aiRef.id } };
  } catch (error) {
    return {
      success: false,
      msg: "Error creating or updating smart market result",
    };
  }
};

export const deleteAiResult = async (
  aiId: string,
  aiName: string
): Promise<ResponseType> => {
  try {
    const aiRef = doc(firestore, aiName, aiId);
    await deleteDoc(aiRef);
    return { success: true, msg: "Ai result deleted successfully" };
  } catch (error) {
    return { success: false, msg: "Error deleting ai result" };
  }
};
