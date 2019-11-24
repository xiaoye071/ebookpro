<template>
  <transition name="silde-up">
    <div class="setting-wrapper" v-show="titleVisible && visible===2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <span class="icon-back"></span>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            ref="progress"
          />
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
// import { getReadTime } from '../../utils/localStorage.js'
export default {
  mixins: [ebookMixin],
  computed: {
    //章节名称获取
    getSectionName() {
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section)
      //   if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation) {
      //     return this.currentBook.navigation.get(sectionInfo.href).label
      //   }
      // }
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    onProgressChange(progress) {//
      this.setProgress(progress).then(() => {
        this.displayProgress()//获取分页数据 
        this.updateProgressBg()//更新progress 进度条
      })
    },
    onProgressInput(progress) {//拖动过程中更新进度条，
      this.setProgress(progress).then(() => {
        this.displayProgress()
        this.updateProgressBg()
      })
    },
    displayProgress() {//分页显示
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      // this.currentBook.rendition.display(cfi)
      this.display(cfi)
    },
    //进度条颜色切换
    updateProgressBg() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    },
    prevSection() {
      // console.log(this.section)
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    },
    nextSection() {
      if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    },
    //章节展示
    displaySection() {
      const sectionInfo = this.currentBook.section(this.section)
      if (sectionInfo && sectionInfo.href) {
        this.currentBook.rendition.display(sectionInfo.href).then(() => {
          this.refreshLocation()
        })
        // this.display(sectionInfo.href).then(() => {
        //   this.refreshLocation()
        // })
      }
    },

  },
  //
  updated() {
    this.updateProgressBg()
  },
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global.scss";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(46);
  left: 0;
  z-index: 160;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(-8) rgba(0, 0, 0, 0.15);
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(12);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .progress-icon-wrapper {
        font-size: px2rem(20);
      }
      .progress {
        width: 100%;
        height: px2rem(2);
        -webkit-appearance: none;
        margin: 0 px2rem(10);
        // background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
        // background-size: 0 100% !important;
        &：focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          //设置range 控件样式
          -webkit-appearance: none; //清除默认样式
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include center;
      .progress-section-text {
        @include ellipsis;
      }
    }
  }
}
</style>