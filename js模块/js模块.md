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
- require是同步加载,根据在代码中出现的顺序依次加载
- **模块可以多次加载，但只会在第一次加载时执行一次，然后运行结果就被缓存了，以后就直接读取缓存结果，要想重新加载就要先清除缓存**

⚠️：CommonJs加载的是一个对象（即module.exports属性），该对象只有在脚本运行结束才会生成

##### 加载原理
CommonJS的一个模块就是一个脚本文件，`require`命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
即使再次执行`require`命令，也不会再次执行该脚本，而是到缓存中取值。

##### require的内部逻辑
当node遇到`require(x)`时，按照下面的顺序处理：
1. 如果`x`是内置模块，如`require('fs')`，则直接返回该模块
2. 如果`x`以`'./`,`'../'`开头
   1. 根据`x`的父模块，确定x的绝对路径
   2. 将x作为文件，一次查找以下文件，只要有一个存在，就返回该文件，不再继续执行
       | .x |
       | - |
       |.x.js|
       |.x.json|
       |.x.node|
   3. 将x当成目录，依次查找以下文件，只要有一个存在，就返回该文件，不再向下执行
      |.x/package.json(main字段)|
      |-|
      |.x/index.js|
      |.x/index.json|
      |.x/index.node|
   4. 如果没有找到，抛出错误
3. 如果x不带路径
   1. 根据x所在父模块，确定x所在目录
   2. 依次在可能的目录中将x作为文件名或目录名加载 

##### 细节
1. 循环引入
   ```js
    // a.js
    console.log('a');
    exports.down = false
    const b = require('./b');
    console.log('in a, b.down=', b.down);
    exports.down = true
    console.log('a end')
    
    // b.js
    console.log('b');
    exports.down = false
    const a = require('./a');
    console.log('in b, a.down=', a.down);
    exports.down = true
    console.log('b end');


    // 输出：
    // a
    // b
    // in b, a.down=false
    // b end
    // in a, b.down=true
    // a end
   ```
   当在a中引入b模块时，就会执行b脚本，b的down先为false后为true，当a拿到b的down时，已经为true；当在b中引入a模块时，a模块已被加载，就会从缓存中拿到当前的a，此时a还未执行完毕，其中的down还是false



#### AMD RequireJS
全称Asynchronous Module Definition异步模块定义，与commonjs不同AMD是完全针对浏览器的模块化定义，AMD加载模块是异步的
主要用于浏览器


#### ES6 module
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量
ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高
通过export命令导出，import命令导入
import和export命令只能在模块的顶层，不能在代码块之中（比如，在if代码块之中，或在函数之中），这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果import命令要取代 Node 的require方法，这就形成了一个障碍。因为require是运行时加载模块，import命令无法取代require的动态加载功能。

⚠️：ESM的对外接口是一个静态定义，在代码静态解析阶段就会生成
ESM自动使用严格模式，即使你没有使用`'use strict'`，顶层`this`也是`undefined`

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

特性：
1. `import`优先执行
   `import`命令会被js引擎静态分析，优先于模块内其他内容执行
   ```js
    // a.js
    console.log('a.js')
    import {foo} from './b.js'


    // b.js
    export let foo = 1
    console.log('b.js')

    // 执行结果：
    // b.js
    // a.js
   ```
2. `export`变量声明提升
    ```js
    // a.js
    import {foo} from './b'
    console.log('a.js')
    export const bar = 1
    export const bar2 = () => {
      console.log('bar2')
    }
    export function bar3() {
      console.log('bar3')
    }


    // b.js
    export const foo = 1
    import * as a from './a'
    console.log(a)

    // 执行结果：
    // {bar: undefined, bar2: undefined, bar3: function}

    ```

3. 模块不会重复执行
    ```js
    // a.js
    import './b'
    import './b'

    // b.js
    console.log('b')

    // 执行结果：
    // b  // 执行一次
    ```


##### 细节
1. ESM编译时执行会导致以下两个特点：
   1. `import`命令会被JS引擎静态分析，优先于模块内的其他部分执行
   2. `export`会有变量声明提前的效果
      ```js
        // a.js
        console.log('a.js');
        import { foo } from './b.js';


        // b.js
        export let foo = 1
        console.log('b.js');
      ```
      该代码的输出为：
      ```js
        b.js
        a.js
      ```
      这是因为，虽然a中`import`晚于`console`,但通过JS引擎的静态分析，提前到a模块的最前面，优先于其他部分先执行

2. 循环依赖与`export`提升
   ```js
    // a.js
    import {foo} from './b.js';
    console.log('a.js')
    export const bar = 1
    export bar2 = () => {
      console.log('bar2')
    }
    export function bar3() {
      console.log('bar3')
    }

    // b.js
    export let foo = 1
    import * as a from './a.js'
    console.log(a)
   ```
    输出为：
    ```js
      { bar: undefined, bar2: undefined, bar3: [Function: bar3] }
      'a.js'
    ```
    从例子中可以看出，a模块引用了b模块，b模块又引用了a模块，`export`声明的变量也是优于模块的其他内容优先执行的，具体变量的赋值要等到执行相应代码的时候，例子中的函数声明和函数表达式的区别也是在代码解析的过程中产生的。

    ```js
      // a.js
      console.log('a')
      import {foo} from './b.js'
      console.log('in a, foo is', foo)
      export const bar = 1
      console.log('a end')

      // b.js
      console.log('b')
      export let foo = 1
      import {bar} from './a.js'
      console.log('in b, bar is', bar)
      setTimeout(() => {
        console.log('in b, bar is', bar)
      }, 1000)
      console.log('b end')

      // 输出为：
      // b
      // in b, bar is undefined
      // b end
      // a
      // in a, foo is 1
      // a end
      // in b, bar is 1
    ```


#### UMD
实际上就是 amd + commonjs + 全局变量 这三种风格的结合
这段代码就是对当前运行环境的判断，如果是 Node 环境 就是使用 CommonJs 规范， 如果不是就判断是否为 AMD 环境， 最后导出全局变量
有了 UMD 后我们的代码和同时运行在 Node 和 浏览器上
所以现在前端大多数的库最后打包都使用的是 UMD 规范



[参考1](https://zhuanlan.zhihu.com/p/33843378)
[参考2](https://juejin.cn/post/6844904093933109261)
[参考3](https://www.cnblogs.com/chenshufang/p/9927543.html)