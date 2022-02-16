## Scopes and Dirty-Checking

### Scopes Object

`Scopes`可以通过`new`操作符和`Scope`构造函数得到，返回的结果是一个普通的JavaScript对象。

创建以下文件和代码：

~~~js
test/scope_spec.js
'use strict';
var Scope = require('../src/scope');
describe('Scope', function() {
  it('can be constructed and used as an object', function() {
    var scope = new Scope();
    scope.aProperty = 1;
    expect(scope.aProperty).toBe(1);
  });
});
~~~

在代码开始部分，打开严格模式，然后引入`Scope`。测试部分创建了一个`Scope`并添加了一个任意的属性，然后检查是否添加成功。

此时运行代码会发现错误，因为我们还没有实现`Scope`。

我们可以创建改文件：

~~~js
src/scope.js
'use strict';
function Scope() { }
module.exports = Scope;
~~~

在测试用例中，我们在`Scope`中分配了一个属性，这个是一个普通的属性。神奇之处在于两个非常特殊的函数`$watch`和`$digest`，让我们把注意力转向他们。



### Watching Object Properties: $watch And $digest

`$watch`和`$digest`像是同一个硬币的两个面，他们共同构成了`digest-cycle`的核心：对数据变化的响应。

通过`$watch`你可以将一个被称为`watcher`的东西附加到`Scope`,`watcher`会在`Scope`发生变化时发出通知，你可以通过`$watch`创建一个`watcher`，他需要两个参数：

- 一个`watch`函数，指定你感兴趣的数据段
- 一个`listener`函数，在数据发生改变时被调用

对于`$digest`，他会遍历所有被触发的`watcher`，并运行其`watch`和`linstner`函数。

为了体现这些模块的细节，我们定义一个测试用例，他断言你可以使用`$watch`组册`watcher`，并且当`$digest`被调用时`watcher`的`listener`函数同时被调用。

为了便于管理，将测试添加到`scope_spec.js`中的`describe`块中，同时创建一个`beforeEach`函数来初始化`Scope`，这样在每次测试中就不用重复创建了。

```js
test/scope_spec.js
describe('Scope', function() {
  it('can be constructed and used as an object', function() {
    var scope = new Scope();
    scope.aProperty = 1;
    expect(scope.aProperty).toBe(1);
  });
  describe('digest', function() {
    var scope;
    beforeEach(function() {
      scope = new Scope();
    });
    it('calls the listener function of a watch on first $digest', function() {
      var watchFn = function() { return 'wat'; };
      var listenerFn = jasmine.createSpy();
      scope.$watch(watchFn, listenerFn);
      scope.$digest();
      expect(listenerFn).toHaveBeenCalled();
    });
  });
});
```

在测试用例中，我们调用`$watch`在`scope`上注册一个`watcher`，我们不关心监听方法，只提供一个常量。我们提供一个*Jasmine Spy*作为坚挺函数。然后调用`$digest`检查监听函数是否被正确调用。

为了让这个测试用例通过，我们得做一些事情。首先，`Scope`需要一个变量存放我们注册的`watcher`，我们可以在构造函数中添加一个数组：

```js
src/scope.js
function Scope() {
	this.$$watchers = [];
}
```

*双美元符表示该变量被视为框架的私有变量，不应该通过外部代码调用*

现在我们可以定义`$watch`函数，他将两个函数作为参数，并存储在`$$watcher`数组里，我们希望每个Scope实例都有这个属性，所以要将`$watch`添加到原型中：

```js

Scope.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn
  };
  this.$$watchers.push(watcher);
};
```

最后是`$digest`函数，现在只定义一个简单版本，只需要遍历所有已注册的观察者并调用其监听函数：

```js
src/scope.js
Scope.prototype.$digest = function() {
  _.forEach(this.$$watchers, function(watcher) {
  	watcher.listenerFn();
  });
};
```

测试通过了，但是`$digest`这个版本还是不是很有用，我们真正想要的是检查监听函数指定的值是否实际发生了改变，然后才调用相应的监听函数，这就是**脏检查**。





### Checking for Dirty Values

如上所述，观察者的观察函数应该返回变化数据。通常，这部分数据是Scope上存在的。为了访问scope更加方便，我们可以将其作为参数传递给监听函数。监听函数可以方便的获取scope的内容：

```js
function(scope) {
	return scope.firstName;
}
```

这是监听函数采用的一般形式：从scope中提取一些值并返回他们。

添加测试用例：

```js
test/scope_spec.js
it('calls the watch function with the scope as the argument', function() {
  var watchFn = jasmine.createSpy();
  var listenerFn = function() { };
  scope.$watch(watchFn, listenerFn);
  scope.$digest();
  expect(watchFn).toHaveBeenCalledWith(scope);
});
```

这次我们为watch函数创建了一个Spy，并使用它来检查watch调用。

使此测试通过的最简单方法是修改`$digest`以执行类似的操作：

```js
src/scope.js
Scope.prototype.$digest = function() {
  var self = this; 
  _.forEach(this.$$watchers, function(watcher) {
    watcher.watchFn(self);
    watcher.listenerFn();
  });
};
```

当然这并不是我们想要的，`$digest`的任务实际上是调用监听函数，并将其返回值与上次的返回值进行比较，如果值不同，则表示观察者为`dirty`，应该调用其监听函数。

测试用例：

```js
test/scope_spec.js
it('calls the listener function when the watched value changes', function() {
  scope.someValue = 'a';
  scope.counter = 0;
  scope.$watch(
    function(scope) { return scope.someValue; },
    function(newValue, oldValue, scope) { scope.counter++; }
  );
  expect(scope.counter).toBe(0);
  scope.$digest();
  expect(scope.counter).toBe(1);
  scope.$digest();
  expect(scope.counter).toBe(1);
  scope.someValue = 'b';
  expect(scope.counter).toBe(1);
  scope.$digest();
  expect(scope.counter).toBe(2);
});
```

我们首先在scope上添加两个属性：一个string和一个number。然后我们添加一个观察者，他会监视字符串，并在字符串改变时自增number。我们期望计数器在第一个`$digest`期间递增一次，如果值发生变化，则在随后的每个`$digest`期间递增一次。

请注意，我们同时声明了`listener`函数，他将scope作为参数，同时传入了观察者的旧值和新值。这使得我们更容易观察到变化。

要使他们正常工作，`$digest`必须记住每个监听函数最后的返回值，我们为每个观察者提供了一个对象，所以可以将这个值存在那里。下面是`$digest`的新定义，用于检查每个监听函数值的更改：

```js
src/scope.js
Scope.prototype.$digest = function() {
  var self = this;
  var newValue, oldValue;
  _.forEach(this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (newValue !== oldValue) {
      watcher.last = newValue;
      watcher.listenerFn(newValue, oldValue, self);
    }
  });
};
```

对于每个观察者，我们将观察函数的返回值与之前存储在`last`属性中的值进行比较。如果值不同，我们调用`listener`函数，将新值和旧值以及`scope`对象本身传递给它。最后，我们将观察者的`last`属性设置为新的返回值，以便下次能够与该值进行比较。

现在，我们已经实现了**Angular Scope**的本质：配置观察者并在`digest`中调用他们。

Angular Scope还有两个重要的性能特征：

- 将数据附加到scope本身不会对性能产生影响，如果没有观察者在观察某个属性，那么这个属性是否在scope上并不重要，Angular不会在Scope上迭代属性，而是在观察者上迭代相关属性。
- 在每个`$digest`期间会调用所有观察者的监听函数，所以要注意观察者的数量以及其监听函数的性能。





### Initializing Watch Values

将监听函数的返回值与last属性的值进行比较在大多数时候都能正常工作，但是在第一次执行`listener`时他会做什么呢？因为我们没有设置last属性，因此last是undefined，当被监听的值也是undefined时，这就不起作用了。这种情况下也会调用`listener`，因为我们当前的实现并不认为初始的undefined是一次改变：

```js
test/scope_spec.js
it('calls listener when watch value is first undefined', function() {
  scope.counter = 0;
  scope.$watch(
    function(scope) { return scope.someValue; },
    function(newValue, oldValue, scope) { scope.counter++; }
  );
  scope.$digest();
  expect(scope.counter).toBe(1);
});
```

初始化时`listener`也应当被正确的调用，我们要做的是将last属性初始化为可以保证唯一性的属性，这样他就不等于任何监听函数可能返回的值，包括undefined。

函数很适合这个目的，因为JavaScript中函数被认为仅与自身相等，在*scope.js*顶部引入一个函数：

~~~js
src/scope.js
function initWatchVal() { }
~~~

现在可以用该函数初始化观察者的last属性：

~~~js
src/scope.js
Scope.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn,
    last: initWatchVal
  };
	this.$$watchers.push(watcher);
};
~~~

这样无论观察者的监听函数返回什么值，都将正确调用他的`listener`函数。

不过，`initWatchVal`会被作为`oldValue`传递给`listener`， 我们不希望该函数被泄露到*scope.js*之外。对于新的观察者，我们应该使用新值代替其旧值：

```js
test/scope_spec.js
it('calls listener with new value as old value the first time', function() {
  scope.someValue = 123;
  var oldValueGiven;
  scope.$watch(
    function(scope) { return scope.someValue; },
    function(newValue, oldValue, scope) { oldValueGiven = oldValue; }
  );
  scope.$digest();
  expect(oldValueGiven).toBe(123);
});
```

在调用`$digest`时，在`listener`中，我们只需要检查oldValue是否为初始值，如果是，则替换他：

```js
src/scope.js
Scope.prototype.$digest = function() {
  var self = this;
  var newValue, oldValue;
  _.forEach(this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (newValue !== oldValue) {
      watcher.last = newValue;
      watcher.listenerFn(newValue,(oldValue === initWatchVal ? newValue : oldValue),self);
    }
  });
};

```





### Getting Notified Of Digests

定义一个没有listener的观察者：

```JS
test/scope_spec.js
it('may have watchers that omit the listener function', function() {
  var watchFn = jasmine.createSpy().and.returnValue('something');
  scope.$watch(watchFn);
  scope.$digest();
  expect(watchFn).toHaveBeenCalled();
});
```

在`$watch`稍加修改，使其支持空的listener：

```js
src/scope.js
Scope.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() { }, 
    last: initWatchVal
  };
  this.$$watchers.push(watcher);
};
```

在此模式下，即使没有listener函数，Angular仍将检查监听函数的返回值，如果返回一个值，则该值将接受脏检查，为了确保不会产生额外的工作，请不要返回任何内容，将停函数会返回undefined。



### Keeping The Digest Going While It Stays Dirty

核心已经存在，但我们还远远没有完成。例如，有一个典型场景我们还不支持：`listener`函数本身也可能更改scope的属性。如果发生这种情况，且另一个观察者读取了变化的属性，他可能不会在同一个`digest`周期中注意到值的变化：

```js
test/scope_spec.js
it('triggers chained watchers in the same digest', function() {
  scope.name = 'Jane';
  scope.$watch(
    function(scope) { return scope.nameUpper; },
    function(newValue, oldValue, scope) {
      if (newValue) {
        scope.initial = newValue.substring(0, 1) + '.';
      }
    }
  );
  scope.$watch(
    function(scope) { return scope.name; },
    function(newValue, oldValue, scope) {
      if (newValue) {
      	scope.nameUpper = newValue.toUpperCase();
    	}
    }
  );
  scope.$digest();
  expect(scope.initial).toBe('J.');
  scope.name = 'Bob';
  scope.$digest();
  expect(scope.initial).toBe('B.');
});
```

这个scope有两个观察者：一个观察nameUpper属性并维护initial属性，另一个观察name属性并维护nameUpper属性。我们期望的是当scope上的name发生改变时两个观察者都做出相应的反应，但事实并非如此。

我们需要更改的是不断遍历观察者直到观察者都不再发生变化。

首先，将`$digest`重命名为`$$digestOnce`，并对其进行调整，使其一次运行所有的观察者，并返回一个boolean值表示是否发生改变。

~~~js
src/scope.js
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEach(this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (newValue !== oldValue) {
      watcher.last = newValue;
      watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
      dirty = true;
    }
  });
  return dirty;
};
~~~

然后，重定义`$digest`，以便他运行“外部循环”，只要更改持续发生，就调用`$$digestOnce`：

~~~js
src/scope.js
Scope.prototype.$digest = function() {
  var dirty;
  do {
  	dirty = this.$$digestOnce();
  } while (dirty);
};
~~~

`$digest`至少运行一次所有观察者，如果在第一次过程中任何监视的值被更改，则将该过程标记为*dirty*，并且所有的观察者将再次运行。一直持续到所有观察者都不发生改变，者将被认为是稳定状态。

Angular监听函数还有另一个重要的性质：因为digest过程会运行多次，那么观察者应该是幂等的，否则会发生副作用，例如在监听函数内出发Ajax，那么将无法保证在整个过程中触发了多少次请求。





### Giving Up On An Unstable Digest

在我们当前的实例中，有一个明显的遗漏：两个观察者都在依赖对方的更改，也就是说整个系统永远不会达到未定的状态。

~~~js
test/scope_spec.js
it('gives up on the watches after 10 iterations', function() {
  scope.counterA = 0;
  scope.counterB = 0;
  scope.$watch(
  	function(scope) { return scope.counterA; },
    function(newValue, oldValue, scope) {
  		scope.counterB++;
    }
  );
  scope.$watch(
    function(scope) { return scope.counterB; },
    function(newValue, oldValue, scope) {
    	scope.counterA++;
    }
  );
  expect((function() { scope.$digest(); })).toThrow();
});
~~~

我们希望`scope.$digest`抛出异常，但他并没有。在每一次迭代中，都会有一个观察者标记为*dirty*。

我们需要做的就是继续运行*digest*以得到可接受的迭代次数，如果超出这个范围后观察者仍在变化，那么他们可能永远不会稳定下来。这时不妨抛出一个异常，因为无论scope状态如何，这都不是用户想要的结果。

设置一个TTL（time to live），默认值为10。这个数字可能看起来很小，但请记住这是一个性能敏感区，因为*digest*经常发生，并且每次*digest*都会运行所有观察者。

让我们给外部循环添加一个循环计数器，如果他到达TTL，我们将抛出异常：

```js
src/scope.js
Scope.prototype.$digest = function() {
  var ttl = 10;
   var dirty;
  do {
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) { 
    	throw '10 digest iterations reached'; 
    } 
  } while (dirty);
};
```





### Short-Circuiting The Digest When The Last Watch Is Clean

在当前的实现中，我们不断迭代观察者集合，直到我们见证了一个完整的回合，其中每个观察者都是干净的（或者达到了TTL）。

由于*digest*循环中可能有大量的观察者，因此尽可能少地执行它们是很重要的。这就是为什么我们要对*digest*循环应用一个特定的优化。

考虑在一个范围内有100个观察者的情况。当我们执行scope的*digest*，这100个观察者中只有第一个是脏的。那个观察者“弄脏”了整轮，我们得再做一轮。在第二轮迭代中，没有一个观察者是脏的，*digest*结束了。但在我们完成之前，我们必须执行200次观察者！

~~~js
test/scope_spec.js
it('ends the digest when the last watch is clean', function() {
  scope.array = _.range(100);
  var watchExecutions = 0;
  _.times(100, function(i) {
    scope.$watch(
      function(scope) {
        watchExecutions++;
        return scope.array[i];
      },
      function(newValue, oldValue, scope) {
      }
    );
  });
  scope.$digest();
  expect(watchExecutions).toBe(200);
  scope.array[0] = 420;
  scope.$digest();
  expect(watchExecutions).toBe(301);
});
~~~

在scope中添加一个100项的数组，然后建立100个观察者，每个监听数组的一项，在每个监听函数运行时对`watchExecutions`自增，因此我们可以统计监听函数执行的总次数。

然后我们运行一次`$digest`初始化观察者，每个监听函数被运行了两次。

然后我们对数组中的第一项进行更改。如果短路优化有效，这将意味着摘要将在第二次迭代期间对第一个观察者短路，并立即结束，从而使总观察者执行次数仅为301次，而不是400次。

如前所述，这种优化可以通过跟踪最后一个脏观察者来实现。让我们为其向作用域构造函数添加一个字段：

```js
src/scope.js
function Scope() {
	this.$$watchers = [];
	this.$$lastDirtyWatch = null; 
}
```

现在，每当*digest*开始时，让我们将此字段设置为null：

~~~js
src/scope.js
Scope.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;
  do {
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
    	throw '10 digest iterations reached'; 
    }
  } while (dirty);
};
~~~

在`$$digstOnce`，当我们遇到脏观察者时，将其分配到该字段。

```js
src/scope.js
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEach(this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (newValue !== oldValue) {
      self.$$lastDirtyWatch = watcher;
      watcher.last = newValue;
      watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
      dirty = true;
    }
  });
  return dirty;
};
```

同样在`$$digestOnce`中，每当我们遇到没有发生改变的观察者，而且他也恰好是我们看到的最后一个脏观察者时，让我们立即跳出循环并返回一个false，让外部`$digest`循环知道他也应该停止迭代：

```js
src/scope.js
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEach(this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (newValue !== oldValue) {
      self.$$lastDirtyWatch = watcher;
      watcher.last = newValue;
      watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
      dirty = true;
    }
    else if (self.$$lastDirtyWatch === watcher) { 
    	return false; 
    }
  });
  return dirty;
};
```

因为这次我们不会看到任何脏观察者，所以`dirty === undefined`，这将是函数的返回值。

优化已经生效，但是我们需要讨论一个边界情况，通过一个观察者的listener添加一个观察者：

```js
test/scope_spec.js
it('does not end digest so that new watches are not run', function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  scope.$watch(
  	function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.$watch(
      	function(scope) { return scope.aValue; },
        function(newValue, oldValue, scope) {
      		scope.counter++; }
      	);
    }
  );
  scope.$digest();
  expect(scope.counter).toBe(1);
});
```

第二个观察者没有执行。原因是在第二个*digest*迭代中，也就是在新观察者运行前，*digest*就被停止了，因为我们检测到第一个观察者也就是`$$lastDirtyWatch`状态变为*clean*，可以在添加观察者时重新设置`$$lastDirtyWatch`来解决这个问题：

```js
src/scope.js
Scope.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() { },
    last: initWatchVal
  };
  this.$$watchers.push(watcher);
  this.$$lastDirtyWatch = null;
};
```







### Value-Based Dirty-Checking

现在，我们使用一种严格相等运算符`===`比较`new value`和`old value`，在大多数情况下，这很好，因为他可以检测所有基本体（数字、字符串等）的更改，还可以检测对象或数组何时被赋新值。但还有另一种方法可以检测变化，那就是检测对象或数组中内容发生变化，也就是说，您可以关注值的变化，而不仅仅是引用。

通过向`$watch`传入第三个参数来激活这种脏检查。当标识为`true`时，将使用基于值的检查。

```js
test/scope_spec.js
it('compares based on value if enabled', function() {
  scope.aValue = [1, 2, 3];
  scope.counter = 0;
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
    	scope.counter++;
    },
    true
  );
  scope.$digest();
  expect(scope.counter).toBe(1);
  scope.aValue.push(4);
  scope.$digest();
  expect(scope.counter).toBe(2);
});
```

每当`scope.aValue`数组的值发生更改时，`counter`就会增加，当我们将数组添加一项时，希望能发现这个更改，但事实并非如此，aValue仍然是相同的数组，只是值不同。

让我们重写`$watch`以获取boolean标志并将其存储在观察者对象中：

```js
src/scope.js
Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) { 
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() { },
    valueEq: !!valueEq, 
    last: initWatchVal
  };
  this.$$watchers.push(watcher);
  this.$$lastDirtyWatch = null;
};
```

通过两次求反将标志值转为真正的boolean值，当用户没有传入第三个参数时，其值为undefined，将在观察者中存为false。

基于值的脏检查意味着，如果旧值或新值是对象或数组，我们必须对其中包含的所有内容进行检查。如果这两个值有任何差异，那么观察者就是脏的。如果该值中嵌套了其他对象或数组，则这些对象或数组也将按值进行递归比较。

让我们定义一个新函数，它接受两个值和布尔标志，并相应地比较这些值：

```js
src/scope.js
Scope.prototype.$$areEqual = function(newValue, oldValue, valueEq) {
  if (valueEq) {
  	return _.isEqual(newValue, oldValue);
  } else {
  	return newValue === oldValue;
  }
};
```

为了检测到值的变化，我们还需要改变为每个观察者存储旧值的方式。仅仅存储对当前值的引用是不够的，因为在该值内所做的任何更改也将应用于我们所持有的引用。我们永远不会注意到任何更改，因为本质上`$$areEqual`总是会得到对同一个值的两个引用。出于这个原因，我们需要制作一个值的深拷贝并存储它。

让我们更新`$digestOnce`，以便它使用新的`$$areEqual`函数，并在需要时复制最后一个引用:

```js
src/scope.js
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEach(this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (!self.$$areEqual(newValue, oldValue, watcher.valueEq)) { 
    	self.$$lastDirtyWatch = watcher;
    	watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
    	watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
    	dirty = true;
    } else if (self.$$lastDirtyWatch === watcher) {
    	return false; 
    }
  });
  return dirty;
};
```

按值检查显然比仅检查引用更复杂。遍历嵌套的数据结构需要时间，而保存它的深层副本也会占用内存。这就是Angular在默认情况下不执行基于值的脏检查的原因。您需要显式设置标志以启用它。





### NaNs

在JavaScript中，NaN不等于它本身。如果我们在脏检查函数中没有显式地处理NaN，那么观察NaN的观察者将总处于dirty状态。

对于基于值的脏检查，这种情况已经由Lo Dash isEqual函数为我们处理。对于基于参考的检查，我们需要自己处理。这可以通过测试来说明：

```js
test/scope_spec.js
it('correctly handles NaNs', function() {
  scope.number = 0/0; // NaN
  scope.counter = 0;
  scope.$watch(
    function(scope) { return scope.number; },
    function(newValue, oldValue, scope) {
      scope.counter++; 
    }
  );
  scope.$digest();
  expect(scope.counter).toBe(1);
  scope.$digest();
  expect(scope.counter).toBe(1);
});
```

运行时会抛出TTL异常，因为NaN总会不等于自身。

让我们通过调整`$$areEqual`函数来解决这个问题：

```js
src/scope.js
Scope.prototype.$$areEqual = function(newValue, oldValue, valueEq) {
  if (valueEq) {
  	return _.isEqual(newValue, oldValue);
  } else {
    return newValue === oldValue ||
    (typeof newValue === 'number' && typeof oldValue === 'number' &&
    isNaN(newValue) && isNaN(oldValue)); 
  }
};
```







### Handling Exceptions

我们的脏检查实现正在成为类似于Angular的实现。然而，它是相当脆弱的。这主要是因为我们没有对例外情况进行太多思考。

~~~js
src/scope.js
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEach(this.$$watchers, function(watcher) {
    try { 
      newValue = watcher.watchFn(self);
      oldValue = watcher.last;
      if (!self.$$areEqual(newValue, oldValue, watcher.valueEq)) {
        self.$$lastDirtyWatch = watcher;
        watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
        watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
        dirty = true;
      } else if (self.$$lastDirtyWatch === watcher) {
        return false; 
      }
    } catch (e) { 
      console.error(e); 
    } 
  });
  return dirty;
};
~~~





### Destroying A Watch

注册观察者时，您通常希望它保持活动状态，直到scope本身保持活动状态为止，因此您永远不会真正明确地删除它。但是，在某些情况下，您希望销毁特定的观察者，同时保持scope的工作状态。这意味着我们需要对观察者进行删除操作。

Angular实现这一点的方法实际上相当聪明：Angular中的`$watch`函数有一个返回值。它是一个函数，调用时会销毁已注册的观察者。如果用户希望以后能够删除观察者，他们只需要保留注册观察者时返回的函数，然后在不再需要观察者时调用它：

```js
test/scope_spec.js
it('allows destroying a $watch with a removal function', function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  var destroyWatch = scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter++; 
    }
  );
  scope.$digest();
  expect(scope.counter).toBe(1);
  scope.aValue = 'def';
  scope.$digest();
  expect(scope.counter).toBe(2);
  scope.aValue = 'ghi';
  destroyWatch();
  scope.$digest();
  expect(scope.counter).toBe(2);
});
```

为了实现这一点，我们需要返回一个从`$$watchers`数组中删除观察者的函数：

```js
src/scope.js
Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) {
  var self = this; 
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn,
    valueEq: !!valueEq,
    last: initWatchVal
  };
  self.$$watchers.push(watcher);
  this.$$lastDirtyWatch = null;
  return function() { 
    var index = self.$$watchers.indexOf(watcher); 
    if (index >= 0) { 
      self.$$watchers.splice(index, 1); 
    } 
  }; 
};
```

这可以解决普通的情形，当需要在一个digest过程中删除一个观察者时，还需要其他操作。

首先，观察者可能会在自己的*listener*函数中删除自己，这不应该影响到其他观察者：

```js
test/scope_spec.js
it('allows destroying a $watch during digest', function() {
  scope.aValue = 'abc';
  var watchCalls = [];
  scope.$watch(
    function(scope) {
      watchCalls.push('first');
      return scope.aValue;
    }
  );
  var destroyWatch = scope.$watch(
    function(scope) {
      watchCalls.push('second');
      destroyWatch();
    }
  );
  scope.$watch(
    function(scope) {
      watchCalls.push('third');
      return scope.aValue;
    }
  );
  scope.$digest();
  expect(watchCalls).toEqual(['first', 'second', 'third', 'first', 'third']);
});
```

第二个观察者会在执行后移除自身。

但是，在第二个观察者被移除时，观察者集合中被删除项之后的项会向前移动，导致`$$digestOnce`过程跳过第三个观察者。

解决办法是反转`$$watches`数组，并从后向前迭代，当一个观察者被移除时不会跳过其他的观察者。

添加观察者时，使用`unshift`替换`push`：

```js
src/scope.js
Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) {
  var self = this;
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() { },
    last: initWatchVal,
    valueEq: !!valueEq
  };
  this.$$watchers.unshift(watcher); 
  this.$$lastDirtyWatch = null;
  return function() {
      var index = self.$$watchers.indexOf(watcher);
      if (index >= 0) {
      	self.$$watchers.splice(index, 1);
    	}
  };
};
```

然后使用`_.forEachRight`代替`_.forEach`：

```js
src/scope.js
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEachRight(this.$$watchers, function(watcher) { 
    try {
      newValue = watcher.watchFn(self);
      oldValue = watcher.last;
      if (!self.$$areEqual(newValue, oldValue, watcher.valueEq)) {
        self.$$lastDirtyWatch = watcher;
        watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
        watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
        dirty = true;
      } else if (self.$$lastDirtyWatch === watcher) {
      	return false; 
      }
    } catch (e) {
    	console.error(e);
    }
  });
  return dirty;
};
```

下一个例子是一个观察者移除了另一个观察者：

```js
test/scope_spec.js
it('allows a $watch to destroy another during digest', function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  scope.$watch(
    function(scope) {
      return scope.aValue;
    },
    function(newValue, oldValue, scope) {
      destroyWatch();
    }
  );
  var destroyWatch = scope.$watch(
    function(scope) { },
    function(newValue, oldValue, scope) { }
    );
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter++; }
    );
  scope.$digest();
  expect(scope.counter).toBe(1);
});
```

因为我们的短路优化，这个用例会失败：

1. 第一个观察者被执行，他是dirty状态且，被存在`$$lastDirtyWatch`中，其`listener`函数移除了第二个观察者
2. 因为在`$$watches`中删除了第二个观察者，那么第一个观察者将会前移，会再次遍历到第一个观察者，此时记录的`$$lastDirtyWatche`正是第一个观察者，所以本次`$digest`会结束，第三个观察者永远不会被执行。

我们应当在观察者被删除时取消短路优化，这样就不会出现这样的错误：

~~~js
src/scope.js
Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) {
  var self = this;
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn,
    valueEq: !!valueEq,
    last: initWatchVal
  };
  self.$$watchers.unshift(watcher);
  this.$$lastDirtyWatch = null;
  return function() {
    var index = self.$$watchers.indexOf(watcher);
    if (index >= 0) {
      self.$$watchers.splice(index, 1);
      self.$$lastDirtyWatch = null; 
    }
  };
};
~~~

最后一种情况是一个观察者删除了多个观察者：

```js
test/scope_spec.js
it('allows destroying several $watches during digest', function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  var destroyWatch1 = scope.$watch(
    function(scope) {
      destroyWatch1();
      destroyWatch2();
    }
  );
  var destroyWatch2 = scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
    	scope.counter++; 
    }
  );
  scope.$digest();
  expect(scope.counter).toBe(0);
});
```

第一个观察者删除了他自己和其他观察者，这样会抛出异常。

解决的办法是是在迭代时对当前观察者判空：

```js
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEachRight(this.$$watchers, function(watcher) {
    try {
      if (watcher) { 
        newValue = watcher.watchFn(self);
        oldValue = watcher.last;
        if (!self.$$areEqual(newValue, oldValue, watcher.valueEq)) {
          self.$$lastDirtyWatch = watcher;
          watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
          watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
          dirty = true;
        } else if (self.$$lastDirtyWatch === watcher) {
          return false; 
        }
     	} 
    } catch (e) {
    	console.error(e);
    }
  });
  return dirty;
};
```



## Scope Methods

我们现在有了一个基本的脏检查系统，它是用`$watch`和`$digest`实现的，但这仅仅是`scopes`部分功能。

在本章中，我们将添加几种访问Scope及触发脏检查的方法，还将实现`$watchGroup`。

### $eval - Evaluating Code In The Context of A Scope

Angular 允许你在Scope上下文中执行代码，最简单的就是`$eval`，他将函数作为参数，并执行改函数，然后返回该函数的结果，他还接受一个可选参数，传递给要执行的函数。

例子：

```js
test/scope_spec.js
describe('$eval', function() {
  var scope;
   beforeEach(function() {
   	scope = new Scope();
   });
   it('executes $evaled function and returns result', function() {
     	scope.aValue = 42;
			var result = scope.$eval(function(scope) {
    		return scope.aValue;
     	});
     	expect(result).toBe(42);
   });
   it('passes the second $eval argument straight through', function() {
     	scope.aValue = 42;
    	var result = scope.$eval(function(scope, arg) {
    		return scope.aValue + arg;
     	}, 2);
     	expect(result).toBe(44);
   });
 });
```

实现`$eval`非常简单：

```js
src/scope.js
Scope.prototype.$eval = function(expr, locals) {
	return expr(this, locals);
};
```

`$eval`使得专门处理Scope内容的代码更加清晰，同时也是`$apply`的一部分。

### $apply - Integrating External Code With The Digest Cycle

`$aaply`将函数作为参数，使用`$eval`执行该函数，然后通过调用`$digest`启动*digest cycle*。例子：

```js
test/scope_spec.js
describe('$apply', function() {
	var scope;
 	beforeEach(function() {
 		scope = new Scope();
 	});
 	it('executes the given function and starts the digest', function() {
 		scope.aValue = 'someValue';
 		scope.counter = 0;
 		scope.$watch(
			function(scope) {
				return scope.aValue;
 			},
			function(newValue, oldValue, scope) {
 				scope.counter++;
 			}
   );
   scope.$digest();
 		expect(scope.counter).toBe(1);
 		scope.$apply(function(scope) {
 			scope.aValue = 'someOtherValue';
 	});
 	expect(scope.counter).toBe(2);
 });
});
```

`$apply`的简单实现：

```js
src/scope.js
Scope.prototype.$apply = function(expr) {
  try {
  	return this.$eval(expr);
  } finally {
  	this.$digest();
  }
};
```





### $evalAsync - Deferred Execution

Javascript中有异步调用，通过`$evalAsync`解决异步调用的问题：

```js
test/scope_spec.js
describe('$evalAsync', function() {
  var scope;
   beforeEach(function() {
   	scope = new Scope();
   });
   it('executes given function later in the same cycle', function() {
   	scope.aValue = [1, 2, 3];
   	scope.asyncEvaluated = false;
   	scope.asyncEvaluatedImmediately = false;
   	scope.$watch(
  		function(scope) { return scope.aValue; },
  		function(newValue, oldValue, scope) {
   			scope.$evalAsync(function(scope) {
   				scope.asyncEvaluated = true;
   			});
   			scope.asyncEvaluatedImmediately = scope.asyncEvaluated;
   		}
   	);
   scope.$digest();
   expect(scope.asyncEvaluated).toBe(true);
   expect(scope.asyncEvaluatedImmediately).toBe(false);
   });
});
```

首先用一个集合存储一步调用的代码：

```js
src/scope.js
function Scope() {
  this.$$watchers = [];
  this.$$lastDirtyWatch = null;
  this.$$asyncQueue = [];
}
```

`$evalAsync`的定义：

```js
src/scope.js
Scope.prototype.$evalAsync = function(expr) {
	this.$$asyncQueue.push({scope: this, expression: expr});
};
```

在`$digest`过程中，我们将执行这些代码：

```js
src/scope.js
Scope.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;
  do {
    while (this.$$asyncQueue.length) { 
      var asyncTask = this.$$asyncQueue.shift(); 
      asyncTask.scope.$eval(asyncTask.expression); 
    } 
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
    	throw '10 digest iterations reached'; }
  } while (dirty);
};
```





### Scheduling $evalAsync from Watch Functions

在观察者的监听函数中调用`$evalAsync`会怎么样呢：

```js
test/scope_spec.js
it('executes $evalAsynced functions added by watch functions', function() {
  scope.aValue = [1, 2, 3];
  scope.asyncEvaluated = false;
  scope.$watch(
    function(scope) {
      if (!scope.asyncEvaluated) {
        scope.$evalAsync(function(scope) {
        	scope.asyncEvaluated = true;
        });
        }
      return scope.aValue;
    },
    function(newValue, oldValue, scope) { }
  );
  scope.$digest();
  expect(scope.asyncEvaluated).toBe(true);
});
```

只要有一个观察者处于*dirty*状态，那么*digest*循环就将继续执行，但是如果我们在观察者都不是*dirty*的情况下执行一个`$evalAsync`呢：

```js
test/scope_spec.js
it('executes $evalAsynced functions even when not dirty', function() {
  scope.aValue = [1, 2, 3];
  scope.asyncEvaluatedTimes = 0;
  scope.$watch(
    function(scope) {
      if (scope.asyncEvaluatedTimes < 2) {
        scope.$evalAsync(function(scope) {
          scope.asyncEvaluatedTimes++;
        });
      }
      return scope.aValue;
    },
    function(newValue, oldValue, scope) { }
  );
  scope.$digest();
  expect(scope.asyncEvaluatedTimes).toBe(2);
});
```

这次`$evalAsync`执行两次，第二次时，观察者状态是非*dirty*的，将会结束`$digest`循环，这样第二次`$evalAsync`就不会执行。解决这个问题需要我们修改`$digest`的结束条件：

```js
src/scope.js
Scope.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;
  do {
    while (this.$$asyncQueue.length) {
      var asyncTask = this.$$asyncQueue.shift();
      asyncTask.scope.$eval(asyncTask.expression);
  	}
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
      throw '10 digest iterations reached'; 
    }
  } while (dirty || this.$$asyncQueue.length); 
};
```

如果一个观察者总是在监听函数中设置`$evalAsync`呢？我们也许会觉得TTL会让`$digest`循环终止，但事实并非如此：

```js
test/scope_spec.js
it('eventually halts $evalAsyncs added by watches', function() {
  scope.aValue = [1, 2, 3];
  scope.$watch(
    function(scope) {
      scope.$evalAsync(function(scope) { });
      return scope.aValue;
    },
    function(newValue, oldValue, scope) { }
  );
  expect(function() { scope.$digest(); }).toThrow();
});
```

该用例中`$digest`中的`while`循环永远不会终止。我们还需要在TTL检查中检查异步队列的状态：

```js
src/scope.js
Scope.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;
  do {
    while (this.$$asyncQueue.length) {
      var asyncTask = this.$$asyncQueue.shift();
      asyncTask.scope.$eval(asyncTask.expression);
    }
    dirty = this.$$digestOnce();
    if ((dirty || this.$$asyncQueue.length) && !(ttl--)) { 
    	throw '10 digest iterations reached'; 
    }
  } while (dirty || this.$$asyncQueue.length);
};
```

### Scope Phases

`$evalAsync`所做的另一件事情就是如果当前没有一个`$digest`，那么就会创建一个新的`$digest`任务，这样就保证了无论何时调用`$evalAsync`，其异步任务都会及时的被调用，而不用等到下一个`$digest`循环被触发。

为了实现这个逻辑，`$evalAsync`需要检测是否有`$digest`在运行中。为此*Angular  Scope*实现了一个叫做阶段（phase）的东西，他只是一个字符串属性，用于存储当前的执行信息。

```js
test/scope_spec.js
it('has a $$phase field whose value is the current digest phase', function() {
  scope.aValue = [1, 2, 3];
  scope.phaseInWatchFunction = undefined;
  scope.phaseInListenerFunction = undefined;
  scope.phaseInApplyFunction = undefined;
  scope.$watch(
    function(scope) {
    	scope.phaseInWatchFunction = scope.$$phase;
    	return scope.aValue;
    },
    function(newValue, oldValue, scope) {
    	scope.phaseInListenerFunction = scope.$$phase;
    }
  );
  scope.$apply(function(scope) {
  	scope.phaseInApplyFunction = scope.$$phase;
  });
  expect(scope.phaseInWatchFunction).toBe('$digest');
  expect(scope.phaseInListenerFunction).toBe('$digest');
  expect(scope.phaseInApplyFunction).toBe('$apply');
});
```

在*Scope*的构造函数中，引入`$$phase`字段，初始值为`null`：

```js
src/scope.js
function Scope() {
  this.$$watchers = [];
  this.$$lastDirtyWatch = null;
  this.$$asyncQueue = [];
  this.$$phase = null; 
}
```

定义两个函数控制`$$phase`,一个用于设置其状态一个用于清空状态，同时增加一个检查，确保当`$$phase`处于一个状态时不会被设置成另一状态：

```js
src/scope.js
Scope.prototype.$beginPhase = function(phase) {
  if (this.$$phase) {
  	throw this.$$phase + ' already in progress.'; }
  	this.$$phase = phase;
};
Scope.prototype.$clearPhase = function() {
  this.$$phase = null;
};
```

在`$digest`循环时，将`$$phase`设置为`"$digest"：`

```js
src/scope.js
Scope.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;
  this.$beginPhase(‘$digest’); 
  do {
    while (this.$$asyncQueue.length) {
      var asyncTask = this.$$asyncQueue.shift();
      asyncTask.scope.$eval(asyncTask.expression);
    }
    dirty = this.$$digestOnce();
    if ((dirty || this.$$asyncQueue.length) && !(ttl--)) {
    	this.$clearPhase(); 
    	throw '10 digest iterations reached'; 
    }
  } while (dirty || this.$$asyncQueue.length);
  this.$clearPhase(); 
};
```

在`$apply`中同样操作:

```js
src/scope.js
Scope.prototype.$apply = function(expr) {
  try {
    this.$beginPhase(‘$apply’); 
    return this.$eval(expr);
  } finally {
    this.$clearPhase(); 
    this.$digest();
  }
};
```

`$evalAsync`现在需要检测Scope的`$$phase`，如果为空，说明没有`$digest`过程在运行，那么直接新建一个：

```js
src/scope.js
Scope.prototype.$evalAsync = function(expr) {
  var self = this; 
  if (!self.$$phase && !self.$$asyncQueue.length) { 
    setTimeout(function() { 
      if (self.$$asyncQueue.length) { 
      	self.$digest(); 
      } 
    }, 0); 
  } 
  self.$$asyncQueue.push({scope: self, expression: expr});
};
```

请注意，我们还在以下两个位置检查当前异步队列的长度：

- 在调用`setTimeout`之前，需要确保异步队列是空的，因为我们不需要对同一个队列多次执行`$digest`
- 在`setTimeout`中也要判断异步队列的长度，当队列为空时，没必要进行`$digest`

