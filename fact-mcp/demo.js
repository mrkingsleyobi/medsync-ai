// MediSync Healthcare AI Platform - FACT MCP Demo
// Demonstration of the FACT MCP knowledge retrieval system

const FACTMCP = require('./src/fact-mcp');

async function runDemo() {
  console.log('🏥 MediSync FACT MCP Knowledge Retrieval System Demo');
  console.log('====================================================\n');

  // Initialize FACT MCP system with LRU caching strategy
  console.log('🔧 Initializing FACT MCP system with LRU caching strategy...');
  const factMCP = new FACTMCP({
    cacheSize: 1000,
    cacheTTL: 3600000, // 1 hour
    cacheStrategy: 'lru',
    cacheWarming: true
  });

  console.log('✅ FACT MCP system initialized\n');

  // Example 1: Retrieve knowledge about hypertension
  console.log('1️⃣ Retrieving knowledge about "hypertension"...\n');
  try {
    const result1 = await factMCP.retrieveKnowledge('hypertension');
    console.log('🔍 Query:', result1.query);
    console.log('📊 Results:', result1.results.length);
    console.log('⏱️  Cached:', result1.cached ? 'Yes' : 'No');
    console.log('📋 Top result:');
    console.log('   Name:', result1.results[0].name);
    console.log('   Category:', result1.results[0].category);
    console.log('   Description:', result1.results[0].description);
    console.log('   Confidence:', result1.results[0].confidence);
    console.log('   Symptoms:', result1.results[0].symptoms.join(', '));
    console.log('   Treatments:', result1.results[0].treatments.join(', '));
  } catch (error) {
    console.error('❌ Error retrieving knowledge:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 2: Retrieve knowledge about diabetes
  console.log('2️⃣ Retrieving knowledge about "diabetes"...\n');
  try {
    const result2 = await factMCP.retrieveKnowledge('diabetes');
    console.log('🔍 Query:', result2.query);
    console.log('📊 Results:', result2.results.length);
    console.log('⏱️  Cached:', result2.cached ? 'Yes' : 'No');
    console.log('📋 Top result:');
    console.log('   Name:', result2.results[0].name);
    console.log('   Category:', result2.results[0].category);
    console.log('   Confidence:', result2.results[0].confidence);
  } catch (error) {
    console.error('❌ Error retrieving knowledge:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 3: Add new knowledge
  console.log('3️⃣ Adding new knowledge about "asthma"...\n');
  try {
    const asthmaKnowledge = {
      name: 'Asthma',
      category: 'respiratory',
      description: 'A chronic inflammatory disease of the airways characterized by variable and recurring symptoms, reversible airflow obstruction, and bronchospasm.',
      symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing'],
      riskFactors: ['genetics', 'environmental_factors', 'allergies', 'obesity'],
      treatments: ['inhalers', 'bronchodilators', 'anti-inflammatory_medications', 'avoiding_triggers'],
      icd10: 'J45'
    };

    factMCP.addKnowledge('asthma', asthmaKnowledge);
    console.log('✅ Successfully added knowledge about asthma');

    // Retrieve the newly added knowledge
    const result3 = await factMCP.retrieveKnowledge('asthma');
    console.log('🔍 Query:', result3.query);
    console.log('📊 Results:', result3.results.length);
    console.log('📋 Name:', result3.results[0].name);
    console.log('   Category:', result3.results[0].category);
    console.log('   Confidence:', result3.results[0].confidence);
  } catch (error) {
    console.error('❌ Error adding knowledge:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 4: Show cache statistics
  console.log('4️⃣ Cache statistics:\n');
  const cacheStats = factMCP.getCacheStats();
  console.log('📊 Cache size:', cacheStats.size);
  console.log('📏 Max cache size:', cacheStats.maxSize);

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 5: Show knowledge base statistics
  console.log('5️⃣ Knowledge base statistics:\n');
  const kbStats = factMCP.getKnowledgeBaseStats();
  console.log('📚 Total entries:', kbStats.entryCount);
  console.log('🏷️  Categories:', kbStats.categories.join(', '));

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 6: Show recent audit log entries
  console.log('6️⃣ Recent audit log entries:\n');
  const auditLog = factMCP.getAuditLog();
  console.log('📋 Audit log entries:', auditLog.length);
  if (auditLog.length > 0) {
    const recentEntries = auditLog.slice(-3); // Show last 3 entries
    recentEntries.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.timestamp} - ${entry.action}`);
    });
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 7: Demonstrate different caching strategies
  console.log('7️⃣ Demonstrating different caching strategies...\n');

  // Test LFU strategy
  console.log('🔄 Testing LFU (Least Frequently Used) caching strategy...');
  const lfuMCP = new FACTMCP({
    cacheSize: 100,
    cacheTTL: 3600000,
    cacheStrategy: 'lfu'
  });

  // Make multiple requests to build frequency data
  await lfuMCP.retrieveKnowledge('hypertension');
  await lfuMCP.retrieveKnowledge('hypertension');
  await lfuMCP.retrieveKnowledge('diabetes');

  const lfuStats = lfuMCP.getCacheStats();
  console.log('📊 LFU Cache Stats:', {
    strategy: lfuStats.strategy,
    size: lfuStats.size,
    hitRate: lfuStats.hitRate.toFixed(2)
  });

  // Test Adaptive strategy
  console.log('\n🔄 Testing Adaptive caching strategy...');
  const adaptiveMCP = new FACTMCP({
    cacheSize: 100,
    cacheTTL: 3600000,
    cacheStrategy: 'adaptive'
  });

  // Make requests to build hit/miss data
  await adaptiveMCP.retrieveKnowledge('hypertension');
  await adaptiveMCP.retrieveKnowledge('nonexistent_condition');
  await adaptiveMCP.retrieveKnowledge('hypertension');

  const adaptiveStats = adaptiveMCP.getCacheStats();
  console.log('📊 Adaptive Cache Stats:', {
    strategy: adaptiveStats.strategy,
    size: adaptiveStats.size,
    hitRate: adaptiveStats.hitRate.toFixed(2),
    totalRequests: adaptiveStats.totalRequests
  });

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 8: Demonstrate tool-based data retrieval
  console.log('8️⃣ Demonstrating tool-based data retrieval...\n');

  // Execute PubMed tool
  console.log('📚 Retrieving medical literature from PubMed...');
  const pubmedResult = await factMCP.executeTool('pubmed', {
    query: 'hypertension treatment 2025',
    maxResults: 3
  });
  console.log('✅ PubMed search completed');
  console.log('🔍 Found', pubmedResult.results.length, 'articles');

  // Execute CDC Guidelines tool
  console.log('\n📋 Retrieving CDC guidelines...');
  const cdcResult = await factMCP.executeTool('cdc', {
    topic: 'diabetes management',
    maxResults: 2
  });
  console.log('✅ CDC guidelines retrieved');
  console.log('🔍 Found', cdcResult.results.length, 'guidelines');

  // Execute Drug Interaction tool
  console.log('\n⚠️  Checking drug interactions...');
  const drugResult = await factMCP.executeTool('druginteraction', {
    drugs: ['warfarin', 'aspirin', 'ibuprofen']
  });
  console.log('✅ Drug interaction check completed');
  if (drugResult.results.interactions.length > 0) {
    console.log('⚠️  Found', drugResult.results.interactions.length, 'potential interactions');
  } else {
    console.log('✅ No significant interactions found');
  }

  // Execute contextual tools
  console.log('\n🔍 Executing contextual tools for a complex query...');
  const contextualResult = await factMCP.retrieveExternalData(
    'What are the latest clinical trials for diabetes treatment?',
    {}
  );
  console.log('✅ Contextual tool execution completed');
  console.log('🔍 Executed', contextualResult.results.length, 'tools');

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 9: Demonstrate security and audit logging
  console.log('9️⃣ Demonstrating security and audit logging...\n');

  // Show security statistics
  console.log('🔒 Security Statistics:');
  const securityStats = factMCP.getSecurityStats();
  console.log('📊 Audit Log Entries:', securityStats.auditLogEntries);
  console.log('🔐 Encryption Enabled:', securityStats.encryptionEnabled);
  console.log('📝 Audit Logging Enabled:', securityStats.auditEnabled);
  console.log('👥 Access Control Enabled:', securityStats.accessControlEnabled);

  // Demonstrate data encryption
  console.log('\n🔑 Data Encryption Demo:');
  const sensitiveData = 'Patient medical record #12345';
  const encryptedData = factMCP.securityManager.encryptData(sensitiveData);
  console.log('📝 Original Data:', sensitiveData);
  console.log('🔒 Encrypted Data Length:', encryptedData.encryptedData.length, 'characters');
  console.log('🔢 IV Length:', encryptedData.iv.length, 'characters');

  // Decrypt the data
  const decryptedData = factMCP.securityManager.decryptData(encryptedData);
  console.log('🔓 Decrypted Data:', decryptedData);
  console.log('✅ Encryption/Decryption Successful:', sensitiveData === decryptedData);

  // Show recent audit log entries
  console.log('\n📝 Recent Audit Log Entries:');
  const auditLogEntries = factMCP.getAuditLog();
  console.log('📋 Total audit entries:', auditLogEntries.length);
  if (auditLogEntries.length > 0) {
    const recentEntries = auditLogEntries.slice(-3); // Show last 3 entries
    recentEntries.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.timestamp} - ${entry.action} (User: ${entry.userId})`);
    });
  }

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🎉 Demo completed successfully!');
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };