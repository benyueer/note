
/**
 * 1.通过对象属性存储已有值，但会将类型转为string
 * 2.Array filter过滤已有值
 * 3.ES6的set不允许出现重复元素
 * 
 */
function deDuplication1(arr) {
  let res = {}
  arr.forEach(a => {
    res[a] = a
  })
  return Object.keys(res)
}

function deDuplication2(arr) {
  return arr.filter((a, index) => arr.indexOf(a) === index)
}

function deDuplication3(arr) {
  return [...new Set(arr)]
}


let arr = [1,2,3,3,2,1]

console.log(deDuplication1(arr), deDuplication2(arr), deDuplication2(arr), )