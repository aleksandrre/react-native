import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '..';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../theme';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
    BottomTabBookActiveIcon,
    BottomTabBookIcon,
    BottomTabBookingsActiveIcon,
    BottomTabBookingsIcon,
    BottomTabProfileActiveIcon,
    BottomTabProfileIcon,
} from '../icons/BottomTabIcons';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const getTabLabel = (routeName: string): string => {
        switch (routeName) {
            case 'Book': return t('tabs.book');
            case 'Bookings': return t('tabs.bookings');
            case 'Profile': return t('tabs.profile');
            default: return routeName;
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 9) }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isFocused }}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        style={styles.tab}
                    >
                        {(() => {
                            const iconColor = isFocused ? colors.white : colors.textGray;
                            switch (route.name) {
                                case 'Book':
                                    return isFocused ? (
                                        <BottomTabBookActiveIcon />
                                    ) : (
                                        <BottomTabBookIcon color={iconColor} />
                                    );
                                case 'Bookings':
                                    return isFocused ? (
                                        <BottomTabBookingsActiveIcon />
                                    ) : (
                                        <BottomTabBookingsIcon color={iconColor} />
                                    );
                                case 'Profile':
                                    return isFocused ? (
                                        <BottomTabProfileActiveIcon />
                                    ) : (
                                        <BottomTabProfileIcon color={iconColor} />
                                    );
                                default:
                                    return null;
                            }
                        })()}
                        <Text style={[styles.label, isFocused && styles.labelFocused]}>
                            {getTabLabel(route.name)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        minHeight: 56,
        paddingHorizontal: 24,
        paddingTop: 9,
        borderTopWidth: 1,
        borderTopColor: 'rgba(96, 35, 90, 0.5)',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap:2
    },
    label: {
        fontSize: 10,
        color: colors.textGray,
        fontFamily: typography.fontFamily,
    },
    labelFocused: {
        color: colors.white,
    },
});

