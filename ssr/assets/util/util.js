export function date2text(dateLike) {
  const timestamp = new Date(dateLike).getTime();
  const now = Date.now();
  const diff = now - timestamp;
  let result = '';
  switch (true) {
    case (diff < 60 * 1000):
      result = '刚刚';
      break;
    case (diff < 60 * 60 * 1000):
      result = `${Math.floor(diff / 60 / 1000)}分钟前`;
      break;
    case (diff < 24 * 60 * 60 * 1000):
      result = `${Math.floor(diff / 60 / 60 / 1000)}小时前`;
      break;
    case (diff < 30 * 24 * 60 * 60 * 1000):
      result = `${Math.floor(diff / 24 / 60 / 60 / 1000)}天前`;
      break;
    case (diff < 12 * 30 * 24 * 60 * 60 * 1000):
      result = `${Math.floor(diff / 30 / 24 / 60 / 60 / 1000)}月前`;
      break;
    default:
      result = `${Math.floor(diff / 12 / 30 / 24 / 60 / 60 / 1000)}年前`;
  }
  return result;
}
