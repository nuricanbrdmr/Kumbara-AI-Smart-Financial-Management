import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ImageUploadProps } from '@/types'
import Typo from './Typo'
import { colors, radius } from '@/constants/theme'
import { UploadSimple, XCircle } from 'phosphor-react-native'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { getFilePath } from '@/services/imageService'
import * as ImagePicker from 'expo-image-picker'

const ImageUpload = ({
    file = null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder = ""
}: ImageUploadProps) => {

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            onSelect(result.assets[0])
        }
    }

    return (
        <View>
            {
                !file && (
                    <TouchableOpacity style={[styles.inputContainer, containerStyle && containerStyle]} onPress={pickImage}>
                        <UploadSimple size={verticalScale(24)} color={colors.neutral200} />
                        {placeholder && <Typo size={15} color={colors.neutral200}>{placeholder}</Typo>}
                    </TouchableOpacity>
                )
            }

            {
                file && (
                    <View style={[styles.image, imageStyle && imageStyle]}>
                        <Image
                            source={getFilePath(file)}
                            style={{ flex: 1 }}
                            contentFit='cover'
                            transition={100}
                        />
                        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                            <XCircle
                                size={verticalScale(24)}
                                weight='fill'
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                )
            }

        </View >
    )
}

export default ImageUpload

const styles = StyleSheet.create({
    inputContainer: {
        height: verticalScale(54),
        backgroundColor: colors.neutral700,
        borderRadius: radius._15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.neutral500,
        borderStyle: 'dashed',
    },
    image: {
        height: scale(150),
        width: scale(150),
        borderRadius: radius._15,
        borderCurve: 'continuous',
        overflow: 'hidden',
    },
    clearButton: {
        position: 'absolute',
        right: scale(6),
        top: scale(6),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 10,
        /* backgroundColor: "red",
        borderRadius: 100, */
    }
})