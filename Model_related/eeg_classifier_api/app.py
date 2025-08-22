# app.py
from flask import Flask, request, jsonify
from model_def import UpgradedCNN  # Import the model class
import torch
import mne
import numpy as np
from scipy import signal
import os

# --- Initialize Flask App ---
app = Flask(__name__)

# --- Load Model (Done once at startup) ---
# This number must match the "Calculated feature size" from your notebook (e.g., 1024)
MODEL_INPUT_SIZE = 1024 
MODEL_PATH = "models/best_model_upgraded.pth"
device = torch.device("cpu") # Servers typically use CPU for inference
model = UpgradedCNN(MODEL_INPUT_SIZE).to(device)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()
print("✅ Model Loaded and Ready!")

# --- Preprocessing Function (Copied from your notebook) ---
def process_file_to_features(file_path):
    try:
        raw = mne.io.read_raw_edf(file_path, preload=True, verbose=False)
        raw.pick_types(eeg=True)
        raw.filter(l_freq=1.0, h_freq=45.0, verbose=False)
        epochs = mne.make_fixed_length_epochs(raw, duration=5.0, overlap=2.5, verbose=False)
        epoch_data = epochs.get_data()
        features = []
        for single_epoch_data in epoch_data:
            channel_spectrograms = []
            for channel_signal in single_epoch_data:
                fs = raw.info['sfreq']
                freqs, times, Sxx = signal.spectrogram(channel_signal, fs=fs, nperseg=128, noverlap=64)
                Sxx_db = 10 * np.log10(Sxx + 1e-10)
                channel_spectrograms.append(Sxx_db)
            avg_spectrogram = np.mean(channel_spectrograms, axis=0)
            features.append(avg_spectrogram)
        return features
    except Exception as e:
        print(f"Error processing file: {e}")
        return []

# --- Create API Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.edf'):
        # Create a temporary directory if it doesn't exist
        temp_dir = "temp"
        os.makedirs(temp_dir, exist_ok=True)
        filepath = os.path.join(temp_dir, file.filename)
        
        file.save(filepath)

        features = process_file_to_features(filepath)
        os.remove(filepath) # Clean up the temporary file

        if not features:
            return jsonify({"error": "Could not process EEG file"}), 500

        predictions = []
        with torch.no_grad():
            for feature in features:
                tensor = torch.from_numpy(feature).float().unsqueeze(0).unsqueeze(0).to(device)
                output = model(tensor).squeeze()
                prob = torch.sigmoid(output)
                prediction = (prob > 0.5).int().item()
                predictions.append(prediction)

        sch_votes = sum(predictions)
        control_votes = len(predictions) - sch_votes
        
        if sch_votes > control_votes:
            result = "Likely Schizophrenia"
        else:
            result = "Likely a Healthy Control"
            
        return jsonify({
            "prediction": result,
            "sch_votes": sch_votes,
            "control_votes": control_votes,
            "total_segments": len(predictions)
        })
    else:
        return jsonify({"error": "Invalid file type, please upload an .edf file"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)