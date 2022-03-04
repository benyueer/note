### 1.js变量类型
- 基本类型：string, number, boolean, null, undefined
- 引用类型：object, array, function
判断类型：
- typeof： 返回值为字符串，bool, number, string, object, function, undefined
```js
typeof null // "object"
// 因为null的字节码开始的前三位为000，与object相同
```
- instanceof： 判断对象是否是某个类的实例，是则返回true，否则返回false
```js
function myInstanceof (obj, Ctor) {
  if (typeof obj !== 'null' || typeof  Ctor !== 'function') {
    return false
  }

  obj = Object.getPrototypeOf(obj)

  while (obj) {
    if (obj === Ctor.prototype) {
      return true
    }
    obj = Object.getPrototypeOf(obj)
  }
  return false
}
```
### 2.null undefined 区别
- null和undefined是基本类型，undefined表示未定义，null表示空对象
- 转为number时，null转为0，undefined转为NaN
- 比较两个值时，双等号返回true，三等号返回false

### 3.prototype和proto
- `prototype`是函数才有的属性,解决继承, 这个对象的用途就是包含所有实例共享的属性和方法（我们把这个对象叫做原型对象）。原型对象也有一个属性，叫做constructor，这个属性包含了一个指针，指回原构造函数。
- `__proto__`是每个对象都有的属性,指向构造函数的原型
- `__proto__===constructor.prototype` （构造器原型）字面量、构建函数方式的指向

- `Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

- 所有构造器/函数的`__proto__`都指向`Function.prototype`

- 如果构造函数返回的是Object,那么new出来的就是返回值,如果返回的是基本类型,new出来的就是构造函数生成的对象

### 4.原型链终点是null

### 5.js继承

### 6.闭包

#### 闭包的变量是怎么存储的
[闭包中的变量到底存在哪里？](https://juejin.cn/post/6887054571080777735)
[ECMAScript词法环境](https://cloud.tencent.com/developer/article/1676297)
闭包中的变量会存到堆内存中,但并非闭包中所有的变量都存储在堆中，而是只有被内部方法引用的变量才会存储在堆中。

在闭包存在时，会生成一个内部对象`[[Scopes]]`，代表作用域链，其内部存在`[[Closure]]`对象，代表闭包的变量。

### 7.作用域链

  #### 变量对象、活动对象
  [变量对象、活动对象](https://juejin.cn/post/6990526490911703048)


### 8.this

#### call、apply、bind
[apply, call性能问题](https://www.jianshu.com/p/7c797a565f14)
[原理与实现](https://juejin.cn/post/6844903889322377223)
[参考](https://zhuanlan.zhihu.com/p/83130909)
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
`call`、`apply`、`bind`都是函数的方法，第一个参数都是要改变的this指向，也就是想指定的上下文
`call` `apply`都是立即调用函数，`bind`是返回一个绑定好上下文的函数，供以后调用


### 9.new操作符


### 10.消息队列，事件循环

### 11.Promise




### 服务器代理装饰，如何处理cookie


### escape、encodeURI、encodeURIComponent


### 深拷贝


### ES6


### JS 变量存储
  [JS 变量存储](https://juejin.cn/post/6844903997615128583)
  - 栈
  栈是内存中一块用于存储局部变量和函数参数的线性结构，遵循着先进后出的原则。数据只能顺序的入栈，顺序的出栈。当然，栈只是内存中一片连续区域一种形式化的描述，数据入栈和出栈的操作仅仅是栈指针在内存地址上的上下移动而已。
  内存中栈区的数据，在函数调用结束后，就会自动的出栈，不需要程序进行操作，操作系统会自动执行，换句话说：栈中的变量在函数调用结束后，就会消失。
  因此栈的特点：**轻量，不需要手动管理，函数调用时创建，调用结束则消失**

  - 堆
  在栈中存储不了的数据（比如一个对象），就会被存储在堆中，栈中就仅仅保留一个对该数据的引用（也就是该块数据的首地址）。

  > 对于原始类型，数据本身是存在栈内，对于对象类型，在栈中存的只是一个堆内地址的引用。

在 JavaScript 中，变量分为三种类型：
1. 局部变量
2. 被捕获变量
3. 全局变量

###### 局部变量
**在函数中声明，且在函数返回后不会被其他作用域所使用的对象**
如下`local*`都是局部变量
```js
  function test () {
    let local1 = 1;
    var local2 = 'str';
    const local3 = true;
    let local4 = {a: 1};
    return;
  }
```

###### 被捕获变量
在函数中声明，但在函数返回后仍有未执行作用域（函数或是类）使用到该变量，那么该变量就是被捕获变量。下面代码中的 `catch*` 都是被捕获变量。
```js
function test1 () {
    let catch1 = 1;
    var catch2 = 'str';
    const catch3 = true;
    let catch4 = {a: 1};
    return function () {
        console.log(catch1, catch2, catch3, catch4)
    }
}

function test2 () {
    let catch1 = 1;
    let catch2 = 'str';
    let catch3 = true;
    var catch4 = {a: 1};
    return class {
        constructor(){
            console.log(catch1, catch2, catch3, catch4)
        }
    }
}

console.dir(test1())
console.dir(test2())

```

###### 全局变量
全局变量就是 `global`，在 浏览器上为 `window` 在 `node` 里为 `global`。全局变量会被默认添加到函数作用域链的最低端，也就是上述函数中 `[[Scopes]]` 中的最后一个。

全局变量需要特别注意一点：`var` 和 `let/const` 的区别

- var
全局的 `var` 变量其实仅仅是为 `global` 对象添加了一条属性

- let/const
全局的 `let/const` 变量不会修改 `windows` 对象，而是将变量的声明放在了一个特殊的对象下（与 `Scope` 类似）。
```js
let testLet = 1;

console.dir(() => {})
```
以上代码在Chrome中会输出以下对象，其中 `testLet` 变量在 `[[Scopes]]` 中的为类型Script的一项
```js
anonymous()
length: 0
name: ""
arguments: 
caller:
[[Scopes]]: Scopes[2]
  0: Script 
    testLet: 1
    [[Prototype]]: Object
  1: Global {window: Window, self: Window, document: document, name: '', location: Location, …}

```

##### 两种存储方式
1. 栈（Stack）
2. 堆（Heap）

**除了局部变量，其他的全都存在堆中**， 根据变量的数据类型，分为以下两种情况：
1. 如果是基础类型，那栈中存的是数据本身。
2. 如果是对象类型，那栈中存的是堆中对象的引用。

JavaScript 解析器如何判断一个变量是局部变量呢？
判断出是否被内部函数引用即可！
因此存在一种情况，没有被内部函数使用的变量是不会放到`[[Scopes]]`中的`[[Closure]]`。

#### 变量赋值
根据 `=` 号右边变量的类型分为两种方式:

##### 赋值为常量
常量就是一赋值就可以确定的值，如`1`、`"string"`、`true`、`{a: 1}`，这些值一旦声明就不可改变。
假如现在声明变量
```js
let a = 1
```
那么在内存中：
>a => |0X12121|1|

如果现在又声明了一个变量
```js
let b = 2
```
那么内存中就会变成这样：
>a => |0X12121|1|
b => |0X12131|2|

如果声明了一个对象：
```js
let obj = {
  a: 1, 
  b: 2
}
```
内存模型如下：
>a => |0X12121|1|
b => |0X12131|2|
obj => |0x34342|0x43322| => {a: 1, b: 2}

其实 `obj` 指向的内存地址保存的也是一个地址值，那好，如果我们让 `obj.foo = 'foo'` 其实修改的是 0x43322 所在的内存区域，但 `obj` 指向的内存地址不会发生改变，因此，对象是常量！

##### 赋值为变量
在上述过程中的 `a`、`b`、`obj`，都是变量，变量代表一种引用关系，其本身的值并不确定。
```js
let x = a
```
>x => ↘️
a => |0X12121|1|
b => |0X12131|2|
obj => |0x34342|0x43322| => {a: 1, b: 2}

如上图所示，仅仅是将 `x` 引用到与 `a` 一样的地址值而已，并不会使用新的内存空间

#### 变量修改
##### 修改为常量
```js
a = 'foo'
```
>a => |0X12134|'foo'|
x => ↘️
 |0X12121|1|
b => |0X12131|2|
obj => |0x34342|0x43322| => {a: 1, b: 2}

如上所示，仅仅是将 `a` 引用的地址修改了而已


### 路由懒加载原理

### tree-shaking

### HTTP相关

wep-push

### 浏览器渲染流程
css文件 script标签是否打断渲染 
css硬件加速
[参考1](https://juejin.cn/post/6844903966573068301)
[参考2](https://segmentfault.com/a/1190000014520786)

#### 字体加载
[参考](https://zhuanlan.zhihu.com/p/272783891)

### 文件上传与下载

#### 大文件上传和断点续传
[参考](https://juejin.cn/post/6844904046436843527)


### JS Function
- `arguments`对象
  `arguments`对象是所有函数中可用的局部变量
  只有函数被调用时，`arguments`对象才会创建，未调用时其值为`null`

  - 属性
    -  `arguments.callee`
    // 指向当前执行的函数。
    - `arguments.caller`  `arguments.callee.caller`替代了被废弃的 `arguments.caller`
    如果一个函数`f`是在全局作用域内被调用的,则`f.caller`为`null`,相反,如果一个函数是在另外一个函数作用域内被调用的,则`f.caller`指向调用它的那个函数
    // 指向调用当前函数的函数。
    - `arguments.length`
    // 指向传递给当前函数的参数数量。 

- 函数执行
  JS代码在浏览器中运行时，解释器执行代码到调用某个函数时，被调用的函数加入`Call Stack`栈，创建对应这个函数的`执行上下文`
  当一个执行上下文入栈时，它有两个生命周期，创建和执行阶段：
  - 创建阶段：
    - 生成变量对象（`Variable Object`） 
    - 建立作用域链（`Scope chain`） 
    - 确定函数中 `this` 的指向
  - 执行阶段:
    - 变量赋值 
    - 函数引用 
    - 执行其他代码

    执行阶段完毕，执行上下文出栈，内存被回收。

  1. 变量对象
    通常代码中会定义一些变量和函数，解释器首先会找到这些变量和函数的定义，它会在执行上下文创建的时候首先生成**变量对象**
    以函数环境为例，在调用某个函数时，这个函数入栈函数调用栈，此时它处于栈的顶端。此时先进入执行上下文的创建阶段，它包含以下三个部分：
      1. 创建函数的`arguments`对象。检查当前上下文中的参数，建立该对象下的属性与属性值。没有实参的话，属性值为`undefined`。
      2. 这个函数内部的所有函数声明。就是使用`function`关键字声明的函数。在变量对象中以函数名建立一个属性，属性值为指向该函数所在内存地址的引用。如果函数名的属性已经存在，那么该属性将会被新的引用所覆盖。
      3. 这个函数内部的所有变量声明。每找到一个变量声明，就在变量对象中以变量名建立一个属性，属性值为`undefined`。如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会影响已经存在的这类属性。
  2. 活动对象
    还是要以函数环境为主要场景。在进入执行阶段之前，变量对象中的属性都不可访问。进入执行阶段后，变量对象 变成活动对象（`Activation Object`），里面的属性可以被访问了，然后执行代码。
    注意**变成** 这个词。它表明了在函数执行上下文中 变量对象（`Variable Object`） 和活动对象（`Activation Object`） 是同一个对象，它们只是存在**不同生命周期**中。
  3. JS的提升（hsoting）机制
      1. 变量提升
        使用`var`声明变量会造成变量提升，例如
          ```js
          var a = 1
          ``` 
          解释器会将其拆分为
          ```js
          var a
          a = 1
          ```
          两部分，第一部分是变量声明，第二部分是变量赋值。变量声明会提前到代码执行前。
      2. 函数提升
        函数提升与变量提升一样都是提升到当前作用域顶端
        但只有函数声明式才会造成提升
          ```js
          // 函数声明式
          fun() // 可以在函数声明前执行
          function fun() { // 会提升

          }

          // 函数表达式式
          fun1() // 报错
          let fun1 = function a() { // 不会提升

          }
          console.log(a) // undefined
          ```
          
          一个特殊的例子：
          ```js
          console.log(typeof a) // function
          console.log(a) // function a
          function a () {}
          console.log(a) // function a
          var a = 1
          console.log(a) // 1
          ```
          由此可知，**函数提升优先于变量提升**，当`var a`提升时，已有`function a`，则会跳过`var a`,但之后的`a = 1`会将`a`赋值为`1`。

    [参考1](https://juejin.cn/post/6990526490911703048)
