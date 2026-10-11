/**
 * GiftMemoriesScreen - Gift history and memories
 * 
 * Shows:
 * - Gifts you've sent (with replay/re-gift options)
 * - Gifts you've received (with play count)
 * - Gifting stats (gamification)
 * 
 * Retention feature: Keeps users coming back to see their gift history
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, radii } from '../design-tokens/theme';
import { contentDatabase } from '../services/ContentDatabase';

interface GiftMemory {
  id: string;
  gameName: string;
  date: Date;
}

interface SentMemory extends GiftMemory {
  recipientName: string;
}

interface ReceivedMemory extends GiftMemory {
  senderName: string;
  playCount: number;
}

interface GiftStats {
  totalSent: number;
  totalReceived: number;
  streak: number;
  badge: string;
}

export default function GiftMemoriesScreen() {
  const navigation = useNavigation();
  const { theme, seasonalTheme } = useTheme();
  const colors = seasonalTheme.colors;
  
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [sentMemories, setSentMemories] = useState<SentMemory[]>([]);
  const [receivedMemories, setReceivedMemories] = useState<ReceivedMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<GiftStats>({
    totalSent: 0,
    totalReceived: 0,
    streak: 0,
    badge: 'Newcomer',
  });

  const loadMemories = useCallback(async () => {
    try {
      const memories = await contentDatabase.getGiftMemories();
      setSentMemories(memories.sent);
      setReceivedMemories(memories.received);
      
      // Calculate stats
      const totalSent = memories.sent.length;
      const totalReceived = memories.received.length;
      
      // Calculate streak (simplified - would be more sophisticated in production)
      let streak = 0;
      const sortedSent = [...memories.sent].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      if (sortedSent.length > 0) {
        const now = new Date();
        const lastGift = new Date(sortedSent[0].date);
        const daysSinceLastGift = Math.floor(
          (now.getTime() - lastGift.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLastGift <= 7) {
          streak = 1;
          // Count consecutive weeks with gifts
          const weekStart = new Date(lastGift);
          weekStart.setDate(weekStart.getDate() - 7);
          
          for (let i = 1; i < sortedSent.length; i++) {
            const giftDate = new Date(sortedSent[i].date);
            if (giftDate >= weekStart) {
              // Gift in previous week, continue streak
              streak++;
              weekStart.setDate(weekStart.getDate() - 7);
            } else {
              break;
            }
          }
        }
      }
      
      // Determine badge
      let badge = 'Newcomer';
      if (totalSent >= 50) badge = 'Gift Legend';
      else if (totalSent >= 25) badge = 'Gift Master';
      else if (totalSent >= 10) badge = 'Gift Enthusiast';
      else if (totalSent >= 5) badge = 'Generous Soul';
      else if (totalSent >= 1) badge = 'First Timer';
      
      setStats({ totalSent, totalReceived, streak, badge });
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMemories();
    setRefreshing(false);
  }, [loadMemories]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderEmptyState = () => (
    <Animated.View entering={FadeIn.duration(500)} style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.accent + '20' }]}>
        <Icon 
          name={activeTab === 'sent' ? 'gift-outline' : 'inbox'} 
          size={48} 
          color={colors.accent} 
        />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {activeTab === 'sent' ? 'No gifts sent yet' : 'No gifts received yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
        {activeTab === 'sent' 
          ? 'Start creating gifts to see them here'
          : 'When someone sends you a gift, it will appear here'
        }
      </Text>
      {activeTab === 'sent' && (
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.emptyButtonText, { color: colors.background }]}>
            Create a Gift
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  const renderSentMemory = (memory: SentMemory, index: number) => (
    <Animated.View
      key={memory.id}
      entering={SlideInRight.delay(index * 50).duration(300)}
      style={[styles.memoryCard, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.memoryIcon, { backgroundColor: colors.accent + '15' }]}>
        <Icon name="gift" size={24} color={colors.accent} />
      </View>
      <View style={styles.memoryContent}>
        <Text style={[styles.memoryGame, { color: colors.text }]}>{memory.gameName}</Text>
        <Text style={[styles.memoryMeta, { color: colors.muted }]}>
          To {memory.recipientName} · {formatDate(memory.date)}
        </Text>
      </View>
      <View style={styles.memoryActions}>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.muted + '30' }]}>
          <Icon name="replay" size={18} color={colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.muted + '30' }]}>
          <Icon name="share-variant" size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderReceivedMemory = (memory: ReceivedMemory, index: number) => (
    <Animated.View
      key={memory.id}
      entering={SlideInRight.delay(index * 50).duration(300)}
      style={[styles.memoryCard, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.memoryIcon, { backgroundColor: colors.secondary + '15' }]}>
        <Icon name="inbox-arrow-down" size={24} color={colors.secondary} />
      </View>
      <View style={styles.memoryContent}>
        <Text style={[styles.memoryGame, { color: colors.text }]}>{memory.gameName}</Text>
        <Text style={[styles.memoryMeta, { color: colors.muted }]}>
          From {memory.senderName} · {formatDate(memory.date)}
        </Text>
        {memory.playCount > 0 && (
          <Text style={[styles.playCount, { color: colors.accent }]}>
            Played {memory.playCount} {memory.playCount === 1 ? 'time' : 'times'}
          </Text>
        )}
      </View>
      <View style={styles.memoryActions}>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.muted + '30' }]}>
          <Icon name="play" size={18} color={colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.muted + '30' }]}>
          <Icon name="heart-outline" size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Gift Memories</Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Card */}
        <Animated.View 
          entering={FadeIn.delay(100)}
          style={[styles.statsCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="gift" size={24} color={colors.accent} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalSent}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Sent</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="inbox-arrow-down" size={24} color={colors.secondary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalReceived}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Received</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="fire" size={24} color="#F97316" />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.streak}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Week Streak</Text>
            </View>
          </View>
          
          <View style={[styles.badgeContainer, { backgroundColor: colors.accent + '15' }]}>
            <Icon name="trophy" size={16} color={colors.accent} />
            <Text style={[styles.badgeText, { color: colors.accent }]}>{stats.badge}</Text>
          </View>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'sent' && { backgroundColor: colors.accent + '20' }
            ]}
            onPress={() => setActiveTab('sent')}
          >
            <Icon 
              name="gift" 
              size={18} 
              color={activeTab === 'sent' ? colors.accent : colors.muted} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'sent' ? colors.accent : colors.muted }
            ]}>
              Gifts Sent
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'received' && { backgroundColor: colors.accent + '20' }
            ]}
            onPress={() => setActiveTab('received')}
          >
            <Icon 
              name="inbox-arrow-down" 
              size={18} 
              color={activeTab === 'received' ? colors.accent : colors.muted} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'received' ? colors.accent : colors.muted }
            ]}>
              Gifts Received
            </Text>
          </TouchableOpacity>
        </View>

        {/* Memory List */}
        <View style={styles.memoryList}>
          {activeTab === 'sent' && (
            sentMemories.length > 0 
              ? sentMemories.map((memory, index) => renderSentMemory(memory, index))
              : renderEmptyState()
          )}
          {activeTab === 'received' && (
            receivedMemories.length > 0
              ? receivedMemories.map((memory, index) => renderReceivedMemory(memory, index))
              : renderEmptyState()
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Gift Chain Prompt (when received gifts exist) */}
      {activeTab === 'received' && receivedMemories.length > 0 && (
        <Animated.View 
          entering={FadeInUp.delay(500)}
          style={[styles.giftChainPrompt, { backgroundColor: colors.accent }]}
        >
          <View style={styles.giftChainContent}>
            <Text style={[styles.giftChainTitle, { color: colors.background }]}>
              Gift someone back?
            </Text>
            <Text style={[styles.giftChainSubtitle, { color: colors.background + 'CC' }]}>
              Your first gift is free when you've been gifted
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.giftChainButton, { backgroundColor: colors.background }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="gift" size={20} color={colors.accent} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: spacing.xs,
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  badgeText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  tabText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  memoryList: {
    paddingHorizontal: spacing.lg,
  },
  memoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },
  memoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  memoryGame: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  memoryMeta: {
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  playCount: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    marginTop: 2,
  },
  memoryActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.size.base,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  emptyButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  giftChainPrompt: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  giftChainContent: {
    flex: 1,
  },
  giftChainTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  giftChainSubtitle: {
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  giftChainButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
