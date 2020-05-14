<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="icondown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>
<script>
import Bookmark from '../common/Bookmark';
import { ebookMixin } from '../../utils/mixin'
import { realPx } from '../../utils/utils';
import { getBookmark, saveBookmark } from '../../utils/localStorage'
const BLUE = "#346cbc"
const WHITE = "#fff"
export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  //书签 算法
  // 1.当下拉到35px时，书签图标
  // 2.当下拉到>临界值时，书签图标吸附在顶部， 规定临界值
  computed: {
    height() {
      return realPx(35)
    },
    //临界值
    threshold() {
      return realPx(55)
    },
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    offsetY(v) {
      if (!this.bookAvailable || this.titleVisible || this.visible >= 0) {
        // console.log(this.bookAvailable, this.titleVisible)
        return
      }
      if (v >= this.height && v < this.threshold) {
        //未到达临界状态
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        // 超越临界状态,保持吸顶状态
        this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        this.beforeHeight()
      } else if (v === 0) {
        this.restore()
      }
    },
    isBookmark(isBookmark) {
      // this.isFixed = isBookmark
      if (isBookmark) {
        this.color = BLUE
        this.isFixed = true
      } else {
        this.color = WHITE
        this.isFixed = false
      }
    }
  },

  data() {
    return {
      text: "",
      color: WHITE,
      isFixed: false
    }
  },
  methods: {
    addBookmark() {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
      // console.log(currentLocation, cfibase, cfistart, cfiend)
      const cfirange = `${cfibase}!,${cfistart},${cfiend})`
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, '')
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        })
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if (this.bookmark) {
        saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        this.setIsBookmark(false)
      }
    },
    restore() {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.icondown.style.transform = 'rotate(0deg)'
      }, 200);
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookmark()
      } else {
        this.setIsBookmark(false)
        this.removeBookmark()
      }
    },
    beforeHeight() {
      // 状态1：未超过书签的高度
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    },
    beforeThreshold(v) {
      // 状态2：未到达零界状态
      this.$refs.bookmark.style.top = `${-v}px`
      this.beforeHeight()
      const icondown = this.$refs.icondown
      if (icondown.style.transform === 'rotate(180deg)') {
        icondown.style.transform = 'rotate(0deg)'
      }
    },
    afterThreshold(v) {
      // 状态3：超越零界状态
      this.$refs.bookmark.style.top = `${-v}px`
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }
      const icondown = this.$refs.icondown
      if (icondown.style.transform === '' || icondown.style.transform === 'rotate(0deg)') {
        icondown.style.transform = 'rotate(180deg)'
      }
    }

  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(35);
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(14);
      color: white;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: px2rem(14);
      color: white;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    color: white;
    margin-right: px2rem(15);
  }
}
</style>
