import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const getIconName = (routeName: string, isFocused: boolean): keyof typeof Ionicons.glyphMap => {
        switch (routeName) {
            case 'Book':
                return isFocused ? 'calendar' : 'calendar-outline';
            case 'Bookings':
                return isFocused ? 'calendar' : 'calendar-outline';
            case 'Profile':
                return isFocused ? 'person' : 'person-outline';
            default:
                return 'help-outline';
        }
    };

    return (
        <View style={styles.container}>
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
                        <Ionicons
                            name={getIconName(route.name, isFocused)}
                            size={24}
                            color={isFocused ? colors.white : colors.textGray}
                        />
                        <Text style={[styles.label, isFocused && styles.labelFocused]}>
                            {String(label)}
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
        height: 56,
        paddingHorizontal: 24,
        paddingVertical: 9,
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
    },
    labelFocused: {
        color: colors.white,
    },
});

