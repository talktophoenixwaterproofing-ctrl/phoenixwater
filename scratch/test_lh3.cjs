const https = require('https');

const urls = [
  'https://lh3.googleusercontent.com/d/1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq',
  'https://lh3.googleusercontent.com/d/1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq=s0',
  'https://lh3.googleusercontent.com/d/1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq=w1000'
];

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      console.log(`Content-Length: ${res.headers['content-length']}`);
      console.log(`Content-Disposition: ${res.headers['content-disposition']}`);
      console.log('---');
      resolve();
    }).on('error', (e) => {
      console.error(`Error: ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const url of urls) {
    await check(url);
  }
}

run();
