const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const getContentType = (type) => {
  switch (type) {
    case 'css':
      return 'text/css; charset=utf8';
    case 'js':
      return 'application/javascript; charset=utf8';
    default:
      return 'text/plain; charset=utf8';
  }
};

exports.handler = async (req) => {
  try {
    const filePath = path.join(
      __dirname,
      'node_modules',
      'photoblog-upload-client',
      'build',
      'static',
      req.params.type,
      req.params.filename
    );
    const body = await readFile(filePath, 'utf8');
    return {
      headers: {
        'content-type': getContentType(req.params.type),
        'cache-control': 'public, max-age=31536000, immutable',
      },
      body,
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 404,
      headers: { 'content-type': getContentType() },
      body: `File static/${req.params.type}/${req.params.filename} does not exist.`,
    };
  }
};
