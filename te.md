

### 1、CSS

#### 垂直水平居中

1. 定位
   - top:50%; left:50%; margin-top-left: -50%current元素宽高
   - transform: -50%
2. flex
3. JavaScript
4. table-ceil

#### CSS优先级\权重

- 行内元素margin只有margin-left和margin-right有效,padding相同
-  important > 内联 > ID选择器 > 类选择器 > 标签选择器 

#### 图片自适应宽高

~~~html
<style>
	div{
		width: 200px;
		height: 200px;
		background: url('xxxx.png') no-repeat;
		background-size: cover;
		background-position: center center;
	}
</style>
~~~



### 2、盒模型

- 标准盒模型（w3c） `box-sizing: content-box`  （默认）
- 怪异盒模型（IE） `box-sizing: border-box` 
- flex盒模型

#### flex（弹性布局）

​	 设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效 

​	默认两根轴：水平主轴、垂直交叉轴，默认沿主轴排列

- 容器属性
  - flex-direction		主轴方向 row | row-reverse | column | column-reverse;
  - flex-wrap                是否换行 （默认不换行）  nowrap | wrap | wrap-reverse;
  - flex-flow                 
  - justify-content       在主轴上的对齐方式  flex-start | flex-end | center | space-between | space-around;
  - align-items              交叉轴上的对齐方式  flex-start | flex-end | center | baseline | stretch;
  - align-content         多跟轴线对齐方式（换行是交叉轴上的对齐方式）flex-start | flex-end | center | space-between | space-around | stretch;
- 项目属性
  - order                项目排列顺序（越小越靠前，默认0）
  - flex-grow          放大比例，默认0，不放大，如果都为1，将等分剩余空间
  - flex-shrink        缩小比例，默认1，空间不足将缩小，0不缩小
  - flex-basis          项目占据主轴空间，默认auto即本来大小
  - flex            `flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。 
  - align-self       该项目自己的对其方式，可覆盖`align-items`属性 ，默认auto，表示继承父元素，若无继承 ，等同于`stretch` （默认值，占满容器高度）

### 3、prototype和proto

1. ##### prototype是函数才有的属性,解决继承

2. ##### `__proto__`是每个对象都有的属性

3.  **`__proto__`===`constructor.prototype`** （构造器原型）字面量、构建函数方式的指向

4. **Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`** 

1.  所有构造器/函数的__proto__都指向`Function.prototype` 
2. 如果构造函数返回的是Object,那么new出来的就是返回值,如果返回的是基本类型,new出来的就是构造函数生成的对象

### 4、原型链的终点是null

### 5、版本兼容Ajax

~~~js
function createAjax() {
            var request = false
            // IE7以上及其他
            if (window.XMLHttpRequest) {
                request = new XMLHttpRequest()
                if (request.overrideMimeType) {
                    request.overrideMimeType('text/xml')
                }
            } else if(window.ActiveXObject) {
                var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP',
                                'Msxml2.XMLHTTP.7.0','Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0',
                                'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
                for (let i = 0 ; i < versions.length; i++) {
                    try {
                        request = new ActiveXObject(versions[i])
                        if (request) {
                            return request
                        }
                    } catch(e) {
                        request = false
                    }
                }
            }
            return request
        }
        var ajax = createAjax()
        // 设置回调函数
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4 && ajax.status === 200) {
                // ```
                console.log(ajax.responseText)
                // 如果来自服务器的响应是 XML，而且需要作为 XML 对象进行解析，请使用 responseXML 属性
            } else if (ajax.readyState === 4 && ajax.status !== 200) {
                console.log(ajax)
                // console.log('err')
            }
        }
        // 方法 url 是否异步（默认true，当使用false时，不用设置onreadystatechange，直接将代码写成同步形式）
        ajax.open('GET', 'https://www.qq.com', true)
        // 设置请求头
        // ajax.setRequestHeader('Content-type', 'text/html')
        ajax.setRequestHeader('Access-Control-Allow-Origin', '*')
        ajax.setRequestHeader('Access-Control-Allow-Method', 'POST,GET')
        // 发送请求 POST请求可带String类型参数
        ajax.send()
~~~

### 6、JavaScript模块系统

### 7、浏览器机制，重绘、回流

1. DOM：Document Object Model，浏览器将HTML解析成树形的数据结构，简称DOM。
2. CSSOM：CSS Object Model，浏览器将CSS解析成树形的数据结构，简称CSSOM。
3. Render Tree: DOM和CSSOM合并后生成Render Tree
4. Layout: 计算出Render Tree每个节点的具体位置。
5. Painting：通过显卡，将Layout后的节点内容分别呈现到屏幕上。

- 当我们浏览器获得HTML文件后，会自上而下的加载，并在加载过程中进行解析和渲染。
- 加载说的就是获取资源文件的过程，如果在加载过程中遇到外部CSS文件和图片，浏览器会另外发送一个请求，去获取CSS文件和相应的图片，这个请求是异步的，并不会影响HTML文件的加载。
- 但是如果遇到Javascript文件，HTML文件会挂起渲染的进程，等待JavaScript文件加载完毕后，再继续进行渲染。
   为什么HTML需要等待JavaScript呢？因为JavaScript可能会修改DOM，导致后续HTML资源白白加载，所以HTML必须等待JavaScript文件加载完毕后，再继续渲染，这也就是为什么JavaScript文件在写在底部body标签前的原因。

#### 重绘、回流

- Repaint ——改变某个元素的背景色、文字颜色、边框颜色等等不影响它周围或内部布局的属性时，屏幕的一部分要重画，但是元素的几何尺寸没有变。
- Reflow ——元件的几何尺寸变了，我们需要重新验证并计算Render Tree。是Render Tree的一部分或全部发生了变化。
- reflow 几乎是无法避免的。现在界面上流行的一些效果，比如树状目录的折叠、展开（实质上是元素的显 示与隐藏）等，都将引起浏览器的 reflow。鼠标滑过、点击……只要这些行为引起了页面上某些元素的占位面积、定位方式、边距等属性的变化，都会引起它内部、周围甚至整个页面的重新渲 染。通常我们都无法预估浏览器到底会 reflow 哪一部分的代码，它们都彼此相互影响着。
   注：display:none会触发reflow，而visibility:hidden只会触发repaint，因为没有发现位置变化。

触发回流：

1. 页面初始化
2. 添加或删除可见的DOM元素
3. 元素位置改变，使用动画
4. 元素尺寸改变
5. 浏览器窗口尺寸改变
6. 填充内容改变，如文本改变或图片尺寸改变
7. 读取元素的某些属性（offsetLeft/Height/Width......）

#### 优化

1. 浏览器自己的优化：队列，把所有重绘回流操作放入队列，等到达到条件时，flush队列，将多次重绘回流变成一次
2. 开发优化：减少对渲染树的操作，合并多次对DOM的修改：
   1. 直接修改className
   2. `display:none`; 先将元素设置为`display:none`;，然后进行DOM操作，操作完成后修改`display:block`;这样只会触发两次回流重绘
   3. 使用`cloneNode`和`replaceChild`
   4. 将需要多次操作的元素设置为`position:absolute`或`fixed`，使其脱离文档流，不会影响其他元素
   5. 创建多个DOM元素时，使用`DocumentFragment`创建完后一次加入document

### 8、async、await

### 9、HTTP缓存

浏览器缓存分为强缓存和协商缓存，浏览器加载一个页面的简单流程如下：

1. 浏览器先根据这个资源的http头信息来判断是否命中强缓存。如果命中则直接加在缓存中的资源，并不会将请求发送到服务器。
2. 如果未命中强缓存，则浏览器会将资源加载请求发送到服务器。服务器来判断浏览器本地缓存是否失效。若可以使用，则服务器并不会返回资源信息，浏览器继续从缓存加载资源。
3. 如果未命中协商缓存，则服务器会将完整的资源返回给浏览器，浏览器加载新资源，并更新缓存。

- **强缓存**

  - **Expires**：缓存过期时间  配合 `Last-modified` 

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

  

### 10、websocket

### 11、Promise相关

~~~js
catch捕获的错误不会向下传播
then第二个参数捕获的错误也不会向后传播
~~~



1. promise.all()

   ~~~js
   function promiseAll(promises) {
               return new Promise((resolve, reject) => {
                   if (!Array.isArray(promises)) {
                        reject('type err')
                   }
                   var resolveCounter = 0
                   var promisesNum = promises.length
                   var promisesResult = new Array(promisesNum)
                   for (let i in promises) {
                       Promise.resolve(promises[i]).then(value => {
                           resolveCounter++
                           promisesResult[i] = value
                           // console.log(value)
                           if (resolveCounter === promisesNum) {
                                resolve(promisesResult)
                           }
                       }, err => {
                            reject(err)
                       })
                   }
               })
           }
           var a = Promise.resolve(1)
           var b = Promise.reject(2)
           var c = Promise.resolve(3)
   
           promiseAll([a, b, c]).then(result => {
             console.log(result)
           }).catch(err => {
               console.log(err)
           })
   ~~~

2. promise.race()

   ~~~js
           function promiseRace(promises) {
               return new Promise((resolve, reject) => {
                   if (!Array.isArray(promises)) {
                       return reject('type err')
                   }
                   var promisesNum = promises.length
                   for (let i in promises) {
                       Promise.resolve(promises[i]).then(value => {
                           return resolve(value)
                       }, err => {
                           return reject(err)
                       })
                   }
               })
           }
           promiseRace([a, b, c]).then(res => {
               console.log(res)
           }, err => {
               console.log(err)
           })
   ~~~
   
   

### 12、跨域

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

    ​					此时会增加一次请求，称为**预检请求**

    ​					询问服务器，网页地址是否在允许之列，可以使用哪些字段

    ​					 一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。 

- 代理

- H5提供postMessage()方法

### 13、防抖、节流

~~~js
document.getElementById('fangdou').onclick = debounce(fangdoucb, 200)
        document.getElementById('jieliu').onclick = throttle(jieliucb, 200)
        function debounce(cb, dealy) {
            var timer = null
            return function(event) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    cb.call(this, event)
                }, dealy)
            }
        }
        function throttle(cb, delay) {
            var currrent = 0
            return function(event) {
                var time = Date.now()
                if(time - currrent > delay) {
                    cb.call(this, event)
                    currrent = time
                }
            }
        }
        function fangdoucb(e) {
            console.log('防抖', e)
        }
        function jieliucb(e) {
            console.log('节流', e)
        }
~~~



### 14、Cookie、Session、浏览器存储

~~~js
Cookie：HTTP是无状态的，不能保存用户信息，Cookie解决这一问题，发送请求时携带cookie，服务器就能区分用户状态
	Cookie有跨域限制、保存在客户端
    
Session：在服务端记录用户状态
	

~~~



### 15、TCP、HTTP、HTTPS

握手挥手

~~~
握手
	客户端发起请求，表示要建立连接
	服务器接收到请求，然后发送响应，表示准备好链接
	客户端接收到响应，然后发送响应，确认建立连接
	
挥手
	客户端发送完数据后，发送一个关闭连接的请求
	服务器接收到关闭请求后，回应这个请求，处理之前的数据传输
	数据传输处理完毕后，再次回应可以断开连接
	客户端接收到可以断开的响应后，发送响应确认断开
	
	
	
为什么三次握手
	防止失效的建立链接的请求传到服务器，如果只有两次握手，那么这次失效的链接只是在客户端失效，服务器端却认为链接建立成功，造成资源浪费
	
为什么四次挥手
	TCP是全双工，需要双方同时达到关闭状态，第一次挥手时客户端的发送任务结束，发送FIN表示释放连接，第二次挥手为确认ack，第三次挥手时，服务器已准备好关闭连接，发送FIN，第四次挥手发来客户端的ack，此时双方都可断开连接
~~~



HTTPS原理及过程

~~~js
HTTP存在信息传输不安全的缺陷，明文传输，容易被截获、篡改、冒充
HTTPS在HTTP和TCP之间加了一层加密操作，SSL
同时采用对称和非对称加密
	数据-》对称加密  客户端需要一个密钥解密
	密钥-》非对称加密

过程：
客户端HTTPS请求443端口
服务器响应，将公钥发给客户端
客户端收到公钥，即SSL证书，并对其验证，通过后，客户端生成对称加密的密钥（客户端密钥），用公钥非对称加密

客户端发起第二次HTTP请求，将客户端密钥发给服务器
服务器收到客户端密钥后，用私钥进行非对称解密，拿到客户端密钥，然后用客户端密钥对数据进行对称加密
服务器将加密过的数据发送给客户端
客户端接收到密文数据，用客户端密钥进行对称解密，客户端拿到数据
~~~

报文

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



get、post

~~~js
get退回无害，post退回重新提交
get参数放在url里，长度有限（浏览器原因），post放在请求体里，无限

实际上他们本质上没有区别
在HTTP请求的报文中，有一个字段用来表示请求方法，而报文的格式是相同的
之所以有这样的区别，是为了语义化和不同场景的使用
get在后端请求可以添加请求体，post也可以在url添加信息

~~~



###### 注意

-  我们经常说get请求参数的大小存在限制，而post请求的参数大小是无限制的。 实际上HTTP协议从未规定GET/POST的请求长度限制是多少。对get请求参数的限制是来源与浏览器或web服务器，浏览器或web服务器限制了url的长度。为了明确这个概念，我们必须再次强调下面几点: · HTTP协议 未规定GET和POST的长度限制 · GET的最大长度显示是因为 浏览器和web服务器限制了URI的长度 · 不同的浏览器和WEB服务器，限制的最大长度不一样 · 要支持IE，则最大长度为2083byte，若只支持Chrome，则最大长度8182byte 

1. HTTP  HTTPs区别

   - url协议头不一样
   - https是加密的、安全的  需要证书
   - HTTP 80   https  443

2. 状态码

   - 301：永久性重定向
   - 302：临时重定向
   - 303：与302状态码有相似功能，只是它希望客户端在请求一个URI的时候，能通过GET方法重定向到另一个URI上
   - 304：发送附带条件的请求时，条件不满足时返回，与重定向无关
   - 400：请求报文语法有误，服务器无法识别
   - 401：请求需要认证
   - 403：请求的对应资源禁止被访问
   - 404：服务器无法找到对应资源

3. HTTP1.0  HTTP1.1 HTTP2

   - HTTP1.0：
   - HTTP1.1：
     - 支持长连接
     - 同一个TCP连接，可以发送多个请求（但是是串行）
   - HTTP2：
     - 二进制分帧：应用层传输层之间，加快传输效率，提高性能
     - 多路复用：通过一个TCP，双向数据流（双工），每个数据分为多帧发送，可乱序发送，通过帧首部标识组装
     - 首部压缩：HTTP1.x请求的状态行和相应的头部是没有压缩的，纯文本传输，HTTP2将其压缩后，节省在头部消耗的流量
  - 服务端推送：对于一个请求返回多个响应

   

### 16、事件模型

- 冒泡
- 捕获
- dom事件流,同时支持冒泡和捕获(addEventListener()第三个参数true捕获,false冒泡)

#### 不会冒泡的事件

`scroll` `blur` `focus`  `Media`  `mouseleave`  `mouseenter`  可以在事件捕获阶段委托(代理)

#### 注意

-  mouseover：当鼠标移入元素或其子元素都会触发事件，所以有一个重复触发，冒泡的过程。对应的移除事件是mouseout · mouseenter：当鼠标移除元素本身（不包含元素的子元素）会触发事件，也就是不会冒泡，对应的移除事件是mouseleave 

#### 事件代理

`target`实际触发事件的元素

`currentTarget`绑定事件的元素

~~~js
<ul id="ul">
        <li id="a">1</li>
        <li id="b">2</li>
        <li id="c">3</li>
        <li id="d">4</li>
    </ul>
    <script>
        document.getElementById('ul').addEventListener('click', clickcb)
        function clickcb(e) {
            var target = e.target
            var currentTarget = e.currentTarget
            console.log(target, currentTarget)
        }
    </script>
~~~



#### 发布订阅模式

~~~js
class Event {
            constructor() {
                this.eventObjs = {}
            }
            on(type, handler) {
                (this.eventObjs[type] || (this.eventObjs[type] = [])).push(handler)
            }
            off(type, handler) {
                if (arguments.length === 0) {
                    this.eventObjs = {}
                } else if (arguments.length === 1) {
                    this.eventObjs[type] = []
                } else if (arguments.length === 2) {
                    if (!this.eventObjs[type]) {
                        return
                    }
                    console.log(this.eventObjs[type])
                    this.eventObjs[type] = this.eventObjs[type].filter(item => {
                        return item !== handler
                    })
                    console.log(this.eventObjs[type])
                }
            }
            emit(type) {
                let args = [...arguments].slice(1)
                if (!this.eventObjs[type]) {
                    console.log('no ', type)
                    return
                }
                for (let i in this.eventObjs[type]) {
                    this.eventObjs[type][i].apply(null, args)
                }
            }
        }

        var event = new Event()
        function click() {
            console.log('click')
        }
        function click2() {
            console.log('click2')
        }
        event.on('click', click)
        event.on('click', click2)
        event.emit('click')
        event.off('click', click)
        event.emit('click')
~~~



### 17、深拷贝

### 18、XSS,csrf



~~~js
CSRF：跨站请求伪造
	原理：用户登录一个网站后会拿到当前Cookie，此时用户在不退出登录的情况下访问另一个网站，这个网站向用户登陆的网站发送了请求，浏览器不能区分，就会带上Cookie向之前的网站发起请求，登陆网站接收请求开始操作，攻击成功
    防御：Token验证、请求头的Referer字段表示请求的源地址，服务端可验证该字段
~~~

~~~js
XSS：跨域脚本攻击
	原理：向网页注入js代码
    防御：Cookie设置为HTTP only、过滤用户输入
~~~



### 19、树形组件

~~~vue
// 1、数据结构 list数组表示一层级的每一项,children表示子项
// 2、组件递归调用自身,形成树形结构
// 3、组件中控制子级高度来展开、关闭子级
<template>
	<div>
        // 普通项图标和目录项图标
        // 目录项点击展开下级 通过控制open字段,显示和隐藏子级
        <span v-if="isFlider" @click="fliderClick"></span>
        <span v-else></span>
    </div>
	// 如果是目录项,有子级
	<div v-if="isFlider">
        // open控制样式,切换子级显示
        <div class="{open: open}">
        // 递归调用tree组件, 通过children属性循环生成
        <tree v-for="item in list.children"
              :list="item"></tree>
        </div>
    </div>
</template>
~~~

### 20、比较版本号

两版本号以"."分割为数组,分别如队列,依次比较

### 21、nextTick

在下次DOM更新循环结束之后回调, 获取数据更新后的DOM

使用时机:

- `created()`阶段的DOM操作

  此阶段dom并未渲染,不能进行dom操作

- 当希望在操作更改数据之后的DOM时

原理

~~~js
callbacks = []	//此数组用于存放传入的回调函数
// 生成异步函数
let microTimerFunc
let macroTimerFunc
nextTick(cb, ctx) {
    // 将传入的回调和上下文包装后放入callbacks
    callbacks.push(() => {
        cb.call(ctx)
    })
    // 调用异步函数
    microTimerFunc()
    // 异步函数调用flushCallbacks()清空callBacks
    // flushCallbacks()遍历callBacks,执行其中函数
}

// 使用nextTicks而不是在nextTick()中直接执行回调,是因为这样可以将所有的异步操作一次执行完毕,而不会多次执行异步任务,将多个异步任务变成一个同步任务,在下一个tick内执行
~~~

### 22、**typeof** **和** **instanceof** 

~~~js
typeof
    返回字符串，表示对象的类型，一般只有以下结果number, boolean, string, function, object, undefined

instanceof
    判断对象是否是某类型实例，返回Boolean
	原型链向上查找
    function myInstanceof(obj, Cotr) {
        if (typeof obj !== 'object' || obj === null) {
            return false
        }
        let proto = Object.getProrotypeOf(obj)
        while(true) {
            if (proto === null) {
                return false
            }
            if (proto === Cotr.protrtype) {
                return true
            }
            else {
                proto = _Object.getProrotypeOf(proto)
            }
        }
    }
~~~



### 23、路由

~~~
hash
	当hash改变时，触发hashChange事件
	
history
	H5中新的pushState、replaceState方法进行路由控制
~~~



### 24、数据结构与算法

1. 数组扁平化
2. 数组去重

### 25、webpack

###### 组成

1. **entry**：入口文件，依赖关系的根，需要多个入口文件的时候，写成一个对象

2. **output**：只能有一个输出

3. **loader**：实现对不同格式文件的处理---转换文件，使其能够添加到依赖图中

   ​				使用module进行配置---用正则表示要匹配的文件，用数组表示要使用的loader

   ​				常用：css、url、file、vue、babel

4. **plugins**： **plugins并不是直接操作单个文件，**它直接对整个构建过程起作用 

   ​					HtmlWebpackPlugin ：生成自动引用打包后js的html

   ​					

###### 原理

 （1）初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数； 

 （2）开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译； 

 （3）确定入口：根据配置中的 entry 找出所有的入口文件； 

 （4）编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理； 

 （5）完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系； 

 （6）输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会； 

 （7）输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。 

 （8）在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

###### 热跟新

热更新又称热替换（Hot Module Replacement），缩写为 `HMR`，基于 `webpack-dev-server`。
 当你对代码修改并保存后，将会对代码进行重新打包，并将改动的模块发送到浏览器端，浏览器用新的模块替换掉旧的模块，去实现局部更新页面而非整体刷新页面。

###### 优化

- 开发（构建速度）
  - 缩小文件搜索范围
  - 多进程打包
- 线上
  - 区分环境
  - 代码压缩
  - 静态资源压缩
  - CDN加速
  - 去掉不会执行的js代码
  - 提取公共代码
  - 按需加载（代码分割）

### vue

- 优点：轻量化，关注视图层，大小几十K
- v-if/v-show：v-show通过CSS样式，v-if删除或添加DOM，消耗性能
- key：虚拟节点唯一标识，diff算法更高效更新虚拟DOM

###### AST、vNode

​	模板语法   ->   AST(js对象，处理指令)   ->   h()   ->   vNode(diff等处理)    ->   html

###### 路由

- 动态路由传参
  - 路径后:id   id可以在 `$route.params.id` 取得
  - router-link :to="{ url, query: {name: ''} }"    同样方式获取

- 路由钩子
  - 全局前置：`router.beforeEach()`
  - 全局解析： `router.beforeResolve ()`
  - 全局后置：`router.afterEach()`
  - 路由独享：路由配置上直接定义`beforeEnter()`
  - 组件内：
    - `beforeRouteEnter()`不能访问this，可以在next()中访问vm
    - `beforeRouteUpdate` (2.2 新增)之后都可以访问this
    - `beforeRouteLeave`

###### 生命周期

-----   父beforeCreate   -----   父created   -----   父beforeMounted

-----   子beforeCreate   -----   子created   -----   子beforeMounted    ------ 子mounted

-----   父mounted

子组件更新时

-----   父beforeUpdate

-----   子beforeUpdate   -----    子updated

-----   父updated

父组件更新时

-----    父beforeUpdated   -----    父updated

销毁时

-----   父beforeDestroy

-----   子beforeDestroy   -----   子destroyed

-----   父destroyed

- active：只有在keep-alive下的组件可以使用，当组件重新激活时

###### 响应式

- 响应式对象
  - `Object.defineProperty`
  - `Observer`类给对象的属性添加getter、setter，用于依赖收集、派发更新
  - `observe`方法通过传入的对象实例化Observer
  - `defineReactive`方法定义响应式对象

- 依赖收集

  - 在getter中dep.depend()做依赖收集

  - `Dep`类

    - 有属性`target`，代表全局唯一`Watcher`
    - `subs`数组保存`Wacther`

  - `Watcher`类

    - 在Watcher的构造函数中，会执行get()，get()中会执行`pushTarget`

      方法，该方法将当前Watcher赋值给Dep.target，此时正在使用的Watcher就成了全局唯一Watcher

      接着会执行传入的`expOrFn`，也就是Watcher的getter方法，此时会访问到其中的数据，如果该数据是响应式对象，那么在重写的get属性中会调用`dep.depend()`，其中又会调`Dep.target.addDep()`，又会调用`dep.addSub()`，如此一来就会将当前`Watcher`添加到订阅这个数据所持有的`subs`数组中

- 派发更新

  - 当对响应式对象的属性进行修改时，会触发其`setter`，调用`dep.notify()`,会遍历`subs`数组，然后调用每一个`Watcher`的`update()` 方法
  - `update()`中一般情况下会触发`queueWatcher()`，将所有`Watcher`放到队列里，通过`nextTick`异步执行所有`Watcher`的回调，即`run()`方法

- 计算属性
  - Vue实例初始化阶段，执行initComputed()，遍历每个属性，得到其回调或配置的get属性，为每一个`getter`即属性实例化一个`Watcher`，这是特殊的 `computed watcher` 
  - 然后调用 `defineComputed` ，为属性设置`getter`和`setter`（配置setter的情况下才有setter）
  - `computed watcher` ：其不会立刻求值，当访问到属性时，会触发`getter`，会得到计算属性的`watcher`，然后执行`watcher.depend()`，就是其`dep`的`depend`，将计算属性添加到此时的全局唯一watcher中
  - 然后执行计算属性的回调，由于回调中有响应式对象，会将响应式对象的dep也添加到此时的全局唯一watcher中
  - 当依赖的对象发生变化时，会触发改变对象的setter，dep.notify()会通知所有订阅的watcher触发`update()`，如果这个计算属性被使用过，

- 监听属性：也是通过Watcher，将配置的监听属性的回调作为watcher的回调，当属性变化时，setter等一列调用会执行其回调

### 闭包

#### 概念

**闭包函数：**声明在一个函数中的函数，叫做闭包函数。

**闭包：**内部函数总是可以访问其所在的外部函数中声明的参数和变量，即使在其外部函数被返回（寿命终结）了之后。

#### 特点

 让外部访问函数内部变量成为可能；

 局部变量会常驻在内存中；

 可以避免使用全局变量，防止全局变量污染；

 会造成内存泄漏（有一块内存空间被长期占用，而不被释放）

闭包就是可以创建一个独立的环境，每个闭包里面的环境都是独立的，互不干扰。闭包会发生内存泄漏，***\*每次外部函数执行的时 候，外部函数的引用地址不同，都会重新创建一个新的地址。\****但凡是当前活动对象中有被内部子集引用的数据，那么这个时候，这个数据不删除，保留一根指针给内部活动对象。



### import require

- 规范
  - require AMD
  - import  es6语法
- 调用时机
  - require：运行时调用
  - import：编译时调用，文件头部
- 本质
  - require：赋值过程，其结果就是对象数字等，将值赋给某个变量，多次引用的是同一个对象
  - import：结构过程，引入export命令指定输出的代码

### 继承

- 原型链继承
  - 让新实例的原型指向父类实例
  - 原型上的属性是共享的，一个实例修改原型上的属性，其他实例也会被修改
  - 无法给父类构造函数传参
- 借用构造函数
  - 子类的构造方法中通过call借用父类构造函数
  - 只继承了构造函数的属性，没有继承原型上的属性
  - 可以调用多个父类的构造函数实现多继承
  - 每个实例都有父类构造函数的副本，臃肿
- 组合继承
  - 两次调用父类构造函数

~~~js
原型链继承
	子类构造函数原型指向父类实例，会顺着原型链找到父类属性
    缺：继承单一、父类构造函数无法传参、父类属性共享
    
借用构造函数
	使用call、apply改变this指向，得到父类构造函数的逻辑
    缺：只能使用构造函数的属性、每个子类都有父类构造函数
    
组合继承
	两种继承同时使用
    缺：调用了两次父类构造函数
    
原型式继承
	用一个函数包装一个对象，接受一个参数，将对象原型指向参数，返回对象实例
    缺：对参数进行了浅复制，修改一次，影响所有
    
    
寄生式继承
	原型式继承套壳


寄生组合式继承
	function extend(Sub, Super) {
        // 新实例
        function F() {}
        // F指向父类
        F.prototype = Super.prototype
        // 得到父类实例
        Sub.prototype = new F()
        // 修正构造函数
        Sub.prototype.constructor = Sub
    }

    
~~~



### 数组和字符串方法

###### 数组

- toString()：将数组输出为逗号隔开的字符串
- join()：通过传入的参数将数组组合为字符转
- pop()：从数组中删除最后一个元素，返回该元素
- push()：在结尾添加元素
- shift()：删除首元素并返回
- unshift()：在首部添加元素，返回新数组长度
- splice()：在指定位置删除或添加元素，改变原数组
- concat()：合并数组并返回新数组，不会改变原数组
- slice()：返回对应下标和长度的新数组

###### 字符串

- indexOf()：返回指定文本首次出现的位置
- lastIndexOf()：最后一次出现的位置
- search()：
- slice()：
- replace()：用第二个参数替换第一个参数，返回新数组，不改变原数组
- concat()：
- trim()：删除两端空白符
- split()：根据指定参数分割为数组



### 页面性能优化

~~~
资源压缩
	html、css、js

脚本异步加载
	async、defer
	
浏览器缓存

CND加速
~~~

### CDN

~~~
原理：
	1.通过DNS解析，找到全局负载均衡的服务器IP给用户
	2.用户通过Ip建立连接拿到资源
有一个智能调度DNS服务器，
~~~

