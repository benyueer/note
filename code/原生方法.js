/**
 * Object
 */

// assign
function assign() {
  let arr1 = [{v:1}, {v:2}, {v:3}]
  let arr2 = [{v:4}, {v:5}, {v:6}]
  
  function case1() {
    /**
     * case1:
     * arr1 arr2 arr3 的值变化都不会影响其他值
     */
    let arr3 = Object.assign([], arr1, arr2)
    arr1[0].v = 0
    arr2[0].v = 9
    console.log(arr3) // [9, 5, 6]
    arr3[1].v = 8
    console.log(arr1, arr2) // [0, 2, 3] [9, 8, 6]
  }
  case1()

  function case2() {
    /**
     * case2:
     * arr1 arr2 arr3 的值变化都会影响其他值
     */
    let arr3 = Object.assign(arr1, arr2)
    console.log(arr3) // [4, 5, 6]
    arr1[0].v = 0
    arr2[1].v = 1
    console.log(arr3) // [0, 1, 6]
    arr3[0].v = 9
    console.log(arr1, arr2) // [9, 1, 6] [9, 1, 6]
  }
  // case2()
}

// assign()


// create
/**
 * 使用现有的对象来提供新创建的对象的__proto__
 * propertiesObject参数可以定义新对象的自身属性
 */
function create() {
  const person = {
    name: 'hello',
    run() {
      console.log('go!!!')
    }
  }

  const lily = Object.create(person, {
    name: {
      value: 'lily',
    }
  })
  console.log(lily.name) // lily
  lily.run() // go!!!

  console.log(lily.__proto__ === person) // true
}
// create()


// entries
/**
 * 返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）
 */
function entries() {
  const obj1 = {
    data1: 1
  }

  const obj2 = Object.create(obj1, {
    data2: {
      value: 2,
      enumerable: true
    }
  })
  const iter = Object.entries(obj2)
  console.log(iter) // [ [ 'data2', 2 ] ]
}
// entries()


/**
 * 一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改
 */
function freeze() {
  // 对象
  const obj = {
    name: 'hello'
  }
  Object.freeze(obj)
  obj.name = 'world'
  console.log(obj.name) // hello

  // 数组
  const arr = [1, 2, 3]
  Object.freeze(arr)
  arr.push(4) // TypeError: Cannot add property 3, object is not extensible
  console.log(arr) // [1, 2, 3]

  // 引用对象
  const obj1 = {
    data: {

    }
  }
  Object.freeze(obj1)
  obj1.data.name = 'world' // 被冻结的对象的属性的属性是可以被修改的
  console.log(obj1.data.name) // world
}
// freeze()


// is
function is() {
  const o1 = {
    name: 'hello'
  }

  const o2 = {
    name: 'hello'
  }

  const o3 = o1

  const r = Object.is(o1, o3) 
  console.log(r)
}
// is()

// keys
function keys() {
  const o1 = {
    name: 'hello',
  }

  const o2 = {
    data: 'world'
  }
  o2.__proto__ = o1

  console.log(Object.keys(o2)) // [ 'data' ]
}
// keys()

// seal
/**
 * 方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置
 * 密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。
 * 属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。
 * 但属性的值仍然可以修改。
 */
function seal() {
  const obj = {
    name: 'hello'
  }
  Object.seal(obj)

  obj.name = 'world'
  obj.data = 'data'
  console.log(obj) // { name: 'world' }
}
// seal()

