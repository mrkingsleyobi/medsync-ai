/* eslint-disable no-console, max-len, quotes, padded-blocks */

/**
 * Healthcare Task Orchestrator Usage Example
 *
 * Demonstrates how to use the MediSync Healthcare Task Orchestrator
 * for coordinating medical AI tasks with compliance and safety.
 */

const HealthcareTaskOrchestrator = require('./healthcare-task-orchestrator');
const config = require('./healthcare-orchestrator-config');

async function demonstrateHealthcareOrchestration() {
  console.log('🚀 Starting MediSync Healthcare Task Orchestrator Demonstration');

  try {
    // Create orchestrator instance
    const orchestrator = new HealthcareTaskOrchestrator();

    // Register all specialized healthcare agents from configuration
    console.log('\n📋 Registering specialized healthcare agents...');
    const agentIds = [];

    for (const [agentKey, agentConfig] of Object.entries(config.agents)) {
      const agentId = orchestrator.registerAgent({
        type: agentConfig.type,
        capabilities: agentConfig.capabilities,
        confidenceThreshold: agentConfig.configuration.confidenceThreshold || config.platform.confidenceThreshold
      });
      agentIds.push(agentId);
      console.log(`  ✅ Registered ${agentConfig.type} agent (${agentId})`);
    }

    console.log(`\n🤖 Registered ${agentIds.length} specialized healthcare agents`);

    // Create a comprehensive medical analysis workflow
    console.log('\n🔗 Creating comprehensive medical analysis workflow...');
    const workflowId = await orchestrator.createWorkflow({
      name: 'comprehensive-medical-analysis',
      compliance: ['HIPAA', 'FDA', 'GDPR'],
      safetyThreshold: 0.95
    });
    console.log(`  ✅ Created workflow: comprehensive-medical-analysis (${workflowId})`);

    // Add parallel tasks for medical analysis
    console.log('\n➕ Adding parallel medical analysis tasks...');
    await orchestrator.addParallelTasks(workflowId, [
      {
        agent: 'medical-imaging',
        task: 'analyze-radiology',
        priority: 'critical'
      },
      {
        agent: 'clinical-nlp',
        task: 'process-clinical-notes',
        priority: 'high'
      },
      {
        agent: 'research-ai',
        task: 'literature-review',
        priority: 'medium'
      },
      {
        agent: 'safety-monitor',
        task: 'validate-recommendations',
        priority: 'critical'
      }
    ]);
    console.log('  ✅ Added 4 parallel medical analysis tasks');

    // Set up event listeners for monitoring
    console.log('\n👂 Setting up event listeners...');

    orchestrator.on('workflowCompleted', (wfId, results) => {
      console.log(`\n🎉 Workflow ${wfId} completed successfully!`);
      console.log(`   Tasks completed: ${results.taskCount}`);
      console.log(`   Average confidence: ${(results.results.reduce((sum, r) => sum + r.confidence, 0) / results.results.length).toFixed(3)}`);
    });

    orchestrator.on('clinicalAlert', (alertType, metrics) => {
      console.log(`\n🚨 Clinical Alert: ${alertType}`);
      console.log(`   Timestamp: ${metrics.timestamp}`);
    });

    orchestrator.on('workflowError', (wfId, error) => {
      console.log(`\n❌ Workflow ${wfId} failed with error: ${error.message}`);
    });

    console.log('  ✅ Event listeners registered');

    // Get workflow status before execution
    const preExecutionStatus = orchestrator.getWorkflowStatus(workflowId);
    console.log(`\n📊 Pre-execution workflow status: ${preExecutionStatus.status}`);

    // Execute the workflow
    console.log('\n🚀 Executing healthcare workflow...');
    const startTime = Date.now();

    const results = await orchestrator.executeWorkflow(workflowId);

    const executionTime = Date.now() - startTime;
    console.log(`\n✅ Workflow execution completed in ${executionTime}ms`);

    // Show results summary
    console.log('\n📈 Results Summary:');
    console.log(`   Workflow: ${results.workflowName}`);
    console.log(`   Tasks: ${results.taskCount}`);
    console.log(`   Safety Validated: ${results.safetyValidated}`);
    console.log(`   Execution Time: ${results.completionTime || executionTime}ms`);

    // Show individual task results
    console.log('\n📋 Task Results:');
    results.results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.taskType} (${result.agentType})`);
      console.log(`      Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`      Status: ✅ Completed`);
    });

    // Get workflow status after execution
    const postExecutionStatus = orchestrator.getWorkflowStatus(workflowId);
    console.log(`\n📊 Post-execution workflow status: ${postExecutionStatus.status}`);

    // Show audit trail
    const auditTrail = orchestrator.getAuditTrail();
    console.log(`\n📝 Audit Trail: ${auditTrail.length} events recorded`);

    // Show last few audit events
    console.log('\n🔍 Recent Audit Events:');
    const recentEvents = auditTrail.slice(-3);
    recentEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.eventType} at ${new Date(event.timestamp).toISOString()}`);
    });

    // Demonstrate error handling
    console.log('\n🧪 Demonstrating error handling...');

    try {
      // Try to execute a non-existent workflow
      await orchestrator.executeWorkflow('non-existent-workflow-id');
    } catch (error) {
      console.log(`  ✅ Error handling working correctly: ${error.message}`);
    }

    // Graceful shutdown
    console.log('\n🛑 Initiating graceful shutdown...');
    await orchestrator.shutdown();
    console.log('  ✅ Orchestrator shutdown completed');

    console.log('\n🎊 Healthcare Task Orchestrator Demonstration Complete!');

  } catch (error) {
    console.error('❌ Error in healthcare orchestration demonstration:', error);
    process.exit(1);
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrateHealthcareOrchestration().catch(error => {
    console.error('Fatal error in demonstration:', error);
    process.exit(1);
  });
}

module.exports = { demonstrateHealthcareOrchestration };
