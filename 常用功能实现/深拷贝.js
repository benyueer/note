/**
 * 深拷贝
 */


function deepCopy(obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  let newObj = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key])
    }
  }
  return newObj
}


// 内置对象、循环引用
function deepCopy_(obj, map = new WeakMap()) {
  if (map.get(obj)) return obj

  let ctor = obj.constructor
  if (/^(RegExp|Date)/i.test(ctor.name)) {
    return new ctor(obj)
  }
  if (typeof obj === 'object') {
    map.set(obj, true)
    const newObj = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepCopy_(obj[key], map)
      }
    }
    return newObj
  } else {
    return obj
  }
}


let a = {
  
}

let obj = {
  name: 123,
  data: {
    date: new Date(),
    fun: function(msg) {
      console.log(msg)
    },
    test: /^a/,
    child: {
      data: {
        name: 234,
        time: new Date()
      }
    }
  },
  a: a
}
a.data = obj

let c = deepCopy_(obj)
console.log(c)
c.data.child.data.name = 'qwe'
console.log(obj.data.child.data.name)