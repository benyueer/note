/**
 * 防抖
 * 在事件触发的n秒后再执行函数，如果n秒中时间再次被触发，则重新计时
 */
// 简单实现
function debounce(fun, delay) {
  let timer = null

  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fun.apply(this, args), delay)
  }
}

// 立即执行
function debounce_(fun, delay, isImmediate) {
  let timer = null

  return function(...args) {
    if (!timer && isImmediate) {
      fun.apply(this, args)
    }

    clearTimeout(timer)
    timer = setTimeout(() => {
      fun.apply(this, args)
      timer = null
    }, delay)
  }
}


/**
 * 节流
 * 以固定频率触发回调
 */
// 简单实现
function throttle(fun, delay) {
  let flag = false

  return function(...args) {
    if (flag) {
      flag = false
      setTimeout(() => {
        fun.apply(this, args)
        flag = true
      }, delay)
    }
  }
}

// 立即执行
function throttle_(fun, delay, isImmediate) {
  let flag = false

  return function(...args) {
    if (flag) {
      flag = false

      isImmediate && fun.apply(this, args)
      setTimeout(() => {
        !isImmediate && fun.apply(this, args)
        flag = true
      }, delay)
    }
  }
}

const obj = {
  data: 13,
  fun: () => {
    console.log(1, this == global)
    setTimeout(() => {
      console.log(2, this)
    })
  }
}
data = 121
module.exports = {data: 345}
console.log(3, this === module.exports)

obj.fun()



function test() {
  this.names = "anikin";
}
this.names = 'zhangsan';
test();

console.log(4, this, this.names)  // {}  zhangsan
console.log(5, global.names) // aninkin

 // 在打印一下看看这个this指向哪里呢
 console.log(this === exports); // true
