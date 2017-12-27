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
