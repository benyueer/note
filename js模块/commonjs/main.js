const {count, add, getCount} = require('./moduleA')
console.log(count) // 0
setTimeout(() => {
  console.log(count) // 0
  console.log(getCount())
}, 2000)
add()
console.log(count)
console.log(getCount()) // 通过getCount获取到的值是正确的