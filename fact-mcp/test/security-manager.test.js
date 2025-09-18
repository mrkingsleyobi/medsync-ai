// MediSync Healthcare AI Platform - FACT MCP Security Manager Tests
// Test suite for the FACT MCP security manager

const SecurityManager = require('../src/security/security-manager');

describe('FACT MCP Security Manager', () => {
  let securityManager;

  beforeEach(() => {
    securityManager = new SecurityManager();
  });

  test('should initialize security manager', () => {
    expect(securityManager).toBeInstanceOf(SecurityManager);
    expect(securityManager.getConfiguration()).toBeDefined();
  });

  test('should encrypt and decrypt data', () => {
    const testData = 'This is sensitive medical data';
    const encrypted = securityManager.encryptData(testData);
    expect(encrypted).toBeDefined();
    expect(encrypted.encryptedData).toBeDefined();
    expect(encrypted.iv).toBeDefined();

    // Test decryption with the same instance
    const decrypted = securityManager.decryptData(encrypted);
    expect(decrypted).toBe(testData);
  });

  test('should log audit entries', () => {
    const entryId = securityManager.logAuditEntry('test_action', { test: 'data' }, 'test_user', '127.0.0.1');

    expect(entryId).toBeDefined();
    expect(typeof entryId).toBe('string');

    const auditLog = securityManager.getAuditLog();
    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].action).toBe('test_action');
    expect(auditLog[0].userId).toBe('test_user');
    expect(auditLog[0].ipAddress).toBe('127.0.0.1');
  });

  test('should filter audit log entries', () => {
    // Log multiple entries
    securityManager.logAuditEntry('action1', { data: 'test1' }, 'user1');
    securityManager.logAuditEntry('action2', { data: 'test2' }, 'user2');
    securityManager.logAuditEntry('action1', { data: 'test3' }, 'user1');

    // Filter by action
    const action1Entries = securityManager.getAuditLog({ action: 'action1' });
    expect(action1Entries).toHaveLength(2);
    expect(action1Entries.every(entry => entry.action === 'action1')).toBe(true);

    // Filter by user
    const user1Entries = securityManager.getAuditLog({ userId: 'user1' });
    expect(user1Entries).toHaveLength(2);
    expect(user1Entries.every(entry => entry.userId === 'user1')).toBe(true);
  });

  test('should check access permissions', () => {
    const accessGranted = securityManager.checkAccess('test_user', 'medical_records', 'read');
    expect(accessGranted).toBe(true);
  });

  test('should sanitize data for logging', () => {
    const sensitiveData = {
      name: 'John Doe',
      password: 'secret123',
      ssn: '123-45-6789',
      patient_id: 'P123456',
      normal_field: 'normal_value'
    };

    const sanitized = securityManager.sanitizeForLogging(sensitiveData);

    expect(sanitized.name).toBe('John Doe');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.ssn).toBe('[REDACTED]');
    expect(sanitized.patient_id).toBe('[REDACTED]');
    expect(sanitized.normal_field).toBe('normal_value');
  });

  test('should get security statistics', () => {
    const stats = securityManager.getStatistics();

    expect(stats).toBeDefined();
    expect(stats.auditLogEntries).toBeGreaterThanOrEqual(0);
    expect(stats.encryptionEnabled).toBe(true);
    expect(stats.auditEnabled).toBe(true);
    expect(stats.accessControlEnabled).toBe(true);
    expect(stats.compliance).toBeDefined();
    expect(stats.compliance.hipaa).toBe(true);
  });

  test('should maintain audit log retention', () => {
    // This test would require mocking dates to properly test retention
    // For now, we'll just verify the method exists and doesn't throw
    expect(() => securityManager._maintainAuditLog()).not.toThrow();
  });
});