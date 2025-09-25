// Demo script to test the chat API
import fetch from 'node-fetch';

const testMedicalData = {
  name: "John Doe",
  age: "45",
  sex: "Male",
  heightCm: "175",
  weightKg: "80",
  systolic: "130",
  diastolic: "85",
  heartRate: "75",
  totalChol: "220",
  hdl: "45",
  ldl: "150",
  triglycerides: "125",
  fastingGlucose: "110",
  smoker: "Former",
  diabetes: "Prediabetes",
  medications: "Metformin 500mg daily",
  allergies: "Penicillin",
  medicalConditions: [
    {
      id: "1",
      organ: "Heart & Cardiovascular",
      condition: "High Blood Pressure",
      details: "Diagnosed 2 years ago"
    }
  ],
  surgicalHistory: [
    {
      id: "1",
      bodyPart: "Abdomen & Digestive",
      surgery: "Appendectomy",
      year: "1995",
      details: "Emergency surgery"
    }
  ]
};

async function testChatAPI() {
  try {
    console.log('Testing BioBridge Chat API...\n');
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "What does my blood pressure mean?",
        systemPrompt: "You are a helpful AI health assistant...",
        medicalData: testMedicalData
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Chat API Response:');
    console.log('Response:', data.response);
    console.log('Timestamp:', data.timestamp);
    
  } catch (error) {
    console.error('❌ Error testing chat API:', error.message);
  }
}

// Run the test
testChatAPI();
