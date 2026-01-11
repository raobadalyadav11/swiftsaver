// App Navigator - Root navigation structure

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen, OnboardingScreen } from '../screens';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from '../types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer
            theme={{
                dark: true,
                colors: {
                    primary: colors.primary,
                    background: colors.background,
                    card: colors.surface,
                    text: colors.textPrimary,
                    border: colors.border,
                    notification: colors.error,
                },
                fonts: {
                    regular: { fontFamily: 'System', fontWeight: '400' },
                    medium: { fontFamily: 'System', fontWeight: '500' },
                    bold: { fontFamily: 'System', fontWeight: '700' },
                    heavy: { fontFamily: 'System', fontWeight: '800' },
                },
            }}
        >
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Main" component={TabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
