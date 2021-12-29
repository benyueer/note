console.log(1)

let data = {
  name: 'module a'
}

setTimeout(() => {
  data.name = 'changed name'
  console.log(data.name)
}, 1000)

export default data
export let a = 'a'
setTimeout(() => {
  a = 'aa'
}, 1000)