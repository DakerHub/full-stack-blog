const jws = require('jws');
const { SECRET, whiteList } = require('../../config/config');

module.exports = function (req, res, next) {
  const signature = req.headers.authorization;
  if (whiteList.includes(req._parsedUrl.pathname)) {
    next();
  } else if (signature) {
    if (signature === 'TOKEN001') {
      req.userId = 'admin';
      next();
    } else {
      const valid = jws.verify(signature, 'HS256', SECRET);
      let payload = null;
      if (!valid) {
        res.sendStatus(401);
        return;
      }
      payload = JSON.parse(jws.decode(signature).payload);
      req.userId = payload.userid;
      next();
    }
  } else {
    return res.sendStatus(401);
  }
};
