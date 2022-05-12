/**
 * 对象数组去重
 */

const a = [{ a: 1, b: 2 }, { a: 2 }, { a: 2 }, { a: 1, b: 3 }, { a: 1, b: 2 }]
function fun(arr) {
  const len = arr.length
  const res = []
  const repeat = []
  for (let i = 0 ; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      const keys1 = Object.keys(arr[i])
      const keys2 = Object.keys(arr[j])
      if (keys1.length !== keys2.length) {
        continue
      }
      let flag = true
      for (let k = 0; k < keys1.length; k++) {
        if (arr[i][keys1[k]] !== arr[j][keys1[k]]) {
          flag = false
          break
        }
      }
      flag && repeat.push(j)
    }
  }
  for (let i = 0; i < len; i++) {
    if (!repeat.includes(i)) {
      res.push(arr[i])
    }
  }
  return res
}

console.log(fun(a))