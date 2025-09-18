// MediSync Healthcare AI Platform - WASM Pipeline Tests
// Test suite for WASM compilation and runtime

const WASMCompiler = require('../src/wasm/wasm-compiler');
const WASMRuntime = require('../src/wasm/wasm-runtime');
const fs = require('fs');
const path = require('path');

describe('WASM Compilation Pipeline', () => {
  describe('WASM Compiler', () => {
    let compiler;

    beforeEach(() => {
      compiler = new WASMCompiler();
    });

    test('should initialize WASM compiler', () => {
      expect(compiler).toBeInstanceOf(WASMCompiler);
      expect(compiler.config).toBeDefined();
      expect(compiler.getStatistics()).toBeDefined();
    });

    test('should compile C source to WASM', async () => {
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');
      const result = await compiler.compile(sourceFile, {
        optimization: '-O2'
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.wasmFile).toBeDefined();
      expect(result.jsFile).toBeDefined();
      expect(result.compilationTime).toBeGreaterThan(0);

      // Check that files were created
      expect(fs.existsSync(result.wasmFile)).toBe(true);
      expect(fs.existsSync(result.jsFile)).toBe(true);
    });

    test('should handle compilation errors', async () => {
      const result = await compiler.compile('nonexistent-file.c');

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should optimize WASM module', async () => {
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');
      const compileResult = await compiler.compile(sourceFile);

      const result = await compiler.optimize(compileResult.wasmFile, {
        level: 'O3'
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.optimizedFile).toBeDefined();
      expect(result.sizeReduction).toBeDefined();
    });

    test('should validate WASM module', async () => {
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');
      const compileResult = await compiler.compile(sourceFile);

      const result = await compiler.validate(compileResult.wasmFile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
      expect(result.fileSize).toBeGreaterThan(0);
    });

    test('should get compilation statistics', () => {
      const stats = compiler.getStatistics();
      expect(stats).toBeDefined();
      expect(stats.successful).toBeGreaterThanOrEqual(0);
      expect(stats.failed).toBeGreaterThanOrEqual(0);
      expect(stats.successRate).toBeGreaterThanOrEqual(0);
    });

    test('should clean compilation artifacts', async () => {
      await compiler.clean();
      // This test just ensures the method doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('WASM Runtime', () => {
    let runtime;

    beforeEach(() => {
      runtime = new WASMRuntime();
    });

    test('should initialize WASM runtime', () => {
      expect(runtime).toBeInstanceOf(WASMRuntime);
      expect(runtime.config).toBeDefined();
      expect(runtime.getStatistics()).toBeDefined();
    });

    test('should load WASM module', async () => {
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');
      const compiler = new WASMCompiler();
      const compileResult = await compiler.compile(sourceFile);

      const result = await runtime.loadModule(compileResult.wasmFile, 'test-module');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.module).toBeDefined();
      expect(runtime.isModuleLoaded('test-module')).toBe(true);
    });

    test('should execute forward propagation', async () => {
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');
      const compiler = new WASMCompiler();
      const compileResult = await compiler.compile(sourceFile);
      await runtime.loadModule(compileResult.wasmFile, 'test-module');

      const inputs = [0.5, 0.3, 0.8];
      const weights = {
        inputToHidden: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
        hiddenToOutput: [0.7, 0.8, 0.9]
      };
      const biases = {
        hidden: [0.1, 0.2],
        output: [0.3]
      };

      const result = await runtime.executeForwardPropagation(
        'test-module',
        inputs,
        weights,
        biases,
        { hiddenSize: 2, outputSize: 1 }
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result.hiddenLayer).toHaveLength(2);
      expect(result.result.outputLayer).toHaveLength(1);
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should execute matrix operations', async () => {
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');
      const compiler = new WASMCompiler();
      const compileResult = await compiler.compile(sourceFile);
      await runtime.loadModule(compileResult.wasmFile, 'test-module');

      const operands = [
        [1, 2, 3, 4], // 2x2 matrix
        [5, 6, 7, 8]  // 2x2 matrix
      ];

      const result = await runtime.executeMatrixOperation(
        'test-module',
        'matrix_multiply',
        operands,
        { dimensions: [2, 2], bCols: 2 }
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result.result).toHaveLength(4); // 2x2 result matrix
    });

    test('should handle execution errors', async () => {
      const result = await runtime.executeForwardPropagation(
        'nonexistent-module',
        [0.5, 0.3],
        {},
        {}
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should unload WASM module', async () => {
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');
      const compiler = new WASMCompiler();
      const compileResult = await compiler.compile(sourceFile);
      await runtime.loadModule(compileResult.wasmFile, 'unload-test');

      expect(runtime.isModuleLoaded('unload-test')).toBe(true);

      const result = runtime.unloadModule('unload-test');
      expect(result).toBe(true);
      expect(runtime.isModuleLoaded('unload-test')).toBe(false);
    });

    test('should get runtime statistics', async () => {
      const stats = runtime.getStatistics();
      expect(stats).toBeDefined();
      expect(stats.totalExecutions).toBeGreaterThanOrEqual(0);
      expect(stats.loadedModules).toBeGreaterThanOrEqual(0);
      expect(stats.successRate).toBeGreaterThanOrEqual(0);
    });

    test('should list loaded modules', async () => {
      const modules = runtime.listLoadedModules();
      expect(Array.isArray(modules)).toBe(true);
    });
  });
});