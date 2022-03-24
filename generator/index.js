
function test1() {
  function* gen() {
    console.log('hello')
    yield 1
    yield 2
    yield 3
  }

  const g = gen()

  console.log(g.next())
}
// test1()

function test2() {
  function* gen(a) {
    for (let i = 0; i < a.length; i++) {
      if (Array.isArray(a[i])) {
        yield* gen(a[i])
      } else {
        yield a[i]
      }
    }
  }

  const g = gen([1, [2, [3, 4], 5], 6])
  for (let v of g) {
    console.log(v)
  }

}
// test2()

function test3() {

  function add1(a) {
    return a + 1
  }

  function* gen(a) {
    const b = yield add1(a)
    console.log(b)
    yield add1(b)
  }

  const g = gen(1)
  let c
  console.log(c = g.next(4))
  console.log(g.next(c.value + 2))

}
// test3()

function test4() {

  function f1 (a) {
    console.log(2)
    return a + 1
  }

  function* gen(a1) {
    const a = yield Promise.resolve().then(() => {
      console.log(1)
      return 2
    })
    const b = f1(a)
    const c = yield Promise.resolve(b).then((res) => {
      console.log(3)
      return res + 1
    })
    return c
  }

  function co(gen) {
    const g = gen()
    return new Promise((resolve) => {
      function next(a) {
        const { value, done } = g.next(a)
        if (done) {
          resolve(value)
        } else {
          Promise.resolve(value).then(next)
        }
      }
      next()
    })

  }

  co(gen).then((res) => console.log(res, 'res'))

}

test4()