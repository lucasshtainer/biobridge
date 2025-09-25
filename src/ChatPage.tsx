import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPageProps {
  medicalData: any;
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ medicalData, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI health assistant. I can help you understand your medical information, answer health-related questions, and provide insights based on your health data. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMedicalData = (data: any) => {
    if (!data) return "No medical data available.";
    
    let formattedData = `Patient Information:\n`;
    formattedData += `- Name: ${data.name || 'Not provided'}\n`;
    formattedData += `- Age: ${data.age || 'Not provided'} years\n`;
    formattedData += `- Sex: ${data.sex || 'Not provided'}\n`;
    formattedData += `- Height: ${data.heightCm || 'Not provided'} cm\n`;
    formattedData += `- Weight: ${data.weightKg || 'Not provided'} kg\n`;
    
    if (data.systolic && data.diastolic) {
      formattedData += `- Blood Pressure: ${data.systolic}/${data.diastolic} mmHg\n`;
    }
    if (data.heartRate) {
      formattedData += `- Heart Rate: ${data.heartRate} bpm\n`;
    }
    
    // Lab results
    if (data.totalChol || data.hdl || data.ldl || data.triglycerides || data.fastingGlucose) {
      formattedData += `\nLaboratory Results:\n`;
      if (data.totalChol) formattedData += `- Total Cholesterol: ${data.totalChol} mg/dL\n`;
      if (data.hdl) formattedData += `- HDL: ${data.hdl} mg/dL\n`;
      if (data.ldl) formattedData += `- LDL: ${data.ldl} mg/dL\n`;
      if (data.triglycerides) formattedData += `- Triglycerides: ${data.triglycerides} mg/dL\n`;
      if (data.fastingGlucose) formattedData += `- Fasting Glucose: ${data.fastingGlucose} mg/dL\n`;
    }
    
    // Medical conditions
    if (data.medicalConditions && data.medicalConditions.length > 0) {
      formattedData += `\nMedical Conditions:\n`;
      data.medicalConditions.forEach((condition: any, index: number) => {
        formattedData += `${index + 1}. ${condition.organ} - ${condition.condition}`;
        if (condition.details) formattedData += ` (${condition.details})`;
        formattedData += `\n`;
      });
    }
    
    // Surgical history
    if (data.surgicalHistory && data.surgicalHistory.length > 0) {
      formattedData += `\nSurgical History:\n`;
      data.surgicalHistory.forEach((surgery: any, index: number) => {
        formattedData += `${index + 1}. ${surgery.bodyPart} - ${surgery.surgery} (${surgery.year})`;
        if (surgery.details) formattedData += ` - ${surgery.details}`;
        formattedData += `\n`;
      });
    }
    
    // Additional info
    if (data.smoker) formattedData += `\nSmoking Status: ${data.smoker}\n`;
    if (data.diabetes) formattedData += `Diabetes Status: ${data.diabetes}\n`;
    if (data.medications) formattedData += `Current Medications: ${data.medications}\n`;
    if (data.allergies) formattedData += `Allergies: ${data.allergies}\n`;
    
    return formattedData;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare the medical data context
      const medicalContext = formatMedicalData(medicalData);
      
      // Create the prompt for ChatGPT
      const systemPrompt = `You are a helpful AI health assistant. You have access to the patient's medical information and should provide helpful, accurate, and empathetic responses. 

CRITICAL: ALWAYS structure responses with these sections:

**What You Can Do:**
• List actionable steps
• Lifestyle changes  
• Home remedies

**Medications:**
• Over-the-counter options
• Prescription considerations
• Dosage notes

Use SHORT, CONCISE bullet points. Be direct and informative.

Here is the patient's medical information:

${medicalContext}

Please respond to the user's question while considering their medical history. Be helpful but always emphasize that you are not a replacement for professional medical advice.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          systemPrompt: systemPrompt,
          medicalData: medicalData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact support if the issue persists.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Health Assistant</h1>
                <p className="text-sm text-gray-500">Powered by ChatGPT</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {!message.isUser && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{
                      __html: message.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/•/g, '&bull;')
                    }} />
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your health..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={`px-6 py-3 rounded-2xl font-medium transition duration-200 ${
                !inputText.trim() || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI responses are for informational purposes only. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
