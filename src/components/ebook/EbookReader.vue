<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click="onMaskClick"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="onMouseEnter"
      @mousemove.left="onMouseMove"
      @mouseup.left="onMouseEnd"
    ></div>
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
  getLocation,
  // getLocale
} from "../../utils/localStorage";
import { flatten } from "../../utils/book";
import { getLocalForage } from '../../utils/localForage';
global.Epub = Epub;

export default {
  mixins: [ebookMixin],
  methods: {
    //1.鼠标进入 
    //2.鼠标进入后的移动
    //3.鼠标移动状态下松手
    //4.鼠标还原状态
    onMouseEnter(e) {
      //鼠标状态时 确定鼠标状态
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp //当鼠标进入时,获取鼠标停留时间
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove(e) {
      //鼠标移动时的状态, 
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd(e) {
      //鼠标松开时 ,状态的变化
      if (this.mouseState === 2) {
        this.offsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 200) {
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    move(e) {
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        // console.log(offsetY, e.changedTouches[0].clientY, this.firstOffsetY)
        this.setOffsetY(offsetY); //偏移量
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    moveEnd() {
      this.setOffsetY(0);
      this.firstOffsetY = null;
    },
    //蒙版的点击事件
    onMaskClick(e) {
      //鼠标点击 之后 ,变化
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return
      }
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        });
        // this.hideTitleAndMenu()
        this.hideBar();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        });
        // this.hideTitleAndMenu()
        this.hideBar();
      }
    },
    //顶部及菜单栏显示隐藏
    toggleTitleAndMenu() {
      if (this.titleVisible) {
        this.setVisible(-1);
        this.setFontFamilyVisible(false);
      }
      // this.$store.dispatch("setTitleVisible", !this.titleVisible)
      this.setTitleVisible(!this.titleVisible);
    },

    initFontfamily() {
      let font = getFontFamily(this.fileName);
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },
    initFontSize() {
      let fontSize = getFontSize(this.fileName);
      // console.log(fontSize)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.rendition.themes.fontSize(fontSize);
        this.setDefaultFontSize(fontSize);
      }
    },
    initTheme() {
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, this.defaultTheme);
      }
      this.setDefaultTheme(defaultTheme);
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },
    //资源渲染
    initRenditon() {
      //书籍的渲染
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        method: "default",
        // flow:'scroll' 渲染方法 滚动式阅读
      });
      //书籍内容基本样式调用
      const location = getLocation(this.fileName);
      this.display(location, () => {
        this.initTheme();
        this.initFontfamily();
        this.initFontSize();
        this.initGobalStyle();
        // this.refreshLocation()
      });
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
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/font/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/font/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/font/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/font/tangerine.css`
          )
        ]);
      });
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
    //封面信息
    parseBook() {
      // console.log(this.book.loaded);
      // console.log(this.book.spine);
      // console.log(this.book)
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url);
        });
      });
      //
      this.book.loaded.metadata.then(metadata => {
        // console.log(metadata)
        this.setMetadata(metadata);
      });
      //树状目录获取
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc); //目录
        // navigation = flatten(navigation)
        function find(item, level = 0) {
          // console.log(item)
          if (!item.parent) {
            return level;
          } else {
            return find(
              navItem.filter(parentItem => parentItem.id === item.parent)[0],
              ++level
            );
          }
        }
        navItem.forEach(item => {
          item.level = find(item);
        });
        this.setNavigation(navItem);
      });
    },
    initEpub(url) {
      // const url = "http://192.168.0.139:8081/epub/" + this.fileName + ".epub";

      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.initRenditon();
      this.initGesture();
      this.parseBook(); //封面渲染
      // 阅读器渲染完成并且获取资源问件时，调用register 方法   content 管理资源
      // this.rendition.hooks.content.register(contents => {
      //   Promise.all([
      //   ])
      // })
      this.book.ready
        .then(() => {
          // console.log(this.book)
          //书籍分页
          return this.book.locations.generate(
            750 * (window.innerWidth / 375.2) * (getFontSize(this.fileName) / 14)
          );
        }).then(locations => {
          this.navigation.forEach(nav => {
            nav.pagelist = []
          })
          locations.forEach(item => {
            const loc = item.match(/\[(.*)\]!/)[1]
            this.navigation.forEach(nav => {
              if (nav.href) {
                // const href = nav.href.match(/^(.*)\.xhtml$/)[1]
                const href = nav.href.match(/^(.*)\.html$/)
                // const href = hrefx ? hrefx : hrefy
                //分页信息和目录信息 
                if (href === loc) {
                  nav.pagelist.push(item)
                }
              }
            })
            let currentPage = 1
            this.navigation.forEach((nav, index) => {
              if (index === 0) {
                nav.page = 1
              } else {
                nav.page = currentPage
                // console.log(nav)
              }
              currentPage += nav.pagelist.length + 1
            })
          })
          this.setPagelist(locations)
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    }
  },
  mounted() {
    // const fileName = this.$route.params.fileName.split("|").join("/");
    //对缓存好的数据直接阅读
    const books = this.$route.params.fileName.split('|')
    const fileName = books[1]
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        this.setFileName(books.join('/')).then(
          this.initEpub(blob)
        )
      } else {
        this.setFileName(books.join("/")).then(() => {
          const url = process.env.VUE_APP_RES_URL + "/epub/" + this.fileName + ".epub";
          this.initEpub(url);
        }
        );
      }
    })

  }
};

// //test
//         let navigation = [
//           {            id: 1,
//             subitems: [
//               {
//                 id: 2,
//                 subitems: [
//                   {
//                     id: 3,
//                     subitems: [],
//                     parent: 2
//                   },
//                   {
//                     id: 4,
//                     subitems: [
//                       {
//                         id: 5,
//                         subitems: []
//                       }
//                     ]
//                   }
//                 ],
//                 parent: 1
//               }]
//           },
//           {
//             id: 6,
//             subitems: []
//           }
//         ]

// function flatten(array) {

//   return [].concat(...array.map((item) => { return [].concat(item, ...flatten(item.subitems)) }))
// }
// console.log(flatten(nav))
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global.scss";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 150;
    width: 100%;
    height: 100%;
  }
}
</style>
