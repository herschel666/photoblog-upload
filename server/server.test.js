const { writeFileSync: writeFile } = require('fs');
const { resolve: urlJoin } = require('url');
const { join: pathJoin } = require('path');
const sandbox = require('@architect/sandbox');
const nodeFetch = require('node-fetch');
const { CookieJar } = require('tough-cookie');
const fetch = require('fetch-cookie/node-fetch')(nodeFetch, new CookieJar());
const isBase64 = require('is-base64');

let log;

const loginPageParts = [
  '<title>ek|photos &middot; Upload</title>',
  'Login</legend>',
  'Password</label>',
  'Submit</button>',
];

const staticFilePath = pathJoin(
  __dirname,
  'src',
  'http',
  'get-static-000type-000filename',
  'static'
);

const url = (pathname = '') => urlJoin('http://localhost:3333', pathname);

beforeAll(async () => {
  const fileArgs = ['test', 'utf8'];
  log = console.log;
  console.log = () => void 0;

  writeFile(pathJoin(staticFilePath, 'js', 'test.js'), ...fileArgs);
  writeFile(pathJoin(staticFilePath, 'css', 'test.css'), ...fileArgs);

  try {
    await sandbox.start({ quiet: true });
  } catch (err) {
    expect(err).toBeNull();
  }
});

afterAll(async () => {
  console.log = log;
  try {
    await sandbox.end();
  } catch (err) {
    expect(err).toBeNull();
  }
});

describe('GET /', () => {
  it('loads the login page', async () => {
    const response = await fetch(url());
    expect(response.ok).toBe(true);

    const html = await response.text();
    loginPageParts.forEach(expect(html).toContain);
  });
});

describe('POST /', () => {
  it('log in & loads web app', async () => {
    const parts = [
      '<title>ek|photos &middot; Upload</title>',
      '<div id="___app"></div>',
      'SPACE_ID:"',
      'ACCESS_TOKEN:"',
      'CF_ENV:"',
    ];
    const response = await fetch(url('/'), {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'password=letmein',
    });
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const html = await response.text();
    parts.forEach(expect(html).toContain);
  });
});

describe('POST /logout', () => {
  it('logs out & loads the login page', async () => {
    const response = await fetch(url('/logout'), {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'name=logout',
    });
    expect(response.ok).toBe(true);

    const html = await response.text();
    loginPageParts.forEach(expect(html).toContain);
  });
});

describe('GET /favicon.ico', () => {
  it('loads the favicon', async () => {
    const response = await nodeFetch(url('favicon.ico'));
    expect(response.ok).toBe(true);

    expect(response.headers.get('content-type')).toBe('image/x-icon');
    expect(
      isBase64(Buffer.from(await response.arrayBuffer()).toString('base64'))
    ).toBe(true);
  });
});

describe('GET /static/:type/:filename', () => {
  it.each([
    ['JS', 'application/javascript; charset=utf8'],
    ['CSS', 'text/css; charset=utf8'],
  ])('loads %s', async (name, contentType) => {
    const fileSuffix = name.toLowerCase();
    const response = await nodeFetch(
      url(`static/${fileSuffix}/test.${fileSuffix}`)
    );
    expect(response.ok).toBe(true);
    expect(response.headers.get('content-type')).toBe(contentType);
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=31536000, immutable'
    );
    expect(response.text()).resolves.toBe('test');
  });

  it.each(['js/unknown.js', 'css/unknown.css', 'foo/bar.txt'])(
    'sends 404 for file "%s"',
    async (filePath) => {
      const response = await nodeFetch(url(`static/${filePath}`));

      expect(response.ok).not.toBe(true);
      expect(response.status).toBe(404);
      expect(response.headers.get('content-type')).toBe(
        'text/plain; charset=utf8'
      );
      expect(response.text()).resolves.toMatch(
        /^File static\/.+ does not exist\.$/
      );
    }
  );
});

describe('ANY /*', () => {
  ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'].forEach((method) => {
    it.each(['/.htaccess', '/.htpasswd', '/index.html', '/lorem/ipsum.txt'])(
      `handles invalid pathnames coming via the catchAll route for ${method}-requests`,
      async (pathName) => {
        const response = await fetch(url(pathName), { method });

        expect(response.ok).not.toBe(true);
        expect(response.status).toBe(404);
        expect(response.headers.get('content-type')).toBe(
          'text/plain; charset=utf8'
        );
        if (method !== 'HEAD') {
          expect(response.text()).resolves.toBe('Not found');
        }
      }
    );
  });
});
