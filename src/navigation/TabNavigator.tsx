// Tab Navigator - Bottom tab navigation

import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeScreen, DownloadsScreen, LibraryScreen, SettingsScreen } from '../screens';
import { MainTabParamList } from '../types';
import { colors, spacing, textStyles, iconSize } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" size={size || iconSize.base} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Downloads"
                component={DownloadsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="download" size={size || iconSize.base} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Library"
                component={LibraryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="folder-play" size={size || iconSize.base} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cog" size={size || iconSize.base} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: Platform.OS === 'ios' ? 84 : 64,
        paddingTop: spacing.sm,
        paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.sm,
    },
    tabBarLabel: {
        ...textStyles.tabLabel,
        marginTop: spacing.xs,
    },
    tabBarItem: {
        paddingVertical: spacing.xs,
    },
});

export default TabNavigator;
