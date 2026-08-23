const https = require('https');

function test(url) {
  https.get(url, {
    headers: {
      'X-YVP-App-Key': 'dummy_key',
      'Accept': 'application/json'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(url, '=>', res.statusCode, data);
    });
  });
}

test('https://api.youversion.com/v1/bibles?language_tag=en');
test('https://api.youversion.com/v1/bibles?language_tag=eng');
test('https://api.youversion.com/v1/bibles');
test('https://api.youversion.com/v1/bibles?language=eng');
test('https://api.youversion.com/v1/bibles?language_ranges=eng');
