import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
  ONBOARDING_COMPLETED_KEY,
} from '../utils/onboarding';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('onboarding persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('recognizes a completed onboarding marker', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

    await expect(hasCompletedOnboarding()).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(ONBOARDING_COMPLETED_KEY);
  });

  it('does not treat other values as completed', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('false');

    await expect(hasCompletedOnboarding()).resolves.toBe(false);
  });

  it('writes the shared completion marker', async () => {
    await markOnboardingCompleted();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(ONBOARDING_COMPLETED_KEY, 'true');
  });
});
