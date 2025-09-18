// MediSync Healthcare AI Platform - Agent Monitoring Dashboard Tests
// This file contains tests for the Agent Monitoring Dashboard

const AgentMonitoringDashboard = require('./agent-monitoring-dashboard.js');

describe('AgentMonitoringDashboard', () => {
  let dashboard;
  let mockAgent;
  let mockQueenAgent;

  beforeEach(() => {
    dashboard = new AgentMonitoringDashboard({
      port: 3002, // Use different port for testing
      host: 'localhost'
    });

    // Mock agent
    mockAgent = {
      config: { agentId: 'test-agent-001', type: 'medical-imaging' },
      getStatus: jest.fn().mockReturnValue({
        agentId: 'test-agent-001',
        type: 'medical-imaging',
        status: 'active',
        metrics: { tasksProcessed: 10, errors: 0, averageProcessingTime: 150 }
      })
    };

    // Mock Queen Agent
    mockQueenAgent = {
      config: { agentId: 'queen-agent-001' },
      getMetrics: jest.fn().mockReturnValue({
        totalDecisions: 50,
        approvedDecisions: 45,
        activeAlerts: 2
      }),
      getActiveAlerts: jest.fn().mockReturnValue([
        { type: 'test-alert', severity: 'medium', message: 'Test alert' }
      ])
    };
  });

  test('should initialize with correct configuration', () => {
    expect(dashboard.config.port).toBe(3002);
    expect(dashboard.config.host).toBe('localhost');
  });

  test('should register agents for monitoring', () => {
    dashboard.registerAgent('test-agent-001', mockAgent);
    expect(dashboard.agents.size).toBe(1);
    expect(dashboard.agents.get('test-agent-001')).toBe(mockAgent);
  });

  test('should register Queen Agent coordinator', () => {
    dashboard.registerQueenAgent(mockQueenAgent);
    expect(dashboard.queenAgent).toBe(mockQueenAgent);
  });

  test('should get agent statuses', () => {
    dashboard.registerAgent('test-agent-001', mockAgent);
    const statuses = dashboard._getAgentStatuses();

    expect(statuses.length).toBe(1);
    expect(statuses[0].agentId).toBe('test-agent-001');
    expect(statuses[0].status).toBe('active');
  });

  test('should handle missing agent gracefully', () => {
    const status = dashboard._getAgentStatus('non-existent-agent');
    expect(status.agentId).toBe('non-existent-agent');
    expect(status.status).toBe('not-found');
  });

  test('should get Queen Agent status', () => {
    dashboard.registerQueenAgent(mockQueenAgent);
    const status = dashboard._getQueenAgentStatus();

    expect(status.agentId).toBe('queen-agent-001');
    expect(status.metrics.totalDecisions).toBe(50);
    expect(status.activeAlerts.length).toBe(1);
  });

  test('should get system metrics', () => {
    dashboard.registerAgent('test-agent-001', mockAgent);
    dashboard.registerQueenAgent(mockQueenAgent);

    const metrics = dashboard._getSystemMetrics();

    expect(metrics.totalAgents).toBe(1);
    expect(metrics.agentMetrics.length).toBe(1);
    expect(metrics.queenAgentMetrics.totalDecisions).toBe(50);
  });

  test('should get active alerts', () => {
    dashboard.registerQueenAgent(mockQueenAgent);
    const alerts = dashboard._getActiveAlerts();

    expect(alerts.length).toBe(1);
    expect(alerts[0].type).toBe('test-alert');
  });

  test('should handle missing Queen Agent for alerts', () => {
    const alerts = dashboard._getActiveAlerts();
    expect(alerts.length).toBe(0);
  });
});