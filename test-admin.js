import fetch from 'node-fetch';

async function testAdminAuth() {
  try {
    console.log('Testing admin authentication...');
    
    const response = await fetch('http://localhost:3001/api/admin-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: '1Lucasshtainer' }),
    });

    const data = await response.json();
    console.log('Response:', data);
    
    if (data.success) {
      console.log('✅ Admin authentication successful!');
    } else {
      console.log('❌ Admin authentication failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error testing admin auth:', error.message);
  }
}

testAdminAuth();
