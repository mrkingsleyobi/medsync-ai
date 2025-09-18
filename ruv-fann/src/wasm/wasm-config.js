// MediSync Healthcare AI Platform - WASM Configuration
// Configuration for WASM compilation pipeline

const wasmConfig = {
  // Compiler settings
  compiler: {
    tool: 'emscripten', // or 'wasm-pack', 'assemblyscript'
    optimizationLevel: '-O3', // Maximum optimization
    target: 'wasm32-unknown-unknown',
    debug: false
  },

  // Source files
  sources: {
    cFiles: [
      'src/wasm/neural-network.c'
    ],
    jsGlue: 'src/wasm/neural-network-glue.js',
    entryPoint: 'src/wasm/neural-network.c'
  },

  // Output settings
  output: {
    path: 'dist/wasm',
    moduleFilename: 'neural-network-wasm',
    generateBindings: true,
    exportTypes: ['forward_propagation', 'matrix_multiply', 'vector_add', 'sigmoid_activation', 'mean_squared_error']
  },

  // Healthcare-specific optimizations
  healthcareOptimizations: {
    precision: 'float32', // Healthcare calculations don't need double precision
    memoryModel: 'linear', // Linear memory for better performance
    simd: true, // Enable SIMD for parallel calculations
    threads: false, // Disable threads for deterministic behavior
    sizeLimit: '2MB' // Maximum WASM module size
  },

  // Security settings
  security: {
    sandboxed: true, // Run in sandboxed environment
    memoryLimit: '64MB', // Maximum memory allocation
    timeout: 5000, // 5 second execution timeout
    allowedImports: ['env'], // Only allow environment imports
    disallowedOperations: ['file_system', 'network', 'process'] // No file/network access
  },

  // Performance monitoring
  performance: {
    profiling: true,
    metrics: ['execution_time', 'memory_usage', 'cpu_cycles'],
    benchmarkInterval: 1000 // Run benchmarks every 1000 operations
  },

  // Integration with ruv-FANN
  integration: {
    fannCompatibility: true,
    apiVersion: '1.0.0',
    healthcareStandards: ['HIPAA', 'FDA', 'GDPR']
  }
};

module.exports = wasmConfig;