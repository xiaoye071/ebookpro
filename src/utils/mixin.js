import { mapGetters, mapActions } from "vuex";
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book';
import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail } from './store'
import { shelf } from '../api/store'
import { appendAddToShelf, removeFromShelf, computedId } from "../utils/store"

export const homeMixin = {
  computed: {
    ...mapGetters(['offsetY', 'hotSearchOffsetY', 'flapCardVisible'])
  },
  methods: {
    ...mapActions(['setOffsetY', 'setHotSearchOffsetY', 'setFlapCardVisible']),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    }
  },
}
export const shelfBookMixin = {
  computed: {
    ...mapGetters(['isEditMode', 'shelfList', 'shelfSelected', 'shelfTitleVisible', 'offsetY', 'shelfCategory', 'currentType'])
  },
  methods: {
    ...mapActions(['setIsEditMode', 'setShelfList', 'setShelfSelected', 'setShelfTitleVisible', 'setOffsetY', 'setShelfCategory', 'setCurrentType']),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    },
    getShelfList() {
      //获取书架中已缓存的数据
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(response => {
          if (
            response.status === 200 &&
            response.data &&
            response.data.bookList
          ) {
            //手动添加书架
            // this.setShelfList(appendAddToShelf(response.data.bookList));
            //拿到至书架的数据,
            shelfList = appendAddToShelf(response.data.bookList)
            //保存书架列表到本地
            saveBookShelf(shelfList)
            //设置书架列表
            this.setShelfList(shelfList)
          }
        }).catch(() => { });
      } else {
        //缓存数据
        return this.setShelfList(shelfList)
      }
    },
    //分类列表获取
    getCategoryList(title) {
      this.getShelfList().then(() => {
        console.log(this.shelfList)
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    moveOutOffGroup(f) {
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => {
        const list = computedId(appendAddToShelf([].concat(removeFromShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f()
        })
      })
    }
  },

}
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
      'isBookmark',
      'pagelist',
      'paginate'
    ]),
    themeList() {
      return themeList(this)
    },
    //章节名称获取
    getSectionName() {
      return this.section ? this.navigation[this.section].label : ''
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
      'setIsBookmark',
      'setPagelist',
      'setPaginate'
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
        // console.log(bookmark)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        if (this.pagelist) {
          const totlePage = this.pagelist.length
          const currentPage = currentLocation.start.location
          // const currentSection = currentLocation
          // console.log(totlePage)
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + '/' + totlePage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
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