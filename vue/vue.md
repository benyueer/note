### 挂载

~~~js
new Vue()	
    ->	init	// src/core/instance/index.js
    ->	$mount	// src/platform/web/entry-runtime-with-compiler.js
				// src/platform/web/runtime/index.js(原型)
    ->	compile
    ->	render
    ->	vnode
	->	patch
	->	DOM
~~~

#### init

~~~js
// 合并配置，初始化生命周期、初始化事件、初始化渲染、初始化data-props-计算属性-监听属性、provide-inject等   执行到created，然后vm.$mount(vm.$options.el)
initMixin(Vue)

// 将$data、$props挂到原型上、添加$set、$del方法
stateMixin(Vue)

// 事件初始化，$on\$off\$once\$emit定义
eventsMixin(Vue)

// _update方法、$forceUpdate、$destory等方法定义，在特定时候执行生命周期方法
lifecycleMixin(Vue)

// $nextTick、_render方法定义
renderMixin(Vue)
~~~

#### $mount

~~~js
// 多处都有定义
// 接收两个参数el，和服务端渲染
// 限制el不能是dom根节点
// 如果用户没有定义render方法，则将template模板生成render
// 调用原型上的mount，原型上的mount会调用
mountComponent(this, el) // 定义在src/core/instance/lifecycle.js

// 在此时，调用beforMount
// 生成updateComponent方法，然后生成渲染Watcher，调用updateComponent
// updateComponentd调用
_update(vm._render())
// 之后将_isMounted=true，调用mounted

_render() // 把实例生成虚VNode，src/core/instance/render.js
// 调用用户的render(),如果没有，会调用mount()中的使用template生成的render
// render的参数是
createElement() // 创建VNode，src/core/vdom/create-element.js
// 参数：上下文(实例)、标签名、data、子元素、、
// 其中调用了_createElement
// 他会调用createComponent创建VNode

// 生成render时，通过parse()将templete转为AST，通过AST拿到render，此时render是with(this)执行的代码块，返回值就是经过vue定义的一系列解释器处理for循环、IF、slot、children、once事件后的通过createElement()得到的VNode


// 
// 得到VNode后，_update得以继续
_update() // 将VNode渲染为DOM，src/core/instance/lifecycle.js
// 其中调用
vm.__patch__(old, new)  // src/platforms/web/runtime/index.js
// __patch__指向
patch() // src/platforms/web/runtime/patch.js
// 调用createPatchFunction()得到patch()
// 


~~~

### 组件化

 把页面拆分成多个组件 (component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间可以嵌套 

#### createComponent

~~~js
createElement() // 如果检测到tag是组件而不是普通的HTML标签名，将会调用
createComponent() // 他会创建一个组件VNode  src/core/vdom/create-component.js

构造子类构造函数
安装组件钩子函数
实例化VNode


~~~

#### patch

得到VNode后会执行_update(VNode)，patch(old, new)，生成真实的DOM节点，

~~~js
// patch过程会调用
createElm
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 


~~~

### 响应式

#### 响应式对象

##### defineReactive

~~~js
// 使用Object.defineProperty修改get和set，不能建用IE8
// 在initState时响应化对象

// 调用
defineReactive
// 把对象变成响应式

~~~

##### observe-监测数据的变化

~~~js
defineReactive
// 调用
observe
// 他会给对象包装Observer
~~~

##### Observer-将自身作为`__ob__`添加到对象上，然后响应化每个属性







#### 依赖收集

在getter中进行依赖收集

~~~js
// new一个Dep
// 如果存在Dep.target,即全局唯一Watcher，就将其加入dep
dep.depnd()
~~~

##### Dep

其有一个静态属性`target`，用来保存全局唯一Watcher

其属性`subs`也是Watcher数组

##### Watcher



##### 过程

在`$mount()`执行时，会生成渲染Watcher，执行其构造函数逻辑，执行到this.get()

调用pushTarget(this)，将此Watcher赋值给Dep.target

在get()中又执行了getter()

就是执行了设置的回调

此时的回调是mountComponent，会执行render，在此过程中会访问模板中的变量

这时就触发了对应变量的getter

每个对象值的getter都有一个dep实例，会执行dep.depend

实际上执行了Dep.target.addDep(this)，将对应的Dep和Watcher实例分别存入对方的属性中



#### 派发更新

修改数据会触发setter

会执行dep.notify()，通知所有订阅者

notify会遍历依赖收集到的所有Watcher，执行他们的update

update会执行queueWatcher，他会将Watcher添加到队列里

在nextTick后执行flushSchedulerQueue

遍历队列，执行watcher.run()

过程中会执行watcher的get()，得到新值后，如果新旧值不相等、新值为对象、deep，就会执行回调

而渲染Watcher，他的get就是mountComponent，会重新render

### keeop-alive

~~~
是一个组件
他有cache属性和key数组
同时实现了一个render函数，在render时，先生成vnode，然后判断子元素是需要缓存的元素
如果是而且缓存中有该vnode
就就使用缓存的vnode
否则通过key将vnode缓存起来，并将key移到数组最后
~~~

### Tips

- 当watch监听的是对象时，修改对象的属性，是获取不到oldValue的，详情如下：
    ```js
    import { defineComponent, onMounted, reactive, watch } from "vue";
    import _ from "lodash";

    export default defineComponent({
    setup() {
        const state = reactive({
        data: {
            name: '123'
        }
        })
        watch(
        () => state.data,
        (val, old) => {
            console.log(_.isEqual(val, old))
            console.log(val, old)
        },
        { deep: true }
        ),
        onMounted(() => {
        setTimeout(() => {
            state.data = {name: '123213'} // 这种方式会获取到oldValue
            state.data.name = '123213' // 这种方式不会获取到oldValue，因为这里是直接修改对象的属性，引用数据类型都指向同一个对象
        }, 2000)
        })
    },
    })


    /**
     * vue的Watch的run方法
     */
    run () {
        const value = this.get()
        const oldValue = this.value
        this.value = value
        this.cb.call(this.vm, value, oldValue)
    }

    // 在例子中，我们监听的是 state.data， 那么在Watch的value就是state.data,当我们修改state.data的属性时，Watch的this.value指向相同，会被同时修改。
    // 即：this.value -> state.data -> {name: '123'}
    // oldValue -> state.data -> {name: '123'}
    // value -> state.data -> {name: '123213'}
    // this.value value oldValue都指向同一块内存，也就获取不到oldValue了

    // 但当我们执行state.data = {name: '123123'}时，value指向了新对象{name: '123123'}, this.value还指向state.data，oldValue由this.value赋值而来，那么this.value和oldValue都指向修改前的state.data，value指向修改后的state.value，因此可以获取到oldValue
    ```


### 计算属性惰性求值
`computed`在定义时设置`lazy=true`
```js
const computedWatcherOptions = { lazy: true }

watchers[key] = new Watcher(
  vm,
  getter || noop,
  noop,
  computedWatcherOptions
)
```
当`lazy`为`true`时，`Watcher`是不会求值的
```js
this.value = this.lazy
      ? undefined
      : this.get()
```
同时由于没有执行过`get`方法，也就没有进行依赖收集，如果定义的计算属性没有在任何地方使用过，就算依赖项改变，也不会触发计算
当读取计算属性值时会触发`getter`,执行`get`方法，并将结果赋值给`value`，同时会进行依赖收集

#### 计算属性的定义过程
1. 首先`initState`,如果配置项中有`computed`配置，则执行`initComputed`方法
  ```js
  export function initState (vm: Component) {
    ......
    if (opts.computed) initComputed(vm, opts.computed)
    ......
  }
  ```
2. `initComputed`方法会为每一个计算属性生成一个`Watcher`，并将其放入`vm._computedWatchers`中
   计算属性`Watcher`比较特殊，`lazy=true`,不会立即求值
  ```js
  function initComputed (vm: Component, computed: Object) {
    const watchers = vm._computedWatchers = Object.create(null)
    for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    if (!isSSR) {
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
  ```
3. `defineComputed`方法会在`vm`上注册对应计算属性值的属性，会为其设置对应的getter和setter方法
   ```js
  export function defineComputed (
    target: any,
    key: string,
    userDef: Object | Function
  ) {
    const shouldCache = !isServerRendering()
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef)
      sharedPropertyDefinition.set = noop
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop
      sharedPropertyDefinition.set = userDef.set || noop
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
  }
   ```
4. `getter`方法分为是否服务端渲染两种情况，`setter`方法则是直接设置用户传入的值，未传入则为空
   1. 服务端渲染
      此时直接执行计算属性的回调拿到结果即可
      ```js
      function createGetterInvoker(fn) {
        return function computedGetter () {
          return fn.call(this, this)
        }
      }
      ```
   2. 非服务端渲染
      此时需要从`Watcher`中获取值
      找到对应的`Watcher`，并执行求值
      ```js
      function createComputedGetter (key) {
        return function computedGetter () {
          const watcher = this._computedWatchers && this._computedWatchers[key]
          if (watcher) {
            if (watcher.dirty) {
              watcher.evaluate()
            }
            if (Dep.target) {
              watcher.depend()
            }
            return watcher.value
          }
        }
      }
      ```
      <!-- todo -->
      if (Dep.target) {
              watcher.depend()
            }的作用

