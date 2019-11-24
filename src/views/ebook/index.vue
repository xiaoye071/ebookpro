<template>
  <div class="ebook" ref="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
  </div>
</template>


<script>

import EbookTitle from "../../components/ebook/EbookTitle";
import EbookReader from "../../components/ebook/EbookReader";
import EbookMenu from "../../components/ebook/EbookMenu";
import EbookBookmark from "../../components/ebook/EbookBookmark";
import { getReadTime, saveReadTime } from '../../utils/localStorage';
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookTitle,
    EbookReader,
    EbookMenu,
    EbookBookmark
  },
  watch: {
    offsetY(v) {
      if (!this.titleVisible && this.bookAvailable) {
        if (v > 0) {
          this.move(v)
        } else if (v === 0) {
          this.restore()
        }
      }
    }
  },
  methods: {
    restore() {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all 0.2 linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 2000);
    },
    move(v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      //当前定时任务
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {//每30s计时一次
          saveReadTime(this.fileName, readTime)
        }
      }, 1000);
    }
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task)
    }
  },
};
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
@import "../../assets/style/global.scss";
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: grey;
}
</style>