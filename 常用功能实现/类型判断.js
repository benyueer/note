/**
 * typeof 可以正确识别：Undefined、Boolean、Number、String、Symbol、Function 等类型的数据，但是对于其他的都会认为是 object，比如 Null、Date 等，所以通过 typeof 来判断数据类型会不准确。但是可以使用 Object.prototype.toString 实现
 */

function getType(val) {
  return Object.prototype.toString.call(val).split(' ')[1].replace(']', '')
}

let val = null

console.log(getType(val))
/**
 * typeof Null 返回Object是因为typeof通过机器吗的低位来判断的，如下
 * 
 * 类型         机器码标识
 * Object         000
 * 整数           1
 * 浮点数         010
 * 字符串         100
 * 布尔           110
 * undefined     -2^31（即全为1）
 * null           全为0
 * 
 * null和object的机器吗低位一样，所以返回值相同
 */