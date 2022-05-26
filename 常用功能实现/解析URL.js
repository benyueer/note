const url = encodeURI('http://qwe.com?name=qwe&time=123&msg=a d&parent=&id=1&name=rty')

function resolveUrl(url) {
  const paramsStr = url.split('?')[1]
  const params = paramsStr.split('&')
  const res = {}
  for (let param of params) {
    const [key, value] = param.split('=')
    if (res.hasOwnProperty(key)) {
      res[key] = Array.isArray(res[key]) ? res[key].push(decodeURI(value)) : [res[key], decodeURI(value)]
    } else {
      res[key] = decodeURI(value)
    }
  }
  return res
}

console.log(resolveUrl(url))