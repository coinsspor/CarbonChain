import https from 'https';

console.log('⭐ Testing Gold Standard Registry...\n');

const options = {
  hostname: 'registry.goldstandard.org',
  path: '/projects',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'CarbonChain/1.0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    console.log(`\nResponse:`, data.substring(0, 500));
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.end();
