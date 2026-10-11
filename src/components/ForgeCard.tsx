/**
 * ForgeCard - Cards that glow like they're being forged
 * Features rim lighting, inner glow, and responsive interactions
 */
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii, shadows, motion } from '../design-tokens/theme';

interface ForgeCardProps {
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: 'subtle' | 'normal' | 'intense';
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  padded?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ForgeCard({
  children,
  glowColor,
  glowIntensity = 'normal',
  variant = 'default',
  onPress,
  disabled = false,
  style,
  padded = true,
}: ForgeCardProps) {
  const { theme, isDark } = useTheme();
  
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);
  
  const effectiveGlowColor = glowColor || theme.colors.primary;
  
  const intensityMultiplier = 
    glowIntensity === 'subtle' ? 0.5 : 
    glowIntensity === 'intense' ? 1.5 : 1;
  
  const handlePressIn = useCallback(() => {
    pressed.value = withSpring(1, motion.easing.snappy);
  }, [pressed]);
  
  const handlePressOut = useCallback(() => {
    pressed.value = withSpring(0, motion.easing.gentle);
  }, [pressed]);
  
  // Web hover support
  const handleHoverIn = useCallback(() => {
    hovered.value = withTiming(1, { duration: motion.duration.fast });
  }, [hovered]);
  
  const handleHoverOut = useCallback(() => {
    hovered.value = withTiming(0, { duration: motion.duration.fast });
  }, [hovered]);
  
  const containerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, 0.98],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
    };
  });
  
  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      hovered.value + pressed.value * 0.5,
      [0, 1],
      [isDark ? 0.15 : 0.05, isDark ? 0.35 : 0.15],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: opacity * intensityMultiplier,
    };
  });
  
  // Rim light style (for dark mode)
  const rimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      hovered.value,
      [0, 1],
      [0.2, 0.5],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: isDark ? opacity * intensityMultiplier : 0,
    };
  });
  
  const getBackgroundColor = () => {
    switch (variant) {
      case 'glass':
        return isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)';
      case 'outlined':
        return 'transparent';
      case 'elevated':
        return isDark ? theme.colors.card : '#fff';
      default:
        return theme.colors.card;
    }
  };
  
  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: isDark ? effectiveGlowColor + '40' : theme.colors.border,
      };
    }
    if (variant === 'glass') {
      return {
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      };
    }
    return {};
  };
  
  const getShadowStyle = () => {
    if (variant === 'elevated') {
      return isDark 
        ? shadows.forge.md(effectiveGlowColor)
        : shadows.light.md;
    }
    if (variant === 'default') {
      return isDark
        ? shadows.forge.sm(effectiveGlowColor)
        : shadows.light.sm;
    }
    return {};
  };
  
  const content = (
    <>
      {/* Glow layer */}
      {isDark && (
        <Animated.View
          style={[
            styles.glowLayer,
            {
              backgroundColor: effectiveGlowColor,
              borderRadius: radii.xl,
            },
            glowStyle,
          ]}
        />
      )}
      
      {/* Rim light */}
      {isDark && variant !== 'outlined' && (
        <Animated.View
          style={[
            styles.rimLight,
            {
              borderRadius: radii.xl,
              borderColor: effectiveGlowColor,
            },
            rimStyle,
          ]}
        />
      )}
      
      {/* Content */}
      <View style={[styles.content, padded && styles.padded]}>
        {children}
      </View>
    </>
  );
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: radii.xl,
    },
    getBorderStyle(),
    getShadowStyle(),
    style,
  ];
  
  if (onPress && !disabled) {
    return (
      <AnimatedTouchable
        style={[cardStyle, containerStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        // @ts-expect-error Web-specific props are not in React Native's shared type.
        onMouseEnter={Platform.OS === 'web' ? handleHoverIn : undefined}
        onMouseLeave={Platform.OS === 'web' ? handleHoverOut : undefined}
        activeOpacity={1}
        disabled={disabled}
      >
        {content}
      </AnimatedTouchable>
    );
  }
  
  return (
    <Animated.View 
      style={[cardStyle, containerStyle]}
      // @ts-expect-error Web-specific props are not in React Native's shared type.
      onMouseEnter={Platform.OS === 'web' ? handleHoverIn : undefined}
      onMouseLeave={Platform.OS === 'web' ? handleHoverOut : undefined}
    >
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  rimLight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  padded: {
    padding: spacing.md,
  },
});
