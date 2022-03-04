js模块有IIF CJS（commonjs） AMD UMD ES6

什么是模块：一个局部作用域，内部定义一些变量和方法，提供接口供外部使用

#### IIFE
Immediately Ivoked Function Expression
立即执行函数，一般用一个自执行匿名函数


#### commonjs
nodejs采用的模块化标准
用require引入模块，接收路径或模块名，路径时到路径下引入，模块名则到node_modules中寻找对应模块
使用module.exports=或export.xxx=来导出，实际上导出的是exports这个对象
**特点**
- 在node环境运行
- require导入的是值的拷贝
- require是同步加载


#### AMD RequireJS
全称Asynchronous Module Definition异步模块定义，与commonjs不同AMD是完全针对浏览器的模块化定义，AMD加载模块是异步的
主要用于浏览器


#### ES6 module
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量
ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高
通过export命令导出，import命令导入
import和export命令只能在模块的顶层，不能在代码块之中（比如，在if代码块之中，或在函数之中），这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果import命令要取代 Node 的require方法，这就形成了一个障碍。因为require是运行时加载模块，import命令无法取代require的动态加载功能。

ES2020提案 引入import()函数，支持动态加载模块
import()返回一个 Promise 对象
import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载
**import()** 的使用场合
- 按需加载
import()可以在需要的时候，再加载某个模块
- 条件加载
import()可以放在if代码块，根据不同的情况，加载不同的模块
- 动态的模块路径
import()允许模块路径动态生成

注意点
- import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口
- 如果模块有default输出接口，可以用参数直接获得
- 如果想同时加载多个模块，可以使用Promise.all
- import()也可以用在 async 函数之中


#### UMD
实际上就是 amd + commonjs + 全局变量 这三种风格的结合
这段代码就是对当前运行环境的判断，如果是 Node 环境 就是使用 CommonJs 规范， 如果不是就判断是否为 AMD 环境， 最后导出全局变量
有了 UMD 后我们的代码和同时运行在 Node 和 浏览器上
所以现在前端大多数的库最后打包都使用的是 UMD 规范



[参考](https://zhuanlan.zhihu.com/p/33843378)