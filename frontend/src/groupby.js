export function groupBy(array, keyfunc) {
  const result = [];
  array.forEach((item, i) => {
    const key = keyfunc(item, i)
    if (result[key] === undefined) {
      result[key] = [item];
    } else {
      result[key].push(item);
    }
  });
  return result;
}
