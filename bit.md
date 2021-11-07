### 扫码登陆、单点登录

### 输入url到展示过程

~~~
1、输入网址
2、DNS解析
3、建立tcp连接
4、客户端发送HTPP请求
5、服务器处理请求　
6、服务器响应请求
7、浏览器展示HTML
8、浏览器发送请求获取其他在HTML中的资源。
~~~



### DNS过程

~~~
1-主机向本地域名服务器发起递归查询
2-本地域名服务器向根域名服务器进行迭代查询
3-根域名服务器告诉本地域名服务器下一次要查询的顶级域名服务器的IP
4-本地域名服务器向顶级域名服务器查询
5-顶级域名服务器下一次要请求的权限域名服务器的IP
6-本地域名服务器向权限域名服务器查询
7-权限域名服务器告诉本地域名服务器要查询的域名的IP
8-本地域名服务器告诉主机要查询的IP

高速缓存会缓存之前的结果，直接返回结果
~~~



### 进程线程、进程间通信

### 哪些资源需要缓存

### IntersectionObserver







### 括号匹配

~~~js
var str = '({}[](){{})'
        var stack = []
        for (let i = 0 ; i < str.length; i++) {
            if (stack.length && check(stack[stack.length-1], str.charAt(i))) {
                stack.pop()
            }
            else {
                stack.push(str.charAt(i))
            }
        }
        if (stack.length) {
            console.log(false)
        }
        else {
            console.log(true)
        }
        function check(a, b) {
            var c = ['()','[]', '{}']
            if (c.indexOf(a+b) > -1) {
                return true
            }
            return false
        }
~~~



### 矩阵旋转

### 异步控制队列

### 解析URL参数

### 同步Promise

~~~js

~~~



### 缓存请求

### 链表判环

### 123123234.123 -> 123,123,234.123 

### 实现一个函数，把一个字符串数组（['zm', 'za', 'b', 'lm', 'ln', 'k']）格式化成一个对象 { 'b': ['b'], 'k': ['k'], 'l': ['lm', 'ln'], 'z': ['za', 'zm'] } 

### 寄生组合式继承

### 实现方法

~~~js
// 需要实现的函数
function repeat (func, times, wait) {}，

// 使下面调用代码能正常工作
const repeatFunc = repeat(console.log, 4, 3000);
repeatFunc("hello world");//会输出4次 hello world, 每次间隔3秒
~~~

###  判断一个字符串最多只删1个字符，是否能成为一个回文字符串 

