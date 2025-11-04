import https from 'https';

console.log('🌳 Testing Verra Registry...\n');

// Verra public search endpoint
const options = {
  hostname: 'registry.verra.org',
  path: '/mymodule/rpt/myrpt.asp?r=206',
  method: 'GET',
  headers: {
    'Accept': 'text/html',
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
    console.log(`Content-Type:`, res.headers['content-type']);
    console.log(`\nResponse length:`, data.length, 'bytes');
    console.log(`First 500 chars:`, data.substring(0, 500));
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.end();
