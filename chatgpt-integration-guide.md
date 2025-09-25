# ChatGPT Integration Guide

## Option 1: Direct OpenAI API Integration

### Step 1: Get OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Keep it secure - never expose it in frontend code!

### Step 2: Backend Implementation

#### Node.js/Express Example:
```javascript
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});
```

#### Python/Flask Example:
```python
import openai
from flask import Flask, request, jsonify

app = Flask(__name__)
openai.api_key = "your-api-key-here"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    system_prompt = data.get('systemPrompt', 'You are a helpful assistant.')
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        max_tokens=1000,
        temperature=0.7
    )
    
    return jsonify({"response": response.choices[0].message.content})
```

### Step 3: Frontend Implementation

#### React Example:
```jsx
import React, { useState } from 'react';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          systemPrompt: 'You are a helpful assistant.'
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.isUser ? 'user' : 'ai'}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="loading">AI is typing...</div>}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
```

#### Vanilla JavaScript Example:
```html
<!DOCTYPE html>
<html>
<head>
    <title>ChatGPT Integration</title>
    <style>
        .chat-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .message { margin: 10px 0; padding: 10px; border-radius: 10px; }
        .user { background: #007bff; color: white; text-align: right; }
        .ai { background: #f1f1f1; color: black; }
        .input-area { display: flex; margin-top: 20px; }
        input { flex: 1; padding: 10px; border: 1px solid #ddd; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; }
    </style>
</head>
<body>
    <div class="chat-container">
        <div id="messages"></div>
        <div class="input-area">
            <input type="text" id="messageInput" placeholder="Type your message...">
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>

    <script>
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, true);
            input.value = '';

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        systemPrompt: 'You are a helpful assistant.'
                    })
                });

                const data = await response.json();
                addMessage(data.response, false);
            } catch (error) {
                addMessage('Sorry, there was an error.', false);
            }
        }

        function addMessage(text, isUser) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
            messageDiv.textContent = text;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Enter key support
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
```

## Option 2: Third-Party Services

### 1. **ChatGPT Widgets**
- **ChatGPT Widget**: Add a simple chat widget to your site
- **Tidio**: Customer service with AI integration
- **Intercom**: Advanced customer support with AI

### 2. **No-Code Solutions**
- **Zapier + OpenAI**: Connect without coding
- **Make.com**: Visual automation with ChatGPT
- **Bubble.io**: Drag-and-drop AI integration

## Option 3: Pre-built Chat Components

### React Libraries:
```bash
npm install react-chatbot-kit
npm install @chatscope/chat-ui-kit-react
```

### Vue.js Libraries:
```bash
npm install vue-chat-scroll
npm install vue-chatbot
```

## Security Best Practices

### 1. **Never expose API keys in frontend**
```javascript
// ❌ WRONG - Never do this!
const apiKey = "sk-..."; // Exposed to users!

// ✅ CORRECT - Use backend
fetch('/api/chat', { ... }); // API key stays on server
```

### 2. **Rate limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/chat', limiter);
```

### 3. **Input validation**
```javascript
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  // Validate input
  if (!message || message.length > 1000) {
    return res.status(400).json({ error: 'Invalid message' });
  }
  
  // Sanitize input
  const sanitizedMessage = message.trim().substring(0, 1000);
  // ... rest of code
});
```

## Cost Considerations

### OpenAI Pricing (as of 2024):
- **GPT-3.5-turbo**: $0.002 per 1K tokens
- **GPT-4**: $0.03 per 1K tokens
- **Average conversation**: ~500 tokens = $0.001

### Cost Optimization:
1. **Use GPT-3.5-turbo** for most use cases
2. **Implement caching** for common questions
3. **Set usage limits** per user
4. **Monitor API usage** regularly

## Advanced Features

### 1. **Context Memory**
```javascript
// Store conversation context
const conversationContext = {
  userId: 'user123',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
    { role: 'assistant', content: 'Hi! How can I help you?' }
  ]
};
```

### 2. **Custom System Prompts**
```javascript
const systemPrompts = {
  customerService: 'You are a helpful customer service representative...',
  technicalSupport: 'You are a technical support specialist...',
  sales: 'You are a friendly sales assistant...'
};
```

### 3. **File Upload Support**
```javascript
// Handle file uploads with ChatGPT
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/chat-with-file', upload.single('file'), async (req, res) => {
  // Process file and send to ChatGPT
  const fileContent = await readFile(req.file.path);
  // ... send to ChatGPT with file context
});
```

## Deployment Options

### 1. **Vercel (Recommended for React)**
```bash
# Deploy frontend
vercel --prod

# Deploy API routes
# Create api/chat.js in your project
```

### 2. **Netlify**
```bash
# Build and deploy
npm run build
netlify deploy --prod
```

### 3. **AWS/Google Cloud/Azure**
- Use serverless functions (Lambda, Cloud Functions, Azure Functions)
- Set up API Gateway for routing
- Use environment variables for API keys

## Testing Your Integration

### 1. **Test API Endpoint**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","systemPrompt":"You are helpful"}'
```

### 2. **Frontend Testing**
```javascript
// Test in browser console
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Test message',
    systemPrompt: 'You are a helpful assistant.'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Add CORS middleware
2. **API key not working**: Check environment variables
3. **Rate limiting**: Implement proper rate limiting
4. **Memory issues**: Clear conversation context periodically

### Debug Tips:
```javascript
// Add logging
console.log('Request received:', req.body);
console.log('OpenAI response:', data);
```

This guide covers everything you need to integrate ChatGPT into any website! 🚀
