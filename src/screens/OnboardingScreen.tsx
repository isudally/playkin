import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, ArtStyle } from '../types';
import { hasCompletedOnboarding, markOnboardingCompleted } from '../utils/onboarding';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

type OnboardingStep = 'welcome' | 'goal' | 'style' | 'experience';

interface OnboardingData {
  goal: 'create' | 'gift' | 'learn' | 'explore' | null;
  artStyle: ArtStyle | null;
  experience: 'beginner' | 'intermediate' | 'advanced' | null;
}

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({
    goal: null,
    artStyle: null,
    experience: null,
  });

  useEffect(() => {
    let active = true;

    hasCompletedOnboarding()
      .then((completed) => {
        if (active && completed) {
          navigation.replace('MainTabs');
        }
      })
      .catch((error) => {
        // A storage failure should leave the first-run flow usable.
        console.warn('Failed to read onboarding state:', error);
      });

    return () => {
      active = false;
    };
  }, [navigation]);

  const completeOnboarding = async () => {
    // Save that onboarding has been completed
    try {
      await markOnboardingCompleted();
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
      // Continue anyway - user experience is more important than state persistence
    }
    
    // Navigate based on user's goal
    if (data.goal === 'gift') {
      navigation.navigate('GiftForgeWizard');
    } else if (data.goal === 'create') {
      navigation.replace('MainTabs', { screen: 'Templates' });
    } else if (data.goal === 'learn') {
      navigation.replace('MainTabs', { screen: 'Genie' });
    } else {
      navigation.replace('MainTabs', { screen: 'Home' });
    }
  };

  const renderWelcome = () => (
    <Animated.View 
      entering={FadeInUp.duration(600)}
      style={styles.stepContainer}
    >
      <View style={styles.heroIcon}>
        <View style={[styles.heroIconOuter, { backgroundColor: theme.colors.primary + '20' }]}>
          <View style={[styles.heroIconInner, { backgroundColor: theme.colors.primary }]}>
            <Icon name="rocket-launch" size={48} color="#fff" />
          </View>
        </View>
        <Animated.View style={styles.sparkle1}>
          <Icon name="star-four-points" size={20} color={theme.colors.accent} />
        </Animated.View>
        <Animated.View style={styles.sparkle2}>
          <Icon name="star-four-points" size={16} color={theme.colors.secondary} />
        </Animated.View>
      </View>
      
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        Welcome to GameForge! 🎮
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.text + '90' }]}>
        Create professional games, VR experiences, and personalized gift mini-games with zero coding required.
      </Text>
      
      <View style={styles.featureList}>
        {[
          { icon: 'palette', text: '15 Game Templates' },
          { icon: 'robot', text: 'AI Assistant' },
          { icon: 'virtual-reality', text: 'VR/AR Support' },
          { icon: 'gift', text: 'Gift Games' },
        ].map((feature, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.duration(400).delay(800 + index * 100)}
            style={[styles.featureItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={[styles.featureIconBg, { backgroundColor: theme.colors.primary + '15' }]}>
              <Icon name={feature.icon} size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              {feature.text}
            </Text>
          </Animated.View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setStep('goal')}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
        <Icon name="arrow-right" size={20} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.skipButtonText, { color: theme.colors.text + '80' }]}>
          Skip for now
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderGoal = () => (
    <Animated.View 
      entering={FadeInUp.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        What do you want to build? 🎯
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.text + '90' }]}>
        This helps us personalize your experience
      </Text>
      
      <View style={styles.optionsGrid}>
        {[
          { 
            id: 'gift' as const, 
            icon: 'gift', 
            title: 'Gift Games', 
            description: 'Create personalized mini-games for special occasions',
            color: theme.colors.accent,
          },
          { 
            id: 'create' as const, 
            icon: 'gamepad-variant', 
            title: 'Full Games', 
            description: 'Build complete games with templates',
            color: theme.colors.primary,
          },
          { 
            id: 'learn' as const, 
            icon: 'school', 
            title: 'Learn', 
            description: 'Educational content and tutorials',
            color: theme.colors.success,
          },
          { 
            id: 'explore' as const, 
            icon: 'compass', 
            title: 'Explore', 
            description: 'Just looking around',
            color: theme.colors.secondary,
          },
        ].map((option, index) => (
          <Animated.View
            key={option.id}
            entering={FadeInUp.duration(400).delay(200 + index * 100)}
          >
            <TouchableOpacity
              style={[
                styles.optionCard,
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: data.goal === option.id ? option.color : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => setData({ ...data, goal: option.id })}
            >
              <View style={[styles.optionIconBg, { backgroundColor: option.color + '20' }]}>
                <Icon name={option.icon} size={32} color={option.color} />
              </View>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                {option.title}
              </Text>
              <Text style={[styles.optionDescription, { color: theme.colors.text + '80' }]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => setStep('welcome')}
        >
          <Icon name="arrow-left" size={20} color={theme.colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
            Back
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { 
              backgroundColor: data.goal ? theme.colors.primary : theme.colors.text + '30',
              flex: 2,
            }
          ]}
          onPress={() => data.goal && setStep('style')}
          disabled={!data.goal}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderStyle = () => (
    <Animated.View 
      entering={FadeInUp.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        Pick your style 🎨
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.text + '90' }]}>
        Choose a visual aesthetic for your games
      </Text>
      
      <ScrollView 
        style={styles.styleScroll}
        showsVerticalScrollIndicator={false}
      >
        {[
          { 
            id: 'pixel' as ArtStyle, 
            name: 'Pixel Perfect', 
            icon: 'grid',
            description: 'Retro 8-bit and 16-bit art style',
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          },
          { 
            id: 'lowpoly' as ArtStyle, 
            name: 'Low Poly 3D', 
            icon: 'cube-outline',
            description: 'Minimalist geometric style',
            colors: ['#95E1D3', '#F38181', '#AA96DA'],
          },
          { 
            id: 'handdrawn' as ArtStyle, 
            name: 'Hand-Drawn', 
            icon: 'draw',
            description: 'Sketch and cartoon style',
            colors: ['#FFD93D', '#6BCB77', '#4D96FF'],
          },
          { 
            id: 'cyberpunk' as ArtStyle, 
            name: 'Neon Cyberpunk', 
            icon: 'lightning-bolt',
            description: 'Futuristic with glowing effects',
            colors: ['#FF00FF', '#00FFFF', '#FF1744'],
          },
          { 
            id: 'watercolor' as ArtStyle, 
            name: 'Watercolor Dreams', 
            icon: 'water',
            description: 'Soft artistic rendering',
            colors: ['#FFB6B9', '#BAE1FF', '#C9F4AA'],
          },
        ].map((style, index) => (
          <Animated.View
            key={style.id}
            entering={FadeInUp.duration(400).delay(200 + index * 80)}
          >
            <TouchableOpacity
              style={[
                styles.styleCard,
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: data.artStyle === style.id ? theme.colors.primary : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => setData({ ...data, artStyle: style.id })}
            >
              <View style={styles.styleHeader}>
                <View style={[styles.styleIconBg, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Icon name={style.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.styleTextContent}>
                  <Text style={[styles.styleName, { color: theme.colors.text }]}>
                    {style.name}
                  </Text>
                  <Text style={[styles.styleDescription, { color: theme.colors.text + '80' }]}>
                    {style.description}
                  </Text>
                </View>
              </View>
              <View style={styles.colorPalette}>
                {style.colors.map((color, idx) => (
                  <View key={idx} style={[styles.colorSwatch, { backgroundColor: color }]} />
                ))}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => setStep('goal')}
        >
          <Icon name="arrow-left" size={20} color={theme.colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
            Back
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { 
              backgroundColor: data.artStyle ? theme.colors.primary : theme.colors.text + '30',
              flex: 2,
            }
          ]}
          onPress={() => data.artStyle && setStep('experience')}
          disabled={!data.artStyle}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderExperience = () => (
    <Animated.View 
      entering={FadeInUp.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        What's your experience level? 💪
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.text + '90' }]}>
        We'll match you with appropriate templates
      </Text>
      
      <View style={styles.experienceList}>
        {[
          { 
            id: 'beginner' as const, 
            icon: 'star-outline', 
            title: 'Beginner', 
            description: 'New to game development',
            color: theme.colors.success,
          },
          { 
            id: 'intermediate' as const, 
            icon: 'star-half-full', 
            title: 'Intermediate', 
            description: 'Some experience with games',
            color: theme.colors.warning,
          },
          { 
            id: 'advanced' as const, 
            icon: 'star', 
            title: 'Advanced', 
            description: 'Experienced game developer',
            color: theme.colors.error,
          },
        ].map((exp, index) => (
          <Animated.View
            key={exp.id}
            entering={FadeInUp.duration(400).delay(200 + index * 100)}
          >
            <TouchableOpacity
              style={[
                styles.experienceCard,
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: data.experience === exp.id ? exp.color : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => setData({ ...data, experience: exp.id })}
            >
              <View style={[styles.experienceIconBg, { backgroundColor: exp.color + '20' }]}>
                <Icon name={exp.icon} size={28} color={exp.color} />
              </View>
              <View style={styles.experienceContent}>
                <Text style={[styles.experienceTitle, { color: theme.colors.text }]}>
                  {exp.title}
                </Text>
                <Text style={[styles.experienceDescription, { color: theme.colors.text + '80' }]}>
                  {exp.description}
                </Text>
              </View>
              {data.experience === exp.id && (
                <Icon name="check-circle" size={24} color={exp.color} />
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => setStep('style')}
        >
          <Icon name="arrow-left" size={20} color={theme.colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
            Back
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { 
              backgroundColor: data.experience ? theme.colors.primary : theme.colors.text + '30',
              flex: 2,
            }
          ]}
          onPress={completeOnboarding}
          disabled={!data.experience}
        >
          <Text style={styles.primaryButtonText}>Start Creating!</Text>
          <Icon name="rocket-launch" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {['welcome', 'goal', 'style', 'experience'].map((s, index) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor: 
                    ['welcome', 'goal', 'style', 'experience'].indexOf(step) >= index
                      ? theme.colors.primary
                      : theme.colors.text + '30',
                },
              ]}
            />
          ))}
        </View>
        
        {step === 'welcome' && renderWelcome()}
        {step === 'goal' && renderGoal()}
        {step === 'style' && renderStyle()}
        {step === 'experience' && renderExperience()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heroIcon: {
    alignSelf: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  heroIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 10,
    left: -10,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featureList: {
    marginBottom: 32,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  optionCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
      default: { elevation: 3 },
    }),
  },
  optionIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  styleScroll: {
    flex: 1,
    marginBottom: 16,
  },
  styleCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
      default: { elevation: 3 },
    }),
  },
  styleHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  styleIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  styleTextContent: {
    flex: 1,
  },
  styleName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  styleDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  experienceList: {
    marginBottom: 32,
    gap: 12,
  },
  experienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
      default: { elevation: 3 },
    }),
  },
  experienceIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  experienceContent: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
      default: { elevation: 4 },
    }),
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
