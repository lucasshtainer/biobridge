import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// JSON file storage for user data
const USER_DATA_FILE = path.join(__dirname, 'user_data.json');

// Initialize user data file if it doesn't exist
if (!fs.existsSync(USER_DATA_FILE)) {
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read user data
function readUserData() {
  try {
    const data = fs.readFileSync(USER_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return [];
  }
}

// Helper function to save user data
function saveUserData(userData) {
  try {
    const existingData = readUserData();
    const newUserData = {
      ...userData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    existingData.push(newUserData);
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(existingData, null, 2));
    console.log('User data saved successfully:', newUserData.id);
    return newUserData;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://biobridge-frontend.onrender.com', 'https://yourdomain.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the dist directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, systemPrompt, medicalData } = req.body;
    
    console.log('Received chat request:', { message, hasSystemPrompt: !!systemPrompt, hasMedicalData: !!medicalData });
    
    // Use OpenAI API with the official library
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are a helpful AI health assistant. ALWAYS structure responses with these sections:\n\n**What You Can Do:**\n• List actionable steps\n• Lifestyle changes\n• Home remedies\n\n**Medications:**\n• Over-the-counter options\n• Prescription considerations\n• Dosage notes\n\nUse SHORT, CONCISE bullet points. Be direct and informative. Always remind users to consult healthcare professionals for medical advice."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;
    
    console.log('OpenAI response received:', aiResponse.substring(0, 100) + '...');
    
    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Fallback to simulated response if OpenAI fails
    try {
      const simulatedResponse = await simulateChatGPTResponse(message, medicalData);
      res.json({
        response: simulatedResponse,
        timestamp: new Date().toISOString(),
        fallback: true
      });
    } catch (fallbackError) {
      res.status(500).json({
        error: 'Failed to process chat message',
        message: error.message
      });
    }
  }
});

// Admin Authentication
app.post('/api/admin-auth', async (req, res) => {
  try {
    const { password } = req.body;
    
        // Set your admin password here - change this to something secure!
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';
    
    // Clean and normalize passwords
    const cleanPassword = password ? password.trim() : '';
    const cleanAdminPassword = ADMIN_PASSWORD ? ADMIN_PASSWORD.trim() : '';
    
    console.log('Admin auth attempt - Received password:', `"${cleanPassword}"`);
    console.log('Admin auth attempt - Expected password:', `"${cleanAdminPassword}"`);
    console.log('Admin auth attempt - Match:', cleanPassword === cleanAdminPassword);
    
    if (cleanPassword === cleanAdminPassword) {
      res.json({ 
        success: true, 
        message: 'Admin authenticated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Invalid admin password' 
      });
    }
  } catch (error) {
    console.error('Error in admin auth:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Save user data to JSON file
app.post('/api/save-user-data', async (req, res) => {
  try {
    const userData = req.body;
    
    // Save to JSON file
    const savedData = saveUserData(userData);
    
    res.json({ 
      success: true, 
      message: 'User data saved successfully',
      id: savedData.id,
      timestamp: savedData.timestamp
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Get all user data
app.get('/api/user-data', async (req, res) => {
  try {
    const userData = readUserData();
    
    res.json({
      success: true,
      data: userData,
      total_records: userData.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Data Collection API endpoints
app.post('/api/collect-data', async (req, res) => {
  try {
    const { patientData, consent } = req.body;
    
    // Import the data collector
    const { medicalDataCollector } = await import('./dataCollection.js');
    
    // Add consent to patient data
    const dataWithConsent = { ...patientData, ...consent };
    
    // Process and collect data
    const success = medicalDataCollector.addData(dataWithConsent);
    
    // Also save to JSON file
    try {
      saveUserData(dataWithConsent);
    } catch (jsonError) {
      console.error('Error saving to JSON file:', jsonError);
    }
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Data collected successfully',
        analytics: medicalDataCollector.getAnalytics()
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Data collection requires explicit consent' 
      });
    }
  } catch (error) {
    console.error('Error collecting data:', error);
    res.status(500).json({ error: 'Failed to collect data' });
  }
});

// Get analytics data
app.get('/api/analytics', async (req, res) => {
  try {
    const { medicalDataCollector } = await import('./dataCollection.js');
    const analytics = medicalDataCollector.getAnalytics();
    
    res.json({
      success: true,
      analytics: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Export data for commercial use
app.get('/api/export-data', async (req, res) => {
  try {
    const { medicalDataCollector } = await import('./dataCollection.js');
    const data = medicalDataCollector.exportData();
    
    res.json({
      success: true,
      data: data,
      total_records: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// OpenAI API is now handled directly in the endpoint using the openai library

// Simulate ChatGPT response based on medical data
async function simulateChatGPTResponse(message, medicalData) {
  // This is a simplified simulation - in production, you'd use the actual OpenAI API
  const lowerMessage = message.toLowerCase();
  
  // Health-related responses based on common queries
  if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
    const bp = medicalData?.systolic && medicalData?.diastolic 
      ? `${medicalData.systolic}/${medicalData.diastolic} mmHg`
      : 'not provided';
    return `I can see your blood pressure is ${bp}. Based on general guidelines:
- Normal: <120/80 mmHg
- Elevated: 120-129/<80 mmHg  
- Stage 1 Hypertension: 130-139/80-89 mmHg
- Stage 2 Hypertension: ≥140/90 mmHg

Please consult with your healthcare provider for personalized interpretation and management.`;
  }
  
  if (lowerMessage.includes('cholesterol') || lowerMessage.includes('hdl') || lowerMessage.includes('ldl')) {
    const totalChol = medicalData?.totalChol || 'not provided';
    const hdl = medicalData?.hdl || 'not provided';
    const ldl = medicalData?.ldl || 'not provided';
    
    return `Your cholesterol levels are:
- Total Cholesterol: ${totalChol} mg/dL
- HDL (Good): ${hdl} mg/dL  
- LDL (Bad): ${ldl} mg/dL

General guidelines:
- Total Cholesterol: <200 mg/dL (desirable)
- HDL: >60 mg/dL (protective)
- LDL: <100 mg/dL (optimal)

Remember, these are general guidelines. Your healthcare provider can provide personalized recommendations based on your complete health profile.`;
  }
  
  if (lowerMessage.includes('diabetes') || lowerMessage.includes('glucose') || lowerMessage.includes('sugar')) {
    const glucose = medicalData?.fastingGlucose || 'not provided';
    const diabetes = medicalData?.diabetes || 'not provided';
    
    return `Your diabetes status is: ${diabetes}
Fasting Glucose: ${glucose} mg/dL

General guidelines:
- Normal: <100 mg/dL
- Prediabetes: 100-125 mg/dL
- Diabetes: ≥126 mg/dL

Please work with your healthcare team for proper diabetes management and monitoring.`;
  }
  
  if (lowerMessage.includes('weight') || lowerMessage.includes('bmi')) {
    const height = medicalData?.heightCm || 0;
    const weight = medicalData?.weightKg || 0;
    const bmi = height && weight ? (weight / Math.pow(height / 100, 2)).toFixed(1) : 'not calculable';
    
    return `Your current measurements:
- Height: ${height} cm
- Weight: ${weight} kg
- BMI: ${bmi}

BMI Categories:
- Underweight: <18.5
- Normal: 18.5-24.9
- Overweight: 25-29.9
- Obese: ≥30

Please discuss any weight management goals with your healthcare provider.`;
  }
  
  if (lowerMessage.includes('medication') || lowerMessage.includes('drug')) {
    const medications = medicalData?.medications || 'not provided';
    return `Your current medications: ${medications}

It's important to:
- Take medications as prescribed
- Keep an updated medication list
- Inform all healthcare providers of your medications
- Report any side effects to your doctor

Always consult your healthcare provider before making any changes to your medications.`;
  }
  
  if (lowerMessage.includes('allergy') || lowerMessage.includes('allergic')) {
    const allergies = medicalData?.allergies || 'not provided';
    return `Your known allergies: ${allergies}

Important reminders:
- Always inform healthcare providers of your allergies
- Carry an allergy alert card or bracelet
- Know the signs of allergic reactions
- Have emergency medications (like epinephrine) if prescribed

If you experience severe allergic reactions, seek immediate medical attention.`;
  }
  
  // General health advice
  if (lowerMessage.includes('exercise') || lowerMessage.includes('fitness')) {
    return `Regular physical activity is important for overall health. The CDC recommends:
- At least 150 minutes of moderate-intensity aerobic activity per week
- Muscle-strengthening activities on 2+ days per week

Always consult your healthcare provider before starting a new exercise program, especially if you have medical conditions.`;
  }
  
  if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
    return `A balanced diet is crucial for good health. General recommendations include:
- Fruits and vegetables
- Whole grains
- Lean proteins
- Healthy fats
- Limited processed foods and added sugars

Consider consulting a registered dietitian for personalized nutrition advice based on your health conditions and goals.`;
  }
  
  // Default response
  return `Thank you for your question about "${message}". 

I can help you understand your health information, but please remember:
- I'm an AI assistant, not a medical professional
- Always consult your healthcare provider for medical advice
- For emergencies, call 911 or go to the nearest emergency room
- Keep your healthcare team informed about any concerns

Is there something specific about your health data you'd like me to explain?`;
}

// Handle React routing, return the main index.html file for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
