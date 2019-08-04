const arc = require('@architect/functions');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const unauthorizedResponse = {
  statusCode: 401,
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
    <form method="post">
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
      statusCode: 500,
      headers: { 'content-type': 'text/plain; charset=utf8' },
      body: 'Something went wrong.',
    };
  }
};
