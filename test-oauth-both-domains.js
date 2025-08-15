// Test OAuth initiation on both domains
console.log('Testing OAuth on both domains...');

const testDomains = [
  'https://mystartup.ai/api/auth/google/manual',
  'https://dcce2b51-81d9-4f52-b724-4633b7613eaa-00-1pco1isub73pc.spock.replit.dev/api/auth/google/manual'
];

testDomains.forEach(async (url, index) => {
  try {
    const response = await fetch(url, { redirect: 'manual' });
    console.log(`Domain ${index + 1}:`, url);
    console.log('Status:', response.status);
    console.log('Redirect:', response.headers.get('location'));
    console.log('---');
  } catch (error) {
    console.log(`Domain ${index + 1} error:`, error.message);
  }
});