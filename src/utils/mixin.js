import { mapGetters, mapActions } from "vuex";
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book';

import { saveLocation, getBookmark } from './localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      "fileName",
      "titleVisible",
      "visible",
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'cover',
      'metadata',
      'navigation',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this)
    },
  },
  methods: {
    ...mapActions([
      "setFileName",
      "setTitleVisible",
      "setVisible",
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setCover',
      'setMetadata',
      'setNavigation',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break;
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break;
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break;
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break;
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break;
      }
    },
    // 渲染完成后，刷新当前位置
    refreshLocation() {
      //获取阅读进度百分比
      const currentLocation = this.currentBook.rendition.currentLocation()
      // console.log(currentLocation)
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        //获取本章节的开始位置
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        //进度百分比切换
        this.setProgress(Math.floor(progress * 100))

        this.setSection(currentLocation.start.index)
        //阅读进度的保存
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookmark(this.fileName)
        console.log(bookmark)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    },
    //
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    hideBar() {
      this.setTitleVisible(false)
      this.setVisible(-1)
      this.setFontFamilyVisible(false)
    },
    //获取阅读时间
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}