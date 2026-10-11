import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

export async function hasCompletedOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)) === 'true';
}

export function markOnboardingCompleted(): Promise<void> {
  return AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
}
