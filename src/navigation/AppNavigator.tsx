import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreenNew';
import ProjectListScreen from '../screens/ProjectListScreen';
import ProjectEditorScreen from '../screens/ProjectEditorScreen';
import TemplateSelectorScreen from '../screens/TemplateSelectorScreen';
import TemplatePreviewScreen from '../screens/TemplatePreviewScreen';
import DodoAssistantScreen from '../screens/DodoAssistantScreen';
import AssetLibraryScreen from '../screens/AssetLibraryScreen';
import MarketingDashboardScreen from '../screens/MarketingDashboardScreen';
import VREditorScreen from '../screens/VREditorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PublishScreen from '../screens/PublishScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
// GiftForge screens
import GiftForgeWizardScreen from '../screens/GiftForgeWizardScreen';
import GiftForgeResultScreen from '../screens/GiftForgeResultScreen';
import GiftForgeGameScreen from '../screens/GiftForgeGameScreen';
// Agent screens (from PR #5)
import { AgentDashboardScreen } from '../screens/AgentDashboardScreen';
// Command Centre (admin dashboard)
import CommandCentreScreen from '../screens/CommandCentreScreen';
// Instant Gift & Gift Memories
import InstantGiftScreen from '../screens/InstantGiftScreen';
import GiftMemoriesScreen from '../screens/GiftMemoriesScreen';

import { useTheme } from '../contexts/ThemeContext';
import { MainTabParamList, RootStackParamList } from '../types';
import { forgeColors } from '../design-tokens/theme';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { theme, isDark } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Projects':
              iconName = focused ? 'folder' : 'folder-outline';
              break;
            case 'Templates':
              iconName = focused ? 'view-grid' : 'view-grid-outline';
              break;
            case 'Genie': // Keep route name for compatibility
              iconName = 'bird'; // Dodo icon!
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: forgeColors.forge[500],
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: isDark ? forgeColors.stone[900] : '#fff',
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ProjectListScreen} />
      <Tab.Screen name="Templates" component={TemplateSelectorScreen} />
      <Tab.Screen 
        name="Genie" 
        component={DodoAssistantScreen} 
        options={{ tabBarLabel: 'Dodo' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme, isDark } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? forgeColors.stone[900] : '#fff',
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProjectEditor" 
        component={ProjectEditorScreen}
        options={{ title: 'Project Editor' }}
      />
      <Stack.Screen 
        name="TemplatePreview" 
        component={TemplatePreviewScreen}
        options={{ title: 'Template Preview' }}
      />
      <Stack.Screen 
        name="AssetLibrary" 
        component={AssetLibraryScreen}
        options={{ title: 'Asset Library' }}
      />
      <Stack.Screen 
        name="MarketingDashboard" 
        component={MarketingDashboardScreen}
        options={{ title: 'Marketing Dashboard' }}
      />
      <Stack.Screen 
        name="VREditor" 
        component={VREditorScreen}
        options={{ title: 'VR Editor' }}
      />
      <Stack.Screen 
        name="Publish" 
        component={PublishScreen}
        options={{ title: 'Publish Game' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      {/* GiftForge screens */}
      <Stack.Screen 
        name="GiftForgeWizard" 
        component={GiftForgeWizardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GiftForgeResult" 
        component={GiftForgeResultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GiftForgeGame" 
        component={GiftForgeGameScreen}
        options={{ headerShown: false }}
      />
      {/* Agent screens */}
      <Stack.Screen 
        name="AgentDashboard" 
        component={AgentDashboardScreen}
        options={{ headerShown: false }}
      />
      {/* Command Centre (admin) */}
      <Stack.Screen 
        name="CommandCentre" 
        component={CommandCentreScreen}
        options={{ headerShown: false }}
      />
      {/* Instant Gift flow */}
      <Stack.Screen 
        name="InstantGift" 
        component={InstantGiftScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      {/* Gift Memories */}
      <Stack.Screen 
        name="GiftMemories" 
        component={GiftMemoriesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
