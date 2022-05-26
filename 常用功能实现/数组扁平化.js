/**
 * 数组扁平化
 */

// 递归
function flat(arr) {
  const result = []

  for (let t of arr) {
    if (Array.isArray(t)) {
      result.push(...flat(t))
    } else {
      result.push(t)
    }
  }

  return result
}

console.log(flat([1,2, [3, [6, [7]]]]))


// es6
// concat会自动解包一层数组
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    console.log(...arr)
      arr = [].concat(...arr);
  }
  return arr;
}
console.log(flatten([1,2, [3, [6, [7]]]]))
