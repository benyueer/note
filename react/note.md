#### 函数式组件与类组件
**纯函数**：相同的输入，总是会的到相同的输出，并且在执行过程中没有任何副作用。
1. 函数组件
  在hooks出现之前，react中的函数组件通常只考虑负责UI的渲染，没有自身的状态没有业务逻辑代码，是一个纯函数。
  但是这种函数组件一旦我们需要给组件加状态，那就只能将组件重写为类组件，因为函数组件没有实例，没有生命周期。所以我们说在hook之前的函数组件和类组件最大的区别又是**状态**的有无。
2. hooks
  hooks为函数组件提供了状态，也支持在函数组件中进行数据获取、订阅事件解绑事件等等

3. 区别
  状态同步问题，函数组件会捕获当前渲染时所用的值，而类组件不会。[参考1](https://juejin.cn/post/6844904049146331150)
  不论是函数式组件还是类组件，只要状态或者props发生变化了那就会重新渲染，而且对于没有进行过性能优化的子组件来说，只要父组件重新渲染了，子组件就会重新渲染。而且在react中**props是不可变的，而this是一直在改变的**。所以类组件中的方法可以获取到最新的实例即this，而函数组件在渲染的时候因为**闭包**的原因捕获了渲染时的值，所以该例子会出现这种现象。

[参考](https://zhuanlan.zhihu.com/p/208551225)

#### 生命周期

#### context

#### 高阶组件

#### ref  forwordRef

#### hooks
- useEffect
  `useEffect`钩子相当于生命周期方法`componentDidMount`、`componentDidUpdate`和`componentWillUnmount`的组合
  `useEffect()`的作用就是指定一个副效应函数，组件每渲染一次，该函数就自动执行一次。组件首次在网页 DOM 加载后，副效应函数也会执行。
  `useEffect()`的第一个参数就是他要完成的“副作用”， 第二个参数可选，是一个存储依赖关系的数组
  - 第一个参数
    第一个参数称为`effect`，是一个函数，它要么返回一个函数(称为`cleanup`)，要么返回`undefined`。`effect`在组件被挂载时(第一次渲染时)被执行，在后续的更新中是否被执行由作为第二个参数传递的依赖关系数组决定。
    `cleanup`在调用`effect`之前被执行(清理之前渲染的效果)
  - 第二个参数
    第二个参数称为`deps`，是一个数组，它的每一项都是一个依赖项，当这些依赖项发生变化时，`effect`才会被执行。
    React会比较依赖关系的当前值和之前渲染的值。如果它们不一样，就会调用`effect`。 这个参数是可选的。如果省略它，`effect`将在每次渲染后被执行。如果你想让`effect`只在第一次渲染时执行，你可以传递一个空数组。
    依赖关系可以是`stat`e或`props`。需要注意的是，如果要在`useEffect`内部使用任何定义在`useEffect`之外、且在组件内部的值，则必须将其作为依赖关系传递

- useLayoutEffect

- useReducer

- useContext

#### PureComponent
[参考1](https://zhuanlan.zhihu.com/p/379197285)
[参考2](https://juejin.cn/post/6844903480369512455)

首先需要知道 pure function是什么： 不依赖函数范围以外的变量而独自内部生存的函数
因此纯函数有两个特点：
1. 可以自己决定自己的结果，自力更生，如果输入值不变则一定会一直得出相同的结果。且它的输出结果一定要基于自己的输入参数。
2. 不产生任何其他效果(side-effects或mutation) - 例如改变任何外部的变量，console结果，写入文档，传递网络信息，任何异步操作。
优点：
1. 由于每次如果输入值不变一定会结果相同，重复运行函数时，Chrome V8 Engine会返回cached的结果，而不是重新运行一遍函数，大大提高了整个项目的运行速度。
2. 由于不产生任何额外效果，项目的结果更容易预测，也更容易测试。
**注意**：
- 一个不返回任何结果的函数也不是一个pure function
- 一个返回undefined的函数也不是一个pure function
- 一个不依赖于自己的输入参数的函数也不是一个pure function

##### PureComponent是什么
Pure Components是React Component的一种，它继承了Pure functions的特点与优点：

Pure Components(与pure functions相似)在props与state不改变时(在input不变时)不会重复渲染（会得出相同的结果）， 因此提高了运行速度。因此shouldComponentUpdate周期函数不再被需要，因为本身这个周期函数的原理就是对比现在和之前的props或者state是否发生改变从而判断是否重新渲染，Pure Component本身的特点代替了这个功能。
> **注意**：此时props与state的对比是浅比较（Shallow Compared）。因此Pure Components不能够使用嵌套式数据结构（nested data structure）
```js
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps)
  || !shallowEqual(inst.state, nextState);
}
```
而 `shallowEqual` 又做了什么呢？会比较 `Object.keys(state | props)` 的长度是否一致，每一个 `key`是否两者都有，并且是否是一个引用，也就是只比较了第一层的值，确实很浅，所以深层的嵌套数据是对比不出来的。
例子：
```js
class App extends PureComponent {
  state = {
    items: [1, 2, 3]
  }
  handleClick = () => {
    const { items } = this.state;
    items.pop();
    this.setState({ items });
    // 更改
    this.setState({ items: [...items] });
  }
  render() {
    return (< div>
      < ul>
        {this.state.items.map(i => < li key={i}>{i}< /li>)}
      < /ul>
      < button onClick={this.handleClick}>delete< /button>
    < /div>)
  }
}
```
在该组件中点击按钮视图时不会更新的，因为`state`的`items`一直都是同一个引用，`PureComponent`的`shallowEqual`只会比较第一层，会发现`state`没有改变，也就不会重新渲染。修改后items的引用改变了，会重新渲染

`PureComponent`真正起作用的，只是在一些纯展示组件上，复杂组件用了也没关系，反正`shallowEqual`那一关就过不了

##### pure functional component
React.memo可以使函数式组件实现PureComponent的特点 