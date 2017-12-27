const log4js = require('log4js');
const { LOG_PATH, DATE_LOG_PATH } = require('././../../config/config');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: LOG_PATH,
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
      numBackups: 5, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
      mode: 0o0640,
      flags: 'w+'
    },
    dateFile: {
      type: 'dateFile',
      filename: DATE_LOG_PATH,
      pattern: 'yyyy-MM-dd-hh',
      compress: true
    },
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: { appenders: ['file', 'out'], level: 'trace' },
    dbConnect: { appenders: ['file', 'out'], level: 'error' }
  }
});

const logger = log4js.getLogger();
const dblogger = log4js.getLogger('dbConnect');
module.exports = {
  reqErr(err, req) {
    let message = err.errmsg || err.message || err;
    let errLog = '';
    const { method, originalUrl, params, query, body } = req;
    if (message && typeof message !== 'string') {
      message = err.toString();
    }
    errLog += message + '\n';
    errLog += method + ':' + originalUrl + '\n';
    if (params) {
      errLog += 'params:' + JSON.stringify(params) + '\n';
    }
    if (query) {
      errLog += 'query:' + JSON.stringify(query) + '\n';
    }
    if (body) {
      errLog += 'body:' + JSON.stringify(body) + '\n';
    }
    logger.error(errLog);
  },
  dbErr(err) {
    let message = err.errmsg || err.message || err;
    if (message && typeof message !== 'string') {
      message = err.toString();
    }
    dblogger.error(message);
  }
};
