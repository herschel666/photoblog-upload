exports.handler = async () => {
  return {
    statusCode: 404,
    headers: { 'content-type': 'text/plain; charset=utf8' },
    body: 'Not found',
  };
};
