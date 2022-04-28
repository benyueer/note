/**
 * 基本用法
 */

// function add(a, b) {
//   return a + b
// }

// 最后一个参数为函数题，之前的参数为新函数的参数列表
const add = new Function('a', 'b', 'return a + b')
console.log(add.__proto__ === Function.prototype) // true

// const r = add(1, 2)
// console.log(r) // 3

// 直接将传入的字符串作为脚本，返回值为该脚本的返回值
// 


function funThis() {
  console.log(this === global) // true
}

funThis()


const obj = {
  msg: 'hello',
}

console.log(this) // node中的全局this指向module.exports
// 将给定的表达式扩展到要执行的脚本的作用域链上
with(obj) {
  // breakpoint
  console.log(msg) // hello
  console.log(obj) // {msg: 'hello'}
}

/**
 * 作用域问题
 */

let msg = 'world'
function scope1() {
  let msg = 'hello'
  eval('console.log(msg)') // hello
  new Function('console.log(this)')()
}
// scope1()

function scope2() {
  let msg = 'hello'
  global.eval('console.log(msg)') // hello
  // new Function('console.log(this)')()
}
// scope2()

function scope3() {
  let msg = 'hello'
  let foo = 'foo'
  with({ msg }) {
    console.log(msg, foo) // hello
  }
}
scope3()