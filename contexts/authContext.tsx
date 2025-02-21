import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    image: firebaseUser.photoURL,
                });
                updateUserData(firebaseUser.uid);
                router.replace("/(tabs)");
            } else {
                setUser(null);
                router.replace("/(auth)/welcome");
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true, message: "Giriş Başarılı." };
        } catch (error: any) {
            if (error.message.includes("auth/invalid-credential")) {
                return { success: false, msg: "E-posta veya şifre  hatalı" };
            }
            if (error.message.includes("auth/invalid-email")) {
                return { success: false, msg: "E-posta veya şifre  hatalı" };
            }
            if (error.message.includes("auth/user-not-found")) {
                return { success: false, msg: "E-posta veya şifre  hatalı" };
            }
            return { success: false, msg: "E-posta veya şifre  hatalı" };
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", response.user.uid), {
                name: name,
                email: email,
                uid: response.user.uid,
            });
            return { success: true, message: "Kayıt Başarılı" };
        } catch (error: any) {
            if (error.message.includes("auth/email-already-in-use")) {
                return { success: false, msg: "Bu e-posta kullanılıyor." };
            }
            if (error.message.includes("auth/invalid-email")) {
                return { success: false, msg: "Hatalı e-posta girdiniz" };
            }
            return { success: false, msg: "Kayıt oluşturken hata: " + error };
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const updateUserData = async (uid: string) => {
        try {
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data.uid,
                    name: data.name,
                    email: data.email,
                    image: data.image,
                };
                setUser({ ...userData });
            }
        } catch (error) {
            console.error("Error updating user data: ", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
