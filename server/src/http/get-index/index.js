const arc = require('@architect/functions');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const isInvalidRequestViaProxy = (req) =>
  req.pathParameters && req.pathParameters.proxy;

const loadPage = (name) =>
  readFile(path.join(__dirname, `${name}.html`), 'utf8');

const unauthorizedResponse = (body) => ({
  statusCode: 200,
  headers: { 'content-type': 'text/html; charset=utf8' },
  body,
});

exports.handler = async (req) => {
  if (isInvalidRequestViaProxy(req)) {
    return {
      statusCode: 404,
      headers: { 'content-type': 'text/plain; charset=utf8' },
      body: 'File not found',
    };
  }

  const { loggedIn } = await arc.http.session.read(req);

  try {
    if (!loggedIn) {
      const body = await loadPage('login');
      return unauthorizedResponse(body);
    }

    const content = await loadPage('index');
    const body = content
      .replace('__SPACE_ID__', process.env.SPACE_ID)
      .replace('__ACCESS_TOKEN__', process.env.ACCESS_TOKEN)
      .replace('__CF_ENV__', process.env.CF_ENV);
    const headers = {
      'content-type': 'text/html; charset=utf8',
      'cache-control': 'private, no-store',
    };

    return {
      statusCode: 200,
      headers,
      body,
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,
      headers: { 'content-type': 'text/plain; charset=utf8' },
      body: 'Something went wrong.',
    };
  }
};
