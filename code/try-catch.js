function f1() {
  let a = 1
  try {
    a = 2
    // throw new Error('oops');
    a = 3
  } catch (e) {
    console.log('e', e)
    a = 4
  } finally {
    // a = 5
    throw new Error('e')
  }
  return a
}

function f3() {
  console.log(a) //1 2
}


function f2() {
  let a = 2
  f3()
}

let a = 1

f2()

// console.log(f1())
// f1()