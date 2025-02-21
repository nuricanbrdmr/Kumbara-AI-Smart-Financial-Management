import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";


export const UpdateUser = async (
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try {

        if (updatedData.image && updatedData.image.uri) {
            const imageUploadRes = await uploadFileToCloudinary(updatedData.image, "users");
            if (!imageUploadRes.success) {
                return { success: false, msg: 'Failed to upload image' };
            }
            updatedData.image = imageUploadRes.data;
        }
        const userRef = doc(firestore, 'users', uid);
        await updateDoc(userRef, updatedData);
        return { success: true, msg: 'User updated successfully' };
    } catch (error) {
        return { success: false, msg: 'Failed to update user' };
    }
}
