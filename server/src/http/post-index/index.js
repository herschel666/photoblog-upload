const arc = require('@architect/functions');

exports.handler = async (req) => {
  const { password } = req.body;

  if (password !== process.env.PASSWORD) {
    return {
      statusCode: 304,
      headers: { location: '/' },
    };
  }

  const session = await arc.http.session.read(req);
  const cookie = await arc.http.session.write({ ...session, loggedIn: true });

  return {
    statusCode: 302,
    headers: {
      'set-cookie': cookie,
      location: '/',
    },
  };
};
