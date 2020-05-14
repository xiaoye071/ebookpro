## 数组降维

```
const a=[1,2,3]
const b=[3,4,5]
console.log([].concat(a,b))
const c=[[1,2,3],[4,5,6]]
console.log([].concat.apply([],c))
or
console.log([].concat.apply(1,c).unshif())
```

## 分页

##居中定位

```
position:absolute;
top:0;
left:0;
right:0;
bottom:0;
margin:auto;
```

## 图片尺寸屏幕适应

```
background-repeat: no-repeat;
background-size: 100% 100%;
```

## 动态组建 <component></component>

## 九宫格布局

```
  .shelf-item-category-list {
    display: flex;
    flex-flow: row wrap;/*子元素溢出父容器时换行*/
    width: 100%;
    height: 100%;
    .shelf-item-category-item {
      flex: 0 0 33.33%;
      width: 33.33%;
      height: 33.33%;
```
