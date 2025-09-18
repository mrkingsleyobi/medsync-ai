// MediSync Healthcare AI Platform - Neural Network WASM Module
// C implementation of core neural network operations for WASM compilation

// Simple neural network forward propagation
void forward_propagation(
    const float* inputs,
    const float* weights_input_hidden,
    const float* biases_hidden,
    const float* weights_hidden_output,
    const float* biases_output,
    float* hidden_layer,
    float* output_layer,
    int input_size,
    int hidden_size,
    int output_size
) {
    // Calculate hidden layer activations
    for (int j = 0; j < hidden_size; j++) {
        float sum = biases_hidden[j];
        for (int i = 0; i < input_size; i++) {
            sum += inputs[i] * weights_input_hidden[i * hidden_size + j];
        }
        // Sigmoid activation function
        hidden_layer[j] = 1.0f / (1.0f + expf(-sum));
    }

    // Calculate output layer activations
    for (int k = 0; k < output_size; k++) {
        float sum = biases_output[k];
        for (int j = 0; j < hidden_size; j++) {
            sum += hidden_layer[j] * weights_hidden_output[j * output_size + k];
        }
        // Sigmoid activation function
        output_layer[k] = 1.0f / (1.0f + expf(-sum));
    }
}

// Matrix multiplication for neural network operations
void matrix_multiply(
    const float* a,
    const float* b,
    float* result,
    int a_rows,
    int a_cols,
    int b_cols
) {
    for (int i = 0; i < a_rows; i++) {
        for (int j = 0; j < b_cols; j++) {
            float sum = 0.0f;
            for (int k = 0; k < a_cols; k++) {
                sum += a[i * a_cols + k] * b[k * b_cols + j];
            }
            result[i * b_cols + j] = sum;
        }
    }
}

// Vector addition for bias operations
void vector_add(
    const float* a,
    const float* b,
    float* result,
    int size
) {
    for (int i = 0; i < size; i++) {
        result[i] = a[i] + b[i];
    }
}

// Sigmoid activation function
void sigmoid_activation(
    const float* inputs,
    float* outputs,
    int size
) {
    for (int i = 0; i < size; i++) {
        outputs[i] = 1.0f / (1.0f + expf(-inputs[i]));
    }
}

// Mean squared error calculation
float mean_squared_error(
    const float* predicted,
    const float* actual,
    int size
) {
    float sum = 0.0f;
    for (int i = 0; i < size; i++) {
        float error = predicted[i] - actual[i];
        sum += error * error;
    }
    return sum / size;
}

// Export functions for WASM
// Note: In a real implementation, you would use proper export annotations
// For this example, we're showing the function signatures that would be exported