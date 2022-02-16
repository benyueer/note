import data, {a} from './moduleA.mjs'

console.log(data.name)

console.log('a', a)

setTimeout(() => {
  console.log(data.name)
  console.log('a', a)
}, 2000)

async function getName() {
  const {default: {name}} = await import('./moduleA.mjs')
  console.log(name)
}

getName()