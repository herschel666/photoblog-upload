const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

exports.handler = async (req) => {
  console.log(req);

  try {
    const filePath = path.join(__dirname, 'favicon.ico');
    const content = await readFile(filePath);
    const body = content.toString('base64');
    const headers = {
      'content-type': 'image/x-icon',
      'cache-control': 'public, max-age=604800',
    };

    return {
      isBase64Encoded: true,
      statusCode: 200,
      headers,
      body,
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 404,
      headers: { 'content-type': 'text/plain; charset=utf8' },
      body: 'Not found',
    };
  }
};
