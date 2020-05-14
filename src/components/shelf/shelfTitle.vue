<template>
  <transition name="fade">
    <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow':ifHideShadow}">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper left-title" v-if="showClear">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper right-title" v-show="showEdit">
        <span
          class="shelf-title-btn-text"
          @click="onEdit"
        >{{isEditMode?$t('shelf.cancel'):$t('shelf.edit')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper left-title" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        :class="{'left-title':changeGroupLeft,'right-title':changeGroupRight}"
        @click="changeGroup()"
        v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { shelfBookMixin } from "../../utils/mixin"
import { clearLocalStorage, saveBookShelf } from '../../utils/localStorage';
import { clearLocalForage } from '../../utils/localForage';
export default {
  mixins: [shelfBookMixin],
  computed: {
    selectedText() {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
    },
    showBack() {
      return this.currentType === 2 && !this.isEditMode
    },
    showClear() {
      return this.currentType == 1
    },
    showChangeGroup() {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
    },
    changeGroupLeft() {
      return !this.emptyCategory
    },
    changeGroupRight() {
      return this.emptyCategory
    },
    showEdit() {
      return this.currentType === 1 || !this.emptyCategory
    },
    emptyCategory() {
      return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
    },
    popupCancelBtn() {
      return this.createPopupBtn(this.$t('shelf.cancel'), () => {
        this.hidePopup()
      })
    }
  },
  props: {
    title: String,
    // ifShowBack: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      ifHideShadow: true
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false
      } else {
        this.ifHideShadow = true
      }
    }
  },
  methods: {
    onEdit() {
      //处于非编辑模式时,清空之前选中的,并且将其状态去掉
      if (!this.isEditMode) {
        this.setShelfSelected([])
        this.shelfList.forEach(item => {
          item.selected = false
          //勾选按钮 在编辑模式关闭后,勾选状态消失
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        });
      }
      this.setIsEditMode(!this.isEditMode)
    },
    clearCache() {
      clearLocalStorage()
      clearLocalForage()
      this.setShelfList([])
      this.setShelfSelected([])
      this.getShelfList()
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    },
    back() {
      this.$router.go(-1)
      this.setIsEditMode(false)
    },
    changeGroup() {
      this.popMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
            this.changeGroupName()
          }),
          this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
            this.showDeleteGroup()
          }, 'danger'),
          // this.createPopupBtn(this.$t('shelf.cancel'), () => {
          //   this.hidePopup()
          // })
          this.popupCancelBtn
        ]
      }).show()
    },
    hidePopup() {
      this.popMenu.hide()
    },
    onComplete() {
      this.hidePopup()
      this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
        saveBookShelf(this.shelfList)
        this.$router.go(-1)
        this.setIsEditMode(false)
      })
    },
    //1.将分组图书移到至书架列表 2.再删除原本数据
    deleteGroup() {
      if (this.emptyCategory) {
        this.setShelfSelected(this.shelfCategory.itemList)
        this.moveOutOffGroup(this.onComplete)
      } else {
        this.onComplete()
      }
    },
    createPopupBtn(text, onClick, type = 'normal') {
      return {
        text: text,
        click: onClick,
        type: type
      }
    },
    changeGroupName() {
      this.hidePopup()
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show()
    },
    showDeleteGroup() {
      // this.hidePopup()
      this.popMenu = this.popup({
        title: this.$t('shelf.deleteGroupTitle'),
        btn: [
          this.createPopupBtn(this.$t('shelf.confirm'), () => {
            this.deleteGroup()
          }, 'danger'),
          this.popupCancelBtn
        ]
      })
    }
  },
  mounted() {

  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.shelf-title {
  position: relative;
  width: 100%;
  height: px2rem(42);
  background: white;
  z-index: 110;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    z-index: 110;
    @include columnCenter;
    .shelf-title-text {
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text {
      font-size: px2rem(10);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    height: 100%;
    z-index: 115;
    box-sizing: border-box;
    @include center;
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
    }
    .icon-back {
      font-size: px2rem(20);
      color: #666;
    }
    &.left-title {
      left: 0;
      padding-left: px2rem(15);
    }
    &.right-title {
      right: 0;
      padding-right: px2rem(15);
    }
  }
}
</style>
