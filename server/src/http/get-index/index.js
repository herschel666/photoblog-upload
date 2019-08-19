const arc = require('@architect/functions');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const unauthorizedResponse = {
  statusCode: 200,
  headers: { 'content-type': 'text/html; charset=utf8' },
  body: /* html */ `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex,noarchive">
    <title>ek|photos &middot; Upload</title>
  </head>
  <body>
    <form method="post" action="/">
      <fieldset>
        <legend>Login</legend>
        <label for="password">Password</label>
        <input type="password" name="password" id="password">
        <button>Submit</button>
      </fieldset>
    </form>
  </body>
</html>
`,
};

exports.handler = async (req) => {
  const { loggedIn } = await arc.http.session.read(req);

  if (!loggedIn) {
    return unauthorizedResponse;
  }

  try {
    const filePath = path.join(__dirname, 'index.html');
    const content = await readFile(filePath, 'utf8');
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
