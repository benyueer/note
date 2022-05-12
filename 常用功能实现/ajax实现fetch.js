function myFetch(url, timeout) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.send()
    const startTime = Date.now()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (Date.now() - startTime < timeout) {
          resolve(xhr.responseText)
        } else {
          reject(new Error('timeout'))
        }
      }
    }
    setTimeout(reject, timeout)
  })
}