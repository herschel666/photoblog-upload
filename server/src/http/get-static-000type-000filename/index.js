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
  console.log(req);
  const { type, filename } = req.pathParameters;
  try {
    const filePath = path.join(__dirname, 'static', type, filename);
    const body = await readFile(filePath, 'utf8');
    return {
      statusCode: 200,
      headers: {
        'content-type': getContentType(type),
        'cache-control': 'public, max-age=31536000, immutable',
      },
      body,
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 404,
      headers: { 'content-type': getContentType() },
      body: `File static/${type}/${filename} does not exist.`,
    };
  }
};
