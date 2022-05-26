

const fetch = () => Promise.resolve({data: Math.random()})

async function pollingFun() {
  let resolve_ = null
  const polling = async () => {
    return new Promise(async (resolve, reject) => {
      resolve_ = resolve_ || resolve
      const res = await fetch()
      if (res.data < 0.2) {
        console.log(1, !!resolve_)
        resolve_(res.data)
      } else {
        setTimeout(() => {
          console.log(2)
          // resolve(22)
          polling()
        }, 3000)
      }
    })
  }
  return await polling()
}

async function main() {
  try {
    console.log(12)
    const res = await pollingFun()
    console.log(3)
    console.log('res', res)
  } catch(e) {

  } finally {
    console.log('finally')
  }
}

main()