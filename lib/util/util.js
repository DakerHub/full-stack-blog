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
  let date = new Date(dateLike)
  let hours = '' + date.getHours()
  let mins = '' + date.getMinutes()
  let seconds = '' + date.getSeconds()
  let fullYears = '' + date.getFullYear()
  let months = '' + (date.getMonth() + 1)
  let days = '' + date.getDate()
  let years = fullYears.substring(2)
  let result
  format = format || 'YYYY-MM-DD'
  result = format.replace('YYYY', fullYears)
  result = result.replace('YY', years)
  result = result.replace('MM', months.padStart(2, '0'))
  result = result.replace('DD', days.padStart(2, '0'))
  result = result.replace('hh', hours.padStart(2, '0'))
  result = result.replace('mm', mins.padStart(2, '0'))
  result = result.replace('ss', seconds.padStart(2, '0'))
  return result
};
