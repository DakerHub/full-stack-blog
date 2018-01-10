module.exports.hasMissing = function (params) {
  const missing = [];
  for (const [k, v] of Object.entries(params)) {
    if (!v && v !== 0) {
      missing.push(missing);
    }
  }
  if (missing.length > 0) {
    return 'the params "' + missing.join(',') + '" is required!';
  }
  return false;
};

module.exports.formatDate = function (dateLike, format) {
  const date = new Date(dateLike);
  const hours = '' + date.getHours();
  const mins = '' + date.getMinutes();
  const seconds = '' + date.getSeconds();
  const fullYears = '' + date.getFullYear();
  const months = '' + (date.getMonth() + 1);
  const days = '' + date.getDate();
  const years = fullYears.substring(2);
  let result;
  format = format || 'YYYY-MM-DD';
  result = format.replace('YYYY', fullYears);
  result = result.replace('YY', years);
  result = result.replace('MM', months.padStart(2, '0'));
  result = result.replace('DD', days.padStart(2, '0'));
  result = result.replace('hh', hours.padStart(2, '0'));
  result = result.replace('mm', mins.padStart(2, '0'));
  result = result.replace('ss', seconds.padStart(2, '0'));
  return result;
};

module.exports.intersection = (a, b) => {
  const s = new Set(b);
  return a.filter(x => s.has(x));
};
