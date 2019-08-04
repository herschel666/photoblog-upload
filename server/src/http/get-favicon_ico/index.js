const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

exports.handler = async () => {
  try {
    const filePath = path.join(__dirname, 'favicon.ico');
    const content = await readFile(filePath);
    const body = content.toString('base64');

    return {
      headers: { 'content-type': 'image/x-icon' },
      isBase64Encoded: true,
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
