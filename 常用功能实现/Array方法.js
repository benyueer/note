/**
 * forEach
 */
Array.prototype.forEach_ = function(cb) {
  if (!Array.isArray(this)) throw new Error()
  if (typeof cb !== 'function') throw new Error()
  console.log('this', this)
  for (let i = 0; i < this.length; i++) {
    cb(this[i], i)
  }
};

[1, '2'].forEach_((item, index) => {
  console.log(item, index)
})

/**
 * filter
 */
Array.prototype.filter_ = function(cb) {
  if (!Array.isArray(this)) throw new Error()
  if (typeof cb !== 'function') throw new Error()
  const res = []
  for (let i = 0; i < this.length; i++) {
    cb(this[i], i) ? res.push(this[i]) : void(0)
  }
  return res
}

const r = [1, 2].filter_((item, i) => {
  console.log(item, i)
  return i < 1
})
console.log(r)


/**
 * map
 */
Array.prototype.map_ = function(cb) {
  if (!Array.isArray(this)) throw new Error()
  if (typeof cb !== 'function') throw new Error()
  const res = []
  for (let i = 0; i < this.length; i++) {
    res.push(cb(this[i], i))
  }
  return res
};

const r1 = [1,2,3].map((item, i) => {
  console.log(item, i)
  return item * 2
})
console.log(r1)

/**
 * some
 */
Array.prototype.some_ = function(cb) {
  if (!Array.isArray(this)) throw new Error()
  if (typeof cb !== 'function') throw new Error()
  let flag = false
  for (let i = 0 ; i < this.length; i++) {
    if (cb(this[i], i)) {
      flag = true
      break
    }
  }
  return flag
}

const arr = [{data: 1}, {data: 2}]
arr.some_((item) => {
  item.data = item.data * 2
  return item.data < 3
})

console.log('arr', arr)



/**
 * reduce
 */
Array.prototype.reduce_ = function(cb, initialValue) {
  if (!Array.isArray(this)) throw new Error()
  if (typeof cb !== 'function') throw new Error()

  for (let i = 0; i< this.length; i++) {
    initialValue = cb(initialValue, this[i], i)
  }
};
[].reduce