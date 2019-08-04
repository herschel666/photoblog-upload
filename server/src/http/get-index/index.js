const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

exports.handler = async () => {
  try {
    const filePath = path.join(
      __dirname,
      'node_modules',
      'photoblog-upload-client',
      'build',
      'index.html'
    );
    const content = await readFile(filePath, 'utf8');
    const body = content
      .replace('%REACT_APP_SPACE_ID%', process.env.SPACE_ID)
      .replace('%REACT_APP_ACCESS_TOKEN%', process.env.ACCESS_TOKEN);

    return {
      headers: { 'content-type': 'text/html; charset=utf8' },
      body,
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf8' },
      body: 'Something went wrong.',
    };
  }
};
