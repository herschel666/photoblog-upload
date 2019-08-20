const arc = require('@architect/functions');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const loadPage = (name) =>
  readFile(path.join(__dirname, `${name}.html`), 'utf8');

const unauthorizedResponse = (body) => ({
  statusCode: 200,
  headers: { 'content-type': 'text/html; charset=utf8' },
  body,
});

exports.handler = async (req) => {
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
