import { View, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { ChartBar, House, MagicWand, User, Wallet } from 'phosphor-react-native';


export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {

    const tabBarIcons: any = {
        index: (isFocused: boolean) => (
            <House
                size={verticalScale(24)}
                color={isFocused ? colors.primary : colors.neutral400}
                weight={isFocused ? 'fill' : 'regular'}
            />
        ),
        ai: (isFocused: boolean) => (
            <MagicWand
                size={verticalScale(24)}
                color={isFocused ? colors.primary : colors.neutral400}
                weight={isFocused ? 'fill' : 'regular'}
            />
        ),
        profile: (isFocused: boolean) => (
            <User
                size={verticalScale(24)}
                color={isFocused ? colors.primary : colors.neutral400}
                weight={isFocused ? 'fill' : 'regular'}
            />
        ),
        wallet: (isFocused: boolean) => (
            <Wallet
                size={verticalScale(24)}
                color={isFocused ? colors.primary : colors.neutral400}
                weight={isFocused ? 'fill' : 'regular'}
            />
        ),
        statistics: (isFocused: boolean) => (
            <ChartBar
                size={verticalScale(24)}
                color={isFocused ? colors.primary : colors.neutral400}
                weight={isFocused ? 'fill' : 'regular'}
            />
        ),
    };

    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        /* href={buildHref(route.name, route.params)} */
                        key={route.name}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabBarItem}
                    >
                        {
                            tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)
                        }
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}


const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        width: '100%',
        height: Platform.OS === 'ios' ? verticalScale(73) : verticalScale(55),
        backgroundColor: colors.neutral800,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.neutral700,
    },
    tabBarItem: {
        marginBottom: Platform.OS === 'ios' ? spacingY._10 : spacingY._5,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
