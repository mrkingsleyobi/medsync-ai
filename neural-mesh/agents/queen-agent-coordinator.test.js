// MediSync Healthcare AI Platform - Queen Agent Coordinator Tests
// This file contains tests for the Queen Agent coordinator

const QueenAgentCoordinator = require('./queen-agent-coordinator.js');

describe('QueenAgentCoordinator', () => {
  let queenAgent;

  beforeEach(() => {
    queenAgent = new QueenAgentCoordinator({
      agentId: 'test-queen-agent',
      oversightThreshold: 0.90,
      alertThreshold: 0.80
    });
  });

  test('should initialize with correct configuration', () => {
    expect(queenAgent.config.agentId).toBe('test-queen-agent');
    expect(queenAgent.config.oversightThreshold).toBe(0.90);
    expect(queenAgent.config.alertThreshold).toBe(0.80);
  });

  test('should register and unregister agents', () => {
    const agentInfo = {
      type: 'medical-imaging',
      capabilities: ['image-analysis', 'radiology-ai']
    };

    // Register agent
    const registerResult = queenAgent.registerAgent('agent-001', agentInfo);
    expect(registerResult).toBe(true);

    // Check agent is registered
    const agent = queenAgent.getAgent('agent-001');
    expect(agent).toBeDefined();
    expect(agent.id).toBe('agent-001');
    expect(agent.type).toBe('medical-imaging');

    // Unregister agent
    const unregisterResult = queenAgent.unregisterAgent('agent-001');
    expect(unregisterResult).toBe(true);

    // Check agent status is inactive
    const updatedAgent = queenAgent.getAgent('agent-001');
    expect(updatedAgent.status).toBe('inactive');
  });

  test('should review high confidence decisions', async () => {
    const decision = {
      decisionId: 'decision-001',
      type: 'diagnosis-support',
      confidence: 0.95,
      recommendations: [{ condition: 'hypertension', likelihood: 0.95 }],
      alerts: []
    };

    const agentContext = {
      agentId: 'agent-001'
    };

    // Register agent first
    queenAgent.registerAgent('agent-001', { type: 'decision-support' });

    const reviewResult = await queenAgent.reviewDecision(decision, agentContext);

    expect(reviewResult.approved).toBe(true);
    expect(reviewResult.reason).toContain('High confidence decision meets oversight threshold');
    expect(reviewResult.nodeId).toBeDefined();
  });

  test('should reject decisions with critical alerts', async () => {
    const decision = {
      decisionId: 'decision-002',
      type: 'clinical-alert',
      confidence: 0.99,
      recommendations: [],
      alerts: [{
        type: 'hypertensive-crisis',
        severity: 'critical',
        message: 'Hypertensive crisis: Immediate intervention required'
      }]
    };

    const agentContext = {
      agentId: 'agent-002'
    };

    // Register agent first
    queenAgent.registerAgent('agent-002', { type: 'clinical-alert' });

    const reviewResult = await queenAgent.reviewDecision(decision, agentContext);

    expect(reviewResult.approved).toBe(false);
    expect(reviewResult.reason).toContain('Critical alerts detected');
    expect(reviewResult.alert).toBeDefined();
  });

  test('should generate and acknowledge alerts', async () => {
    const decision = {
      decisionId: 'decision-003',
      type: 'low-confidence-decision',
      confidence: 0.30,
      recommendations: [],
      alerts: []
    };

    const agentContext = {
      agentId: 'agent-003'
    };

    // Register agent first
    queenAgent.registerAgent('agent-003', { type: 'decision-support' });

    // Make the agent have enough decisions to avoid performance alert
    const agent = queenAgent.getAgent('agent-003');
    agent.decisionCount = 10;
    agent.performance.averageConfidence = 0.9;

    await queenAgent.reviewDecision(decision, agentContext);

    // Check alerts
    const activeAlerts = queenAgent.getActiveAlerts();
    expect(activeAlerts.length).toBe(1);
    expect(activeAlerts[0].type).toBe('low-confidence');

    // Acknowledge alert
    const ackResult = queenAgent.acknowledgeAlert(activeAlerts[0].alertId);
    expect(ackResult).toBe(true);

    // Check no active alerts
    const noActiveAlerts = queenAgent.getActiveAlerts();
    expect(noActiveAlerts.length).toBe(0);
  });

  test('should track decision history', async () => {
    const decision = {
      decisionId: 'decision-004',
      type: 'treatment-recommendation',
      confidence: 0.92,
      recommendations: [{ treatment: ['ACE inhibitors'] }],
      alerts: [],
      processingTime: 150
    };

    const agentContext = {
      agentId: 'agent-004'
    };

    // Register agent first
    queenAgent.registerAgent('agent-004', { type: 'treatment-recommendation' });

    await queenAgent.reviewDecision(decision, agentContext);

    // Check decision history
    const history = queenAgent.getDecisionHistory();
    expect(history.length).toBe(1);
    expect(history[0].decisionId).toBe('decision-004');
    expect(history[0].approved).toBe(true);
  });

  test('should provide system metrics', () => {
    // Register some agents
    queenAgent.registerAgent('agent-005', { type: 'imaging' });
    queenAgent.registerAgent('agent-006', { type: 'nlp' });

    const metrics = queenAgent.getMetrics();
    expect(metrics.activeAgents).toBe(2);
    expect(metrics.totalDecisions).toBe(0);
    expect(metrics.dagStats).toBeDefined();
  });
});