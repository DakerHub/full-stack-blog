export default function assert(params, conditions) {
  conditions.forEach(condition => {
    const { field, required, type, children } = condition;
    const value = params[field];
    if (required && typeof value === 'undefined') {
      throw new Error('The argument `' + field + '` is required');
    }
    if (type && typeof value !== type) {
      throw new Error('The argument `' + field + '` must be ' + type);
    }
    if (value && Array.isArray(children)) {
      assert(value, children);
    }
  });
}
