let count = 0

setTimeout(() => {
  count++
}, 1000)

exports.count = count
exports.add = function() {
  count++
}

// 提供一个获取值的方法
exports.getCount = function() {
  return count
}