let params = [
  { id: 'A', pid: '' },
  { id: 'B', pid: 'A' },
  { id: 'C', pid: 'B' },
  { id: 'D', pid: 'B' }
]


// 递归
function array2treeRecursion(params) {
  const tree = []
  // 找出根节点
  for (const node of params) {
    if (!node.pid) {
      const p = { ...node }
      p.children = getChildren(p.id)
      tree.push(p)
    }
  }
  // 递归函数
  function getChildren(id) {
    const children = []
    for (const node of params) {
      if (node.pid === id) {
        children.push({...node})
      }
    }

    for (const child of children) {
      child.children = getChildren(child.id)
    }
    return children
  }
  return tree
}

// const tree = array2treeRecursion(params)
// console.log(tree)


// 循环
function array2treeLoop(params) {
  for (const child of params) {
    const pid = child.pid
    for (const parent of params) {
      if (parent.id === pid) {
        parent.children = parent.children || []
        parent.children.push(child)
      }
    }
  }

  return params.filter(node => !node.pid)
}

const tree = array2treeLoop(params)
console.log(tree)

// 使用Map
function array2treeMap(params) {
  const map = new Map()
  const tree = []
  for (const [index, node] of params.entries()) {
    node.children = []
    map.set(node.id, node)
  }
  for (const node of params) {
    if (node.pid && map.has(node.pid)) {
      map.get(node.pid).children.push(node)
    } else {
      tree.push(node)
    }
  }
  return tree
}
// const tree = array2treeMap(params)
// console.log(tree)


/**
 * tree to list
 * 树的遍历
 * ?https://juejin.cn/post/6952442048708345863#heading-5
 */