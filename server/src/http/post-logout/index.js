const arc = require('@architect/functions');

exports.handler = async () => {
  const cookie = await arc.http.session.write({});

  return {
    statusCode: 302,
    headers: {
      'set-cookie': cookie,
      location: '/',
    },
  };
};
