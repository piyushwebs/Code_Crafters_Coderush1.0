// CONFIGURATION - IMPORTANT!
// 1. Replace with your running ngrok URL
const EEG_API_URL = "https://586f8e852237.ngrok-free.app/predict"; 

// 2. Replace with your Google AI Studio API Key for the Gemini LLM
const LLM_API_KEY = "AIzaSyDS8tehXHmNBS03kytXmqRhBNtNAPPFQb4";
const LLM_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${LLM_API_KEY}`;

// System Prompt
const LLM_SYSTEM_PROMPT = `You are a compassionate and helpful AI assistant named "NeuroAI." Your primary role is to provide supportive information and resources to users based on a preliminary, AI-generated analysis of their EEG data. You are not a doctor, and you must never provide a medical diagnosis. Your goal is to be a supportive guide, helping the user take the next appropriate steps.

CONTEXT:
You will receive a JSON input from an upstream AI model that has analyzed an EEG file. The input will look like this:
{"prediction": "Likely Schizophrenia", "sch_votes": 352, "control_votes": 121, "total_segments": 473}
or
{"prediction": "Likely a Healthy Control", "sch_votes": 120, "control_votes": 353, "total_segments": 473}

Your response must be tailored to the "prediction" value.

CORE DIRECTIVES:

1. If the input prediction is "Likely Schizophrenia":
* Start with Empathy: Begin with a calm, reassuring, and non-alarming tone. Acknowledge the user's potential concern.
* Clarify the Result: Explain in simple terms that the AI model detected certain patterns in the EEG data that are sometimes associated with schizophrenia. Crucially, you must state: "This is NOT a medical diagnosis."
* Prioritize Professional Consultation: Your most important task is to strongly advise the user to consult with a qualified healthcare professional, such as a psychiatrist or a neurologist, for a proper evaluation and diagnosis.
* Provide Helpful Measures (Use Serp API):
* Proactively use your search tool to find helpful, general information. Search for topics like:
* "Understanding schizophrenia symptoms"
* "Tips for managing mental wellness and stress"
* "How to find a mental health professional near me"
* Summarize the search results into actionable, supportive advice. Do not present it as a treatment plan.
* Offer Practical Help (Use Calendar API):
* After providing information, offer to help the user schedule a reminder. For example: "If you'd like, I can set a reminder in your calendar to schedule an appointment with a doctor. Just let me know the date and time."

2. If the input prediction is "Likely a Healthy Control":
* Be Reassuring: Start by stating that the analysis did not find the specific patterns associated with schizophrenia.
* Maintain the Disclaimer: Even with a negative result, you must still advise the user that this is not a medical diagnosis and that they should consult a doctor if they have any health concerns.
* Offer General Wellness Information: Briefly offer to use your search tool to find general information on mental wellness or brain health if they are interested.

CONSTRAINTS AND ETHICAL GUIDELINES:

IDENTITY: You are "NeuroAI," an AI tool. You are not a person, a therapist, or a doctor.

DO NOT DIAGNOSE: Never use language that suggests you are confirming a diagnosis. Use phrases like "The model detected patterns associated with..." instead of "You have...".

DO NOT PROVIDE MEDICAL ADVICE: Do not suggest specific medications, treatments, or therapies. Your role is to provide information and guide the user to a human expert.

PRIORITIZE SAFETY: If a user expresses distress or mentions self-harm, your primary goal is to provide them with a crisis hotline number immediately.

BE CONCISE:keep your response clear and not too long..strictly between 50-60 words and say that u are NeuroAI.`

// DOM ELEMENTS
const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file-input');
const startOverButton = document.getElementById('start-over-button');

const initialView = document.getElementById('initial-view');
const loadingView = document.getElementById('loading-view');
const resultView = document.getElementById('result-view');

const statusText = document.getElementById('status-text');
const resultText = document.getElementById('result-text');

// EVENT LISTENERS
uploadButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
startOverButton.addEventListener('click', resetToInitialState);

// UI STATE FUNCTIONS
function showLoadingState(status) {
    statusText.textContent = status;
    initialView.classList.add('hidden');
    resultView.classList.add('hidden');
    loadingView.classList.remove('hidden');
}
function showResultState(text) {
    resultText.textContent = text;
    loadingView.classList.add('hidden');
    resultView.classList.remove('hidden');
}
function showErrorState(message) {
    resultText.textContent = `Error: ${message}`;
    loadingView.classList.add('hidden');
    resultView.classList.remove('hidden');
}
function resetToInitialState() {
    resultView.classList.add('hidden');
    loadingView.classList.add('hidden');
    initialView.classList.remove('hidden');
    fileInput.value = '';
}

// CORE LOGIC
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.edf')) {
        alert("Please upload a valid .edf file.");
        resetToInitialState();
        return;
    }

    try {
        showLoadingState("Uploading and analyzing EEG file...");
        const eegResult = await getPredictionFromEEGModel(file);

        showLoadingState("Generating insights...");
        const llmInsight = await getInsightFromLLM(eegResult);
        
        showResultState(llmInsight);

    } catch (error) {
        console.error("Full error:", error);
        showErrorState(error.message);
    }
}

async function getPredictionFromEEGModel(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(EEG_API_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`EEG Analysis Server Error: ${errorData.error || response.statusText}`);
    }

    return response.json();
}

async function getInsightFromLLM(eegResult) {
    const requestBody = {
        "contents": [{
            "parts": [{
                "text": `System Prompt: ${LLM_SYSTEM_PROMPT}\n\nUser Input (JSON from EEG Model): ${JSON.stringify(eegResult)}`
            }]
        }]
    };

    const response = await fetch(LLM_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`LLM Server Error: ${errorData.error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}