<template>
  <div class="book-shelf">
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <scroll
      class="book-shelf-scroll-wrapper"
      :bottom="scrollBottom"
      :top="0"
      @onScroll="onScroll"
      ref="scroll"
      v-if="shelfCategory.itemList && shelfCategory.itemList.length>0"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="book-shelf-empty" v-else>{{$t('shelf.groupNone')}}</div>
    <div class="shelf-footer" v-show="isEditMode">
      <div
        class="shelf-footer-tab-wrapper"
        v-for="item in tab"
        :key="item.index"
        @click="onTabClick(item)"
      >
        <div class="shelf-footer-tab" :class="{ 'is-selected': isSelected }">
          <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
          <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
          <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
          <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownload"></div>
          <div class="icon-move tab-icon" v-if="item.index === 3"></div>
          <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
          <div class="tab-text" :class="{ 'remove-text': item.index === 4 }">{{ label(item) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shelfTitle from "../../components/shelf/shelfTitle";
import shelfList from "../../components/shelf/shelfList";
import { shelfBookMixin } from "../../utils/mixin";
import Scroll from "../../components/common/Scroll";
import { download } from "../../api/store";
import { saveBookShelf, removeLocalStorage } from "../../utils/localStorage";
import { removeLocalForage } from '../../utils/localForage';

export default {
  mixins: [shelfBookMixin],
  components: {
    shelfTitle,
    Scroll,
    shelfList
  },
  props: {
    data: Object
  },
  computed: {
    isSelected() {
      return this.shelfSelected && this.shelfSelected.length > 0;
    },
    tab() {
      return [
        {
          label: this.$t("shelf.private"),
          label2: this.$t("shelf.noPrivate"),
          index: 1
        },
        {
          label: this.$t("shelf.download"),
          label2: this.$t("shelf.delete"),
          index: 2
        },
        {
          label: this.$t("shelf.move"),
          index: 3
        },
        {
          label: this.$t("shelf.remove"),
          index: 4
        }
      ];
    },
    isPrivate() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every(item => item.private);
      }
    },
    isDownload() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every(item => item.cache);
      }
    }
  },
  data() {
    return {
      scrollBottom: 0,
      popupTitle: null
    };
  },
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0;
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    }
  },
  methods: {
    //选择下载的书籍
    async downloadSelectBook() {
      //遍历点击的书籍,将book设置为以缓存状态
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true
        });
      }
    },
    downloadBook(book) {
      //开始下载书籍,弹窗持续显示
      let text = ''
      const toast = this.toast({
        text
      })
      toast.continueShow()
      //resolve 如果是promise实例 返回的是原始数据,
      //reject 
      return new Promise((resolve, reject) => {
        download(book, () => {
          //j将toast remove 每次弹窗重新实例化
          toast.remove()
          resolve(book)
        }, reject, progressEvent => {
          const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
          //下载提示进度显示
          const text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
          toast.updateText(text)
        })
      });
    },
    removeDownloadBook() {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(books => {
        books.map(book => {
          book.cache = false
        })
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
      })
    },
    removeBook(book) {
      //移除书籍 先获取书籍内容，在调用removeLocalStorge,removeLocalForage
      return new Promise((resolve) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        removeLocalForage(`${book.fileName}`)
        resolve(book)
      })
    },
    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label;
        case 2:
          return this.isDownload ? item.label2 : item.label;
        default:
          return item.label;
      }
    },
    //隐藏弹窗
    hidePopup() {
      this.popupTitle.hide();
    },
    //私密阅读
    setPrivate() {
      let isPrivate;
      if (this.isPrivate) {
        isPrivate = false;
      } else {
        isPrivate = true;
      }
      this.shelfSelected.forEach(book => {
        book.private = isPrivate;
      });
      this.hidePopup();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList);
      if (isPrivate) {
        this.toast({ text: this.$t("shelf.setPrivateSuccess") }).show();
      } else {
        this.toast({ text: this.$t("shelf.closePrivateSuccess") }).show();
      }
    },
    showPrivate() {
      this.popupTitle = this.popup({
        title: this.isPrivate
          ? this.$t("shelf.closePrivateTitle")
          : this.$t("shelf.setPrivateTitle"),
        btn: [
          {
            text: this.isPrivate
              ? this.$t("shelf.close")
              : this.$t("shelf.open"),
            click: () => {
              this.setPrivate();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            }
          }
        ]
      }).show();
    },
    async setDownload() {
      // let isDownload
      //   if (this.isDownload) {
      // isDownload = false
      // } else {
      // isDownload = true
      // }
      // this.shelfSelected.forEach(book => {
      // book.cache = isDownload
      // this.downloadBook(book)
      // })
      this.hidePopup();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList);
      if (this.isDownload) {
        this.removeDownloadBook()
        this.toast({
          text: this.$t('shelf.removeDownloadSuccess')
        }).show()
      } else {
        await this.downloadSelectBook();
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t('shelf.setDownloadSuccess'))
      }
      //保存修改的书架
      // if (isDownload) {
      //   this.toast({ text: this.$t('shelf.removeDownloadSuccess') }).show()
      // } else {
      //   this.toast({ text: this.$t('shelf.setDownloadSuccess') }).show()
      // }
    },
    showDownload() {
      this.popupTitle = this.popup({
        title: this.isDownload
          ? this.$t("shelf.removeDownloadTitle")
          : this.$t("shelf.setDownloadTitle"),
        btn: [
          {
            text: this.isDownload
              ? this.$t("shelf.delete")
              : this.$t("shelf.open"),
            click: () => {
              this.setDownload();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            }
          }
        ]
      }).show();
    },
    removeSelected() {
      this.shelfSelected.forEach(selected => {
        this.setShelfList(this.shelfList.filter(book => book !== selected));
      });
      this.setShelfSelected([]);
      this.hidePopup();
      this.setIsEditMode();
      saveBookShelf(this.shelfList);
    },
    showRemove() {
      let title;
      if (this.shelfSelected.length === 1) {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          `《${this.shelfSelected[0].title}》`
        );
      } else {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          this.$t("selectedBooks")
        );
      }
      //设置弹窗
      this.popupTitle = this.popup({
        title: title,
        btn: [
          {
            text: this.$t("shelf.removeBook"),
            type: "danger",
            click: () => {
              this.removeSelected();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            }
          }
        ]
      }).show();
    },
    onTabClick(item) {
      if (!this.isSelected) {
        return;
      }
      switch (item.index) {
        case 1:
          this.showPrivate();
          break;
        case 2:
          this.showDownload();
          break;
        case 3:
          this.dialog().show()
          break;
        case 4:
          this.showRemove();
          break;
        default:
          break;
      }
    },
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    },
  },
  mounted() {
    // this.getShelfList();
    this.getCategoryList(this.$route.query.title)
    this.setCurrentType(2)
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";

.book-shelf {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  .book-shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .book-shelf-empty {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 110;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        @include columnCenter;
        opacity: 0.5;
        &.is-selected {
          opacity: 1;
        }
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink;
          }
        }
        .icon-shelf {
          color: $color-pink;
        }
      }
    }
  }
}
</style>
