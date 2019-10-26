<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>


<script>

import EbookTitle from "../../components/ebook/EbookTitle";
import EbookReader from "../../components/ebook/EbookReader";
import EbookMenu from "../../components/ebook/EbookMenu";
import { getReadTime, saveReadTime } from '../../utils/localStorage';
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookTitle,
    EbookReader,
    EbookMenu
  },
  methods: {
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
</style>