<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>


<script>

import { ebookMixin } from "../../utils/mixin";
import Epub from "epubjs";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from '../../utils/localStorage';
global.Epub = Epub;

export default {
  mixins: [ebookMixin],
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
        this.hideBar()
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
        this.hideBar()
      }
    },
    toggleTitleAndMenu() {
      if (this.titleVisible) {
        this.setVisible(-1)
        this.setFontFamilyVisible(false)
      }
      // this.$store.dispatch("setTitleVisible", !this.titleVisible)
      this.setTitleVisible(!this.titleVisible)
    },
    hideBar() {
      // this.$store.dispatch("setTitleVisible", false)
      this.setVisible(-1)
      this.setFontFamilyVisible(false)
      this.setTitleVisible(false)
    },
    initFontfamily() {
      let font = getFontFamily(this.fileName)
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initFontSize() {
      let fontSize = getFontSize(this.fileName)
      // console.log(fontSize)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initTheme() {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, this.defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      });
      this.rendition.themes.select(defaultTheme)
    },
    //资源渲染
    initRenditon() {
      //书籍的渲染
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      //书籍内容基本样式调用
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initTheme()
        this.initFontfamily()
        this.initFontSize()
        this.initGobalStyle()
        this.refreshLocation()
      })
      // this.rendition.display().then(() => {
      //   this.initTheme()
      //   this.initFontfamily()
      //   this.initFontSize()
      //   this.initGobalStyle()
      // })
      //格式 用register方法 注册，content 管理资源
      this.rendition.hooks.content.register(contents => {
        //当字体加载完成后，回调其他操作函数 Promise
        Promise.all([
          //手动添加样式
          // contents.addStylesheet("http://192.168.0.1:8081/font/cabin.css"),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/font/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/font/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/font/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/font/tangerine.css`)
        ])

      })
    },
    //手势功能
    initGesture() {
      this.rendition.on("touchstart", event => {
        // console.log(event);
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        // console.log(offsetX, time);
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        event.preventDefault();
        event.stopPropagation();
      });
    },
    initEpub() {
      // const url = "http://192.168.0.139:8081/epub/" + this.fileName + ".epub";
      const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + ".epub"
      this.book = new Epub(url);
      this.setCurrentBook(this.book)
      this.initRenditon()
      this.initGesture()
      // 阅读器渲染完成并且获取资源问件时，调用register 方法   content 管理资源
      // this.rendition.hooks.content.register(contents => {
      //   Promise.all([   
      //   ])
      // })
      this.book.ready.then(() => {
        // console.log(this.book)
        //书籍分页
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(() => {
        // console.log(locations)
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    }
  },
  mounted() {
    // const fileName = this.$route.params.fileName.split("|").join("/");
    this.setFileName(this.$route.params.fileName.split("|").join("/")).then(() => {
      this.initEpub();
    });
  }
};
</script>

<style  lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global.scss";
</style>