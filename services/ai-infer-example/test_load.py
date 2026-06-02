#!/usr/bin/env python3
import tensorflow as tf
import os

print(f"TensorFlow version: {tf.__version__}")
print(f"Current directory: {os.getcwd()}")
print(f"Files in current dir: {os.listdir('.')}")

model_path = "best_model.keras"
print(f"\nTrying to load: {model_path}")
print(f"File exists: {os.path.exists(model_path)}")

if os.path.exists(model_path):
    print(f"File size: {os.path.getsize(model_path)} bytes")
    try:
        model = tf.keras.models.load_model(model_path)
        print(f"✓ Model loaded successfully!")
        print(f"  Input shape: {model.input_shape}")
        print(f"  Output shape: {model.output_shape}")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        import traceback
        traceback.print_exc()
else:
    print("✗ File not found!")
