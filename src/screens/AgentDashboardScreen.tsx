import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { agentOrchestrator, AgentWorkflow } from '../services/AgentOrchestrator';
import { LinearGradient } from 'expo-linear-gradient';

type AgentDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'AgentDashboard'>;

export const AgentDashboardScreen: React.FC = () => {
  const navigation = useNavigation<AgentDashboardNavigationProp>();
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [runningPipeline, setRunningPipeline] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = () => {
    const allWorkflows = agentOrchestrator.listWorkflows();
    setWorkflows(allWorkflows.slice(0, 10)); // Latest 10
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWorkflows();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRunPipeline = async () => {
    setRunningPipeline(true);

    try {
      Alert.alert('Running Pipeline', 'Starting agent pipeline...');
      const result = await agentOrchestrator.runCompletePipeline();

      Alert.alert(
        'Pipeline Complete!',
        `Generated ${result.templates.length} templates\nOverall scores: ${result.testResults
          .map((r) => r.overallScore)
          .join(', ')}`
      );

      loadWorkflows();
    } catch (error) {
      Alert.alert('Error', 'Pipeline failed. Check logs.');
    } finally {
      setRunningPipeline(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'running':
        return '#3B82F6';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'running':
        return '⟳';
      case 'failed':
        return '✗';
      default:
        return '○';
    }
  };

  const renderWorkflowCard = (workflow: AgentWorkflow) => {
    const duration = workflow.completedAt
      ? Math.round((workflow.completedAt.getTime() - workflow.createdAt.getTime()) / 1000)
      : null;

    return (
      <TouchableOpacity
        key={workflow.id}
        style={styles.workflowCard}
        onPress={() =>
          Alert.alert(
            workflow.name,
            `Status: ${workflow.status}\nTasks: ${workflow.tasks.length}\n${
              duration ? `Duration: ${duration}s` : 'In progress...'
            }`
          )
        }
      >
        <View style={styles.workflowHeader}>
          <View style={styles.workflowTitleContainer}>
            <Text
              style={[
                styles.statusIcon,
                { color: getStatusColor(workflow.status) },
              ]}
            >
              {getStatusIcon(workflow.status)}
            </Text>
            <View>
              <Text style={styles.workflowName}>{workflow.name}</Text>
              <Text style={styles.workflowDescription}>{workflow.description}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(workflow.status) },
            ]}
          >
            <Text style={styles.statusText}>{workflow.status}</Text>
          </View>
        </View>

        <View style={styles.workflowMeta}>
          <Text style={styles.metaText}>
            {workflow.tasks.length} tasks
          </Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>
            {new Date(workflow.createdAt).toLocaleDateString()}
          </Text>
          {duration && (
            <>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{duration}s</Text>
            </>
          )}
        </View>

        {/* Task Progress */}
        <View style={styles.taskProgress}>
          {workflow.tasks.slice(0, 5).map((task: any, index: number) => (
            <View
              key={task.id}
              style={[
                styles.taskDot,
                { backgroundColor: getStatusColor(task.status) },
              ]}
            />
          ))}
          {workflow.tasks.length > 5 && (
            <Text style={styles.moreTasksText}>+{workflow.tasks.length - 5}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Agent Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Monitor AI agent workflows and performance
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{workflows.length}</Text>
            <Text style={styles.statLabel}>Total Runs</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {workflows.filter((w) => w.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {workflows.filter((w) => w.status === 'running').length}
            </Text>
            <Text style={styles.statLabel}>Running</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={[
              styles.actionButton,
              runningPipeline && styles.actionButtonDisabled,
            ]}
            onPress={handleRunPipeline}
            disabled={runningPipeline}
          >
            <Text style={styles.actionButtonIcon}>
              {runningPipeline ? '⏳' : '▶️'}
            </Text>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Run Complete Pipeline</Text>
              <Text style={styles.actionButtonDescription}>
                Research → Ideas → Templates → Testing
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert('Coming Soon', 'Individual agent runs will be available soon')
            }
          >
            <Text style={styles.actionButtonIcon}>🔍</Text>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Market Research Only</Text>
              <Text style={styles.actionButtonDescription}>
                Scan latest trends and insights
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert('Coming Soon', 'Template testing will be available soon')
            }
          >
            <Text style={styles.actionButtonIcon}>🧪</Text>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Test Templates</Text>
              <Text style={styles.actionButtonDescription}>
                Evaluate existing templates
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Workflows */}
        <View style={styles.workflowsSection}>
          <Text style={styles.sectionTitle}>Recent Workflows</Text>

          {workflows.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🤖</Text>
              <Text style={styles.emptyStateTitle}>No workflows yet</Text>
              <Text style={styles.emptyStateText}>
                Run your first agent pipeline to get started
              </Text>
            </View>
          ) : (
            workflows.map((workflow) => renderWorkflowCard(workflow))
          )}
        </View>

        {/* Agent Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Available Agents</Text>

          <View style={styles.agentList}>
            <View style={styles.agentItem}>
              <Text style={styles.agentIcon}>🔍</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>Market Researcher</Text>
                <Text style={styles.agentDescription}>Scans trends & opportunities</Text>
              </View>
            </View>

            <View style={styles.agentItem}>
              <Text style={styles.agentIcon}>💡</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>Idea Generator</Text>
                <Text style={styles.agentDescription}>Proposes new concepts</Text>
              </View>
            </View>

            <View style={styles.agentItem}>
              <Text style={styles.agentIcon}>🎨</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>Game Creator</Text>
                <Text style={styles.agentDescription}>Builds templates</Text>
              </View>
            </View>

            <View style={styles.agentItem}>
              <Text style={styles.agentIcon}>🧪</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>Game Tester</Text>
                <Text style={styles.agentDescription}>Evaluates quality</Text>
              </View>
            </View>

            <View style={styles.agentItem}>
              <Text style={styles.agentIcon}>✨</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>Perfecter</Text>
                <Text style={styles.agentDescription}>Refines & polishes</Text>
              </View>
            </View>

            <View style={styles.agentItem}>
              <Text style={styles.agentIcon}>📱</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>Content Creator</Text>
                <Text style={styles.agentDescription}>Marketing content</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Configuration Hint */}
        <View style={styles.configHint}>
          <Text style={styles.configHintTitle}>⚙️ Configuration</Text>
          <Text style={styles.configHintText}>
            To enable AI-powered agents, set your API keys in environment variables:
          </Text>
           <Text style={styles.configHintCode}>Configure AI through the server runtime</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667EEA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 14,
    color: '#666',
  },
  workflowsSection: {
    marginBottom: 24,
  },
  workflowCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workflowTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
  },
  workflowName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  workflowDescription: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  workflowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  taskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreTasksText: {
    fontSize: 10,
    color: '#999',
    marginLeft: 4,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  agentList: {
    gap: 12,
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  agentDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  configHint: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  configHintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  configHintText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 20,
  },
  configHintCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
});
