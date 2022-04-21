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

### 各种定位的基准

### flex布局的意义


### special

#### fixed
元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。**当元素祖先的 `transform`, `perspective` 或 `filter` 属性非 `none` 时，容器由视口改为该祖先**。