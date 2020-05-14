
<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation':runFlapCardAnimation}">
      <div
        class="flap-card"
        v-for="(item,index) in flapCardList"
        :key="index"
        :style="{zIndex:item.zIndex}"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item,'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item,'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div
          class="point"
          :class="{'animation':runPointAnimation}"
          v-for="(item,index) in pointList"
          :key="index"
        ></div>
      </div>
    </div>
    <div class="book-card">
      <div
        class="book-card-wrapper"
        :class="{'animation':runBookCardAnimation}"
        v-show="runBookCardAnimation"
      >
        <div class="img-wrapper">
          <img class="img" :src="data?data.cover:''" />
        </div>
        <div class="content-wrapper">
          <div class="title">{{data? data.title:""}}</div>
          <div class="author sub-title-medium">{{data? data.author:""}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close icon"></span>
    </div>
  </div>
</template>

<script>
import { homeMixin } from '../../utils/mixin'
import { flapCardList, categoryText } from '../../utils/store'
export default {
  mixins: [homeMixin],
  props: {
    data: Object
  },
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      //烟花动画效果
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      // hideFlapCard: true
      runBookCardAnimation: false,
    }
  },
  watch: {
    //动画显示
    flapCardVisible(v) {
      if (v) {
        this.runAnimation()
        // this.runFlapCardAnimation = true
        // setTimeout(() => {
        //   this.startFlapCardAnimation()
        //   this.startPointAnimation()
        // }, 100);
      }
    }
  },
  methods: {
    categoryText() {
      if (this.data) {
        categoryText(this.data.category, this)
      } else {
        return ''
      }
    },

    close() {
      this.setFlapCardVisible(false)
      this.stopAnimation()
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    rotate(index, type) {
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
    },
    flapCardRotete() {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      backFlapCard.rotateDegree -= 10
      //当 有1 到达临界状态显示
      if (frontFlapCard.rotateDegree < 90) {
        frontFlapCard._g -= 5
      }
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    next() {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      //zIndex值的改变
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.perpare()
    },
    //左右半圆重叠
    perpare() {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    startFlapCardAnimation() {
      //转动动画,实现思路
      //1.当右边半圆转动至90°,背面转至90°将其覆盖,左右半球重叠,此时右半球第二张图片设置zindex
      //2.当右半球
      this.perpare()
      this.task = setInterval(() => {
        this.flapCardRotete()
      }, this.intervalTime);
      // setTimeout(() => {
      // this.runFlapCardAnimation = false
      // this.hideFlapCard = false
      //   this.stopAnimation()
      // }, 2500);
    },
    stopAnimation() {
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.timeout2) {
        clearTimeout(this.timeout2)
      }
      this.reset()
    },
    //开始动画
    runAnimation() {
      this.runFlapCardAnimation = true
      this.timeout = setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300);
      this.timeout2 = setTimeout(() => {
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500);
    },
    startPointAnimation() {
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750);
    },
    //进入动画初始状态
    reset() {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runBookCardAnimation = false
      this.runFlapCardAnimation = false
      this.runPointAnimation = false
    }
  },
  mounted() {


  },
  created() {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
@import "../../assets/style/flapCard.scss";

.flap-card-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  @include center;
  .flap-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    // @include center;
    @include absCenter;
    transform: scale(0); //当动画效果结束后,保持动画状态在初始状态
    opacity: 0;
    &.animation {
      animation: flap-card-move 0.3s ease-in both; //both当时间到后,动画效果停止并且停止在最后运行状态上
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card {
      width: px2rem(48);
      height: px2rem(48);
      margin: auto;
      @include absCenter;
      .flap-card-circle {
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background: no-repeat;
          //转动到背面隐藏
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          //转动轴
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1500;
      @include center;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    // height: 70%;
    max-width: px2rem(400);
    border-radius: px2rem(15);
    background: white;
    box-sizing: border-box;
    &.animation {
      animation: scale 0.3s ease-in;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(20);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2);
        }
        .author {
          margin: px2rem(20) 0;
          text-align: center;
        }
        .category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(10) 0;
        text-align: center;
        color: white;
        font-size: px2rem(12);
        background: $color-blue;
      }
    }
  }
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    width: 100%;
    z-index: 1800;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      border-radius: 50%;
      font-size: pxrem(25);
      background: #333;
      color: white;
      @include center;
    }
  }
}
</style>
