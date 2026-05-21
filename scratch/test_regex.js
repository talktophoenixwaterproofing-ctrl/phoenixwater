const fileIdRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
const openIdRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
const dIdRegex = /\/d\/([a-zA-Z0-9_-]+)/;

const urls = [
  'https://drive.google.com/file/d/1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq/view?usp=drivesdk',
  'https://drive.google.com/open?id=1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq',
  'https://drive.google.com/uc?id=1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq',
  'https://lh3.googleusercontent.com/d/1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq',
  'https://drive.google.com/file/d/1Tw-apxygwFR2YGcOqAwDUPq5Fp9mBGAq'
];

urls.forEach(url => {
  let match = url.match(fileIdRegex);
  if (!match) match = url.match(openIdRegex);
  if (!match) match = url.match(dIdRegex);
  console.log(`URL: ${url}`);
  console.log(`Matched ID: ${match ? match[1] : 'None'}`);
  console.log('---');
});
