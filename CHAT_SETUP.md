# BioBridge AI Assistant Setup

## Overview
The BioBridge AI Assistant is now integrated with ChatGPT API to provide intelligent health insights based on user medical data.

## Features
- **AI-Powered Chat Interface**: Interactive chat with ChatGPT integration
- **Medical Data Analysis**: AI can analyze and provide insights on user's medical information
- **Real-time Responses**: Fast, intelligent responses to health-related questions
- **Secure Data Handling**: Medical data is processed securely with proper context

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. OpenAI API Configuration (Optional)
To use the real ChatGPT API instead of simulated responses:

1. Get an OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Development Mode
Start both the frontend and backend:

```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

### 4. Production Mode
```bash
npm run start
```

## How It Works

### Chat Interface
- Click "myAssistant" in the navigation to access the chat interface
- The AI has access to your complete medical profile
- Ask questions about your health data, medications, lab results, etc.

### Medical Data Integration
The AI assistant can analyze:
- Personal information (age, sex, height, weight)
- Vital signs (blood pressure, heart rate)
- Laboratory results (cholesterol, glucose, etc.)
- Medical conditions and surgical history
- Current medications and allergies

### AI Responses
The system provides:
- **Contextual Analysis**: Responses based on your specific medical data
- **Health Insights**: General health information and recommendations
- **Safety Reminders**: Always reminds users to consult healthcare professionals
- **Educational Content**: Explains medical terms and concepts

## API Endpoints

### POST /api/chat
Sends a message to the AI assistant with medical context.

**Request Body:**
```json
{
  "message": "What does my blood pressure mean?",
  "systemPrompt": "You are a helpful AI health assistant...",
  "medicalData": { /* user's medical data */ }
}
```

**Response:**
```json
{
  "response": "Based on your blood pressure of 120/80 mmHg...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Security & Privacy

- Medical data is processed securely
- No data is stored permanently on the server
- All API calls are encrypted
- User data is only used for providing contextual responses

## Troubleshooting

### Common Issues

1. **Chat not responding**: Check if the backend server is running on port 3001
2. **API errors**: Verify your OpenAI API key is correct (if using real API)
3. **No medical data**: Ensure you've completed the patient registration form first

### Development Tips

- The system falls back to simulated responses if OpenAI API is not configured
- Check browser console for any JavaScript errors
- Verify network connectivity for API calls

## Future Enhancements

- Real-time medical data updates
- Integration with electronic health records
- Advanced medical AI models
- Multi-language support
- Voice interface integration
