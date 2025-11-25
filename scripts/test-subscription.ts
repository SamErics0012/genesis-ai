// Test the API route directly
async function testSubscriptionAPI() {
  const userId = 'TrBLsWzHIXyOx9K6AzbMxe85UB8E3P7e';
  
  console.log('Testing subscription API...');
  
  try {
    const response = await fetch(`http://localhost:3001/api/subscription?userId=${encodeURIComponent(userId)}`);
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log('API response:');
    console.log('Data:', data);
    
    if (data.subscription) {
      console.log('Plan:', data.subscription.plan_type);
      console.log('Status:', data.subscription.status);
      console.log('Expires:', data.subscription.expires_at);
    } else {
      console.log('No subscription found');
    }
    
  } catch (err) {
    console.error('Caught exception:', err);
  }
}

testSubscriptionAPI();
