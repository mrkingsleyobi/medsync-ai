// MediSync Healthcare AI Platform - WASM Pipeline Demo
// Demonstration of WASM compilation and execution pipeline

const WASMCompiler = require('./src/wasm/wasm-compiler');
const WASMRuntime = require('./src/wasm/wasm-runtime');
const path = require('path');

async function runDemo() {
  console.log('🔧 MediSync WASM Compilation Pipeline Demo');
  console.log('==========================================\n');

  // Example 1: WASM Compiler
  console.log('1️⃣ WASM Compiler\n');
  const compiler = new WASMCompiler({
    compiler: {
      tool: 'emscripten',
      optimizationLevel: '-O3'
    },
    output: {
      path: 'dist/wasm-demo',
      moduleFilename: 'healthcare-nn'
    }
  });

  console.log('✅ WASM compiler initialized');
  console.log('📊 Compiler configuration:');
  console.log('   Tool:', compiler.config.compiler.tool);
  console.log('   Optimization:', compiler.config.compiler.optimizationLevel);
  console.log('   Output path:', compiler.config.output.path);

  // Compile neural network C code
  console.log('\n🔨 Compiling neural network code to WASM...');
  const sourceFile = path.join(__dirname, 'src/wasm/neural-network.c');
  const compileResult = await compiler.compile(sourceFile, {
    optimization: '-O3',
    target: 'wasm32'
  });

  console.log('✅ Compilation completed');
  console.log('📊 Compilation results:');
  console.log('   Success:', compileResult.success);
  console.log('   WASM file:', compileResult.wasmFile);
  console.log('   JS file:', compileResult.jsFile);
  console.log('   Time:', compileResult.compilationTime + 'ms');

  // Validate the compiled module
  console.log('\n🔍 Validating WASM module...');
  const validationResult = await compiler.validate(compileResult.wasmFile);
  console.log('✅ Validation completed');
  console.log('📊 Validation results:');
  console.log('   Valid:', validationResult.valid);
  console.log('   File size:', validationResult.fileSize + ' bytes');

  // Optimize the module
  console.log('\n⚡ Optimizing WASM module...');
  const optimizeResult = await compiler.optimize(compileResult.wasmFile, {
    level: 'O3'
  });
  console.log('✅ Optimization completed');
  console.log('📊 Optimization results:');
  console.log('   Success:', optimizeResult.success);
  console.log('   Size reduction:', optimizeResult.sizeReduction);

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 2: WASM Runtime
  console.log('2️⃣ WASM Runtime\n');
  const runtime = new WASMRuntime({
    security: {
      sandboxed: true,
      memoryLimit: '64MB',
      timeout: 5000
    }
  });

  console.log('✅ WASM runtime initialized');
  console.log('📊 Runtime configuration:');
  console.log('   Sandboxed:', runtime.config.security.sandboxed);
  console.log('   Memory limit:', runtime.config.security.memoryLimit);
  console.log('   Timeout:', runtime.config.security.timeout + 'ms');

  // Load the compiled WASM module
  console.log('\n📥 Loading WASM module...');
  const loadResult = await runtime.loadModule(compileResult.wasmFile, 'neural-network-module');
  console.log('✅ Module loading completed');
  console.log('📊 Load results:');
  console.log('   Success:', loadResult.success);
  console.log('   Module loaded:', runtime.isModuleLoaded('neural-network-module'));

  // Execute forward propagation
  console.log('\n🧠 Executing neural network forward propagation...');
  const inputs = [0.7, 0.3, 0.9, 0.5, 0.2]; // 5 input features
  const weights = {
    inputToHidden: [
      // 5 inputs x 8 hidden neurons
      0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8,
      0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
      0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1,
      0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2,
      0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2, 0.3
    ],
    hiddenToOutput: [
      // 8 hidden neurons x 3 outputs
      0.1, 0.2, 0.3,
      0.2, 0.3, 0.4,
      0.3, 0.4, 0.5,
      0.4, 0.5, 0.6,
      0.5, 0.6, 0.7,
      0.6, 0.7, 0.8,
      0.7, 0.8, 0.9,
      0.8, 0.9, 0.1
    ]
  };
  const biases = {
    hidden: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], // 8 hidden neurons
    output: [0.1, 0.2, 0.3] // 3 outputs
  };

  const forwardResult = await runtime.executeForwardPropagation(
    'neural-network-module',
    inputs,
    weights,
    biases,
    { hiddenSize: 8, outputSize: 3 }
  );

  console.log('✅ Forward propagation executed');
  console.log('📊 Execution results:');
  console.log('   Success:', forwardResult.success);
  console.log('   Execution time:', forwardResult.executionTime.toFixed(2) + 'ms');
  console.log('   Hidden layer outputs:', forwardResult.result.hiddenLayer.length);
  console.log('   Output layer values:');
  forwardResult.result.outputLayer.forEach((value, index) => {
    console.log(`     Output ${index + 1}: ${value.toFixed(4)}`);
  });

  // Execute matrix multiplication
  console.log('\n🔢 Executing matrix multiplication...');
  const matrixOperands = [
    [1, 2, 3, 4], // 2x2 matrix
    [5, 6, 7, 8]  // 2x2 matrix
  ];

  const matrixResult = await runtime.executeMatrixOperation(
    'neural-network-module',
    'matrix_multiply',
    matrixOperands,
    { dimensions: [2, 2], bCols: 2 }
  );

  console.log('✅ Matrix multiplication executed');
  console.log('📊 Matrix operation results:');
  console.log('   Success:', matrixResult.success);
  console.log('   Execution time:', matrixResult.executionTime.toFixed(2) + 'ms');
  console.log('   Result matrix:', matrixResult.result.result);

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 3: Performance and Statistics
  console.log('3️⃣ Performance and Statistics\n');

  // Show compiler statistics
  console.log('📊 WASM Compiler Statistics:');
  const compilerStats = compiler.getStatistics();
  console.log('   Successful compilations:', compilerStats.successful);
  console.log('   Failed compilations:', compilerStats.failed);
  console.log('   Success rate:', (compilerStats.successRate * 100).toFixed(1) + '%');
  console.log('   Total time:', compilerStats.totalTime + 'ms');

  // Show runtime statistics
  console.log('\n📊 WASM Runtime Statistics:');
  const runtimeStats = runtime.getStatistics();
  console.log('   Total executions:', runtimeStats.totalExecutions);
  console.log('   Execution errors:', runtimeStats.errors);
  console.log('   Success rate:', (runtimeStats.successRate * 100).toFixed(1) + '%');
  console.log('   Average execution time:', runtimeStats.averageTime.toFixed(2) + 'ms');
  console.log('   Loaded modules:', runtimeStats.loadedModules);

  // Show loaded modules
  console.log('\n📋 Loaded Modules:');
  const loadedModules = runtime.listLoadedModules();
  loadedModules.forEach((moduleId, index) => {
    console.log(`   ${index + 1}. ${moduleId}`);
  });

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 4: Healthcare-Specific Optimizations
  console.log('4️⃣ Healthcare-Specific Optimizations\n');

  console.log('⚙️  WASM Healthcare Optimizations:');
  console.log('   Precision:', compiler.config.healthcareOptimizations.precision);
  console.log('   Memory model:', compiler.config.healthcareOptimizations.memoryModel);
  console.log('   SIMD enabled:', compiler.config.healthcareOptimizations.simd);
  console.log('   Threads:', compiler.config.healthcareOptimizations.threads ? 'Enabled' : 'Disabled');
  console.log('   Size limit:', compiler.config.healthcareOptimizations.sizeLimit);

  console.log('\n🛡️  WASM Security Features:');
  console.log('   Sandboxed execution:', runtime.config.security.sandboxed);
  console.log('   Memory limit:', runtime.config.security.memoryLimit);
  console.log('   Execution timeout:', runtime.config.security.timeout + 'ms');
  console.log('   Allowed imports:', runtime.config.security.allowedImports.join(', '));
  console.log('   Disallowed operations:', runtime.config.security.disallowedOperations.join(', '));

  console.log('\n📈 Performance Monitoring:');
  console.log('   Profiling enabled:', compiler.config.performance.profiling);
  console.log('   Metrics collected:', compiler.config.performance.metrics.join(', '));
  console.log('   Benchmark interval:', compiler.config.performance.benchmarkInterval + 'ms');

  console.log('\n📋 Healthcare Standards Compliance:');
  console.log('   HIPAA compliant:', compiler.config.integration.healthcareStandards.includes('HIPAA'));
  console.log('   FDA compliant:', compiler.config.integration.healthcareStandards.includes('FDA'));
  console.log('   GDPR compliant:', compiler.config.integration.healthcareStandards.includes('GDPR'));

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🎉 WASM Pipeline Demo completed successfully!');
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };