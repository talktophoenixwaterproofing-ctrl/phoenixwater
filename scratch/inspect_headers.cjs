const https = require('https');
const url = 'https://lh3.googleusercontent.com/d/1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq';

https.get(url, (res) => {
  console.log(`HTTP Status: ${res.statusCode}`);
  console.log('Headers:');
  console.log(JSON.stringify(res.headers, null, 2));
}).on('error', (e) => {
  console.error(`Error: ${e.message}`);
});
