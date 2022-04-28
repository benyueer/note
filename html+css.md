### css中%的基准对象

`containing block`的定义和元素的`position`属性有关
1. static或relative时：
   最近的__block container__(比如inline-block, block, list-item)或者创建了__formatting context__(比如table container, flex container, grid container或block container)的祖先元素的__context box__
2. absolute时：
   最近的position属性不是static的祖先元素的__padding box__
3. fixed时：
   窗口
4. 特殊情况, fixed或absolute时, 当其父元素有以下情况出现时, containing block为其父元素的__padding box__:
   1. transform或perspective属性的值不是none
   2. will-change属性的值是transform或perspective
   3. filter属性不是none或will-change属性的值是filter(只在Firefox中有效)


具体属性：

1. `font-size`
   当`font-size`的值为`%`值时，它的计算是相对于**父元素**的`font-size`来计算，如果父元素（以及它的祖先元素）未显式设置`font-size`值的话，将会以浏览器的默认值`16px`为基准。
2. `line-height`
   CSS中的`line-height`取值为%时，它的计算方式是基于元素自身的`font-size`的值来计算。如果元素自身未显式设置`font-size`，则会基于元素继承过来的`font-size`的值计算。
3. `vertical-align`元素自身的`line-height`
4. `margin` `padding`都是相对于包含块的宽度
5. `border-radius`,元素自身的尺寸（长宽）
6. `background-position`的百分比值，取的参照是一个减法计算值，由放置背景图的区域尺寸，减去背景图的尺寸得到，可以为负值
   

百分比值的继承:
当百分比值用于可继承属性时，只有结合参照值计算后的绝对值会被继承，而不是百分比值本身。例如，一个元素的font-size是14px，并定义了line-height:150%;，那么该元素的下一级子元素继承到的line-height就是21px，而不会再和子元素自己的font-size有关。


### px em rem
- `px` 在缩放页面时无法调整那些使用它作为单位的字体、按钮等的大小；
- `em` 的值并不是固定的，会继承父级元素的字体大小，代表倍数；
  浏览器的默认font-size是16px，那么1em=16px，但是这样使用很复杂，经常会出现0.625em的情况，计算麻烦，不便于开发
  为了简化，会在body里设置font-size 62.5%，那么1em=10px
  - 缺点
    - em的值不是固定的
    - em会继承父元素的值
      如：父元素设置了1.2em，子元素如果也设置1.2em那么最终的字体大小为1.2*1.2=1.44em，宽高也是同理
- `rem` 的值并不是固定的，始终是基于根元素 <html> 的，也代表倍数。
  - 浏览器的默认字体都是16px，那么1rem=16px，以此类推计算12px=0.75rem，10px=0.625rem，2rem=32px；
  - 这样使用很复杂，很难很好的与px进行对应,也导致书写、使用、视觉的复杂(0.75rem、0.625em全是小数点) 
  - 为了简化font-size的换算，我们在根元素html中加入font-size: 62.5%
  - 特点：
    - rem单位可谓集相对大小和绝对大小的优点于一身
    - 和em不同的是rem总是相对于根元素(如:root{})，而不像em一样使用级联的方式来计算尺寸。这种相对单位使用起来更简单

#### rem实现页面等比缩放

### 各种定位的基准

### flex布局的意义


### special

#### fixed
元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。**当元素祖先的 `transform`, `perspective` 或 `filter` 属性非 `none` 时，容器由视口改为该祖先**。


### html的head标签
[参考](https://www.cnblogs.com/belongs-to-qinghua/p/10950535.html)
他的作用是保存页面的`元数据`

#### 页面标题：`<title>`

#### 元数据：`<meta>元素`
元数据就是描述数据的数据，HTML通过`<meta>`添加元数据，meta标签永远位于head标签内，元数据总是以`名称-值`的形式被成对传递

|属性|值|描述|必填|
|-|-|-|-|
|content|some_text|定义与http_equiv或name属性相关的元信息|必填|
|http_equiv|content_type<br/>expires<br/>refresh<br/>set-cookie|把content属性关联到http头部|选填|
|name|author<br/>description<br/>keywords<br>generator<br>revised<br>others|把content属性关联到一个名称|选填|
|scheme|some_text|定义用于翻译content属性值的格式|选填|


- 指定文档中的字符编码
  ```html
  <meta charset="utf-8">
  ```
- 添加作者和描述
  ```html
  <meta name="author" content="benyueer">
  <meta name="description" content="this is a example page">
  在某些情况下对搜索引擎很有用
  ```
- http_equiv

#### style标签
html的样式信息

#### link标签
使用场景有两种：
- 引入外部样式表
  ```html
  <link rel="stylesheet" type="text/css" href="css/style.css">
  ```
- 作为网页图标标签
  ```html
  <link rel="icon" href="favicon.ico">
  ```

#### base标签
标签为页面上的所有链接规定默认地址或默认目录。通常情况下，浏览器会从当前文档的URL中提取相应的元素来填补相对URL中的空白，使用base标签可以改变这种行为。浏览器将不再使用当前文档的URL，而是使用指定的基本URL来解析所有的相对URL。这其中包括 `<a>`、`<img>`、`<link>`、`<form>` 标签中的 URL

#### script标签
用于定义客户端脚本
不一定要在标签内指定脚本内容，也可以通过src属性指定脚本文件的路径
|名称|值|描述|必选|
|-|-|-|-|
|type|MIME-type|指定脚本的MIME类型|必填|
|async|async|异步执行脚本||
|charset|charset|脚本文件的字符编码||
|defer|defer|异步执行脚本||
|language|script|规定脚本语言，请使用type代替||
|src|URL|脚本的外部资源路径||
|xml:space|preserve|是否保留代码中的空白||

### css资源引入方式
- 内联样式
  直接在dom标签上定义样式，具有高优先级，适合动态样式
  维护困难，过多的样式会使页面复杂
- style标签
  css与html一起作为一个文件
  不适合复用于其他页面
- link标签
  在加载后会被浏览器缓存
  每个资源都需要一个请求
- @import
  在不改变原代码的情况下添加新的css资源
  也需要一个请求

#### link与@import的区别
- 从属关系
  link属于html的标签，除了加载样式资源，还可以定义其他属性
  @import是css的语法，只能引入样式资源
- 加载顺序区别
  加载页面时，link引入的资源会同时加载，而@import只会在页面加载完成后加载
- 兼容性区别
  link作为html标签元素，不存在兼容性问题
  @import是css2.1后才有的语法
- dom可控性区别
  可以通过js操作dom，插入link标签来改变样式
  无法使用@import的语法来改变样式
- 权重区别
  并无权重区别，只是后来的会覆盖之前的样式，详见《css权重》


### transform的原理（先平移在旋转和先旋转再平移有什么区别）

### vertical-align
[参考](https://zhuanlan.zhihu.com/p/28626505)


### document.ready和window.onload的区别