// Test script to view collected data
import fetch from 'node-fetch';

async function testDataViewer() {
  try {
    console.log('🔍 Testing Data Viewer...\n');
    
    // Test analytics endpoint
    console.log('📊 Fetching Analytics...');
    const analyticsResponse = await fetch('http://localhost:3001/api/analytics');
    const analyticsData = await analyticsResponse.json();
    
    if (analyticsData.success) {
      console.log('✅ Analytics Data:');
      console.log(`   Total Users: ${analyticsData.analytics.total_users}`);
      console.log(`   Age Groups: ${Object.keys(analyticsData.analytics.demographics_breakdown.age_groups).length}`);
      console.log(`   Health Conditions: ${Object.keys(analyticsData.analytics.health_metrics_summary.common_conditions).length}`);
    } else {
      console.log('❌ Analytics failed:', analyticsData.error);
    }
    
    // Test raw data endpoint
    console.log('\n📋 Fetching Raw Data...');
    const rawDataResponse = await fetch('http://localhost:3001/api/export-data');
    const rawData = await rawDataResponse.json();
    
    if (rawData.success) {
      console.log('✅ Raw Data:');
      console.log(`   Total Records: ${rawData.total_records}`);
      if (rawData.data.length > 0) {
        console.log(`   Sample Record:`, JSON.stringify(rawData.data[0], null, 2));
      } else {
        console.log('   No data collected yet. Complete the registration form to start collecting data.');
      }
    } else {
      console.log('❌ Raw data failed:', rawData.error);
    }
    
    console.log('\n🌐 To view data in browser:');
    console.log('   1. Start your servers:');
    console.log('      - Backend: node server.js');
    console.log('      - Frontend: npm run dev');
    console.log('   2. Open browser: http://localhost:5173');
    console.log('   3. Click "Data" button in navigation');
    console.log('   4. View analytics, raw data, and export options');
    
  } catch (error) {
    console.error('❌ Error testing data viewer:', error.message);
  }
}

// Run the test
testDataViewer();
