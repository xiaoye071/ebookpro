<template>
  <ebook-dialog :title="title" ref="dialog">
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div class="dialog-list-item-wr" v-for="(item, index) in categoryList" :key="index">
        <div
          class="dialog-list-item"
          :class="{'is-add': item.edit  ? item.edit === 1 : false}"
          @click="onGroupClick(item)"
          v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit"
        >
          <div class="dialog-list-item-text">{{item.title}}</div>
          <!-- <div
            class="dialog-list-icon-wrapper"
            v-if="category && item.id ? category.id === item.id : false"
          >-->
          <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id===item.id">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput" />
          <div
            class="dialog-input-clear-wrapper"
            @click="clear"
            v-show="newGroupName && newGroupName.length > 0"
          >
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <div
        class="dialog-btn"
        @click="createNewGroup"
        :class="{'is-empty': newGroupName && newGroupName.length === 0}"
        v-if="ifNewGroup"
      >{{$t('shelf.confirm')}}</div>
    </div>
  </ebook-dialog>
</template>

<script>
import EbookDialog from '../common/Dialog'
import { shelfBookMixin } from '../../utils/mixin'
import { removeFromShelf, appendAddToShelf } from '../../utils/store'
import { saveBookShelf } from '../../utils/localStorage'

export default {
  name: 'group-dialog',
  mixins: [shelfBookMixin],
  components: {
    EbookDialog
  },
  props: {
    // isInGroup: {
    //   type: Boolean,
    //   default: false
    // }
    showNewGroup: {
      type: Boolean,
      default: false
    },
    groupName: String
  },
  computed: {
    isInGroup() {
      return this.currentType === 2
    },
    defaultItem() {
      return this.categoryList.filter(function (item) {
        return item.categoryList
      })
    },
    defaultCategory() {
      return [
        {
          title: this.$t('shelf.newGroup'),
          edit: 1
        },
        {
          title: this.$t('shelf.groupOut'),
          edit: 2
        }
      ]
    },
    category() {
      return this.shelfList.filter(item => item.type === 2)
    },
    categoryList() {
      // console.log(this.category)
      return [...this.defaultCategory, ...this.category]
    },
    title() {
      return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup')
    }
  },
  data() {
    return {
      ifNewGroup: false,
      newGroupName: ''
    }
  },
  methods: {
    show() {
      this.ifNewGroup = this.showNewGroup
      this.newGroupName = this.groupName
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
      setTimeout(() => {
        this.ifNewGroup = false
      }, 200);
    },
    onGroupClick(item) {
      if (item.edit && item.edit === 1) {
        this.ifNewGroup = true
      } else if (item.edit && item.edit === 2) {
        this.moveOutFromGroup(item)
      } else {
        this.moveToGroup(item)
      }
    },
    clear() {
      this.newGroupName = ''
    },
    //移动分组
    moveToGroup(group) {
      //遍历书架中的书,确定当前选中的这本书是否存在,存在 ,过滤掉,在更新书架内容
      this.setShelfList(this.shelfList
        .filter(book => {
          //移出原始书架列表数据
          if (book.itemList) {
            book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
          }
          return this.shelfSelected.indexOf(book) < 0
        }))
        .then(() => {
          if (group && group.itemList) {
            //分组内容合并 当前分组电子书和选中的电子书合并
            group.itemList = [...group.itemList, ...this.shelfSelected]
          }
          //重新给电子书排序
          group.itemList.forEach((item, index) => {
            item.id = index + 1
          })
          this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
          this.onComplete()
        })
    },
    moveOutFromGroup() {
      //1.过滤电子书 2.电子书添加到书架页面最后 先移除在合并
      // this.setShelfList(this.shelfList.map(book => {
      //   if (book.type === 2 && book.itemList) {
      //     book.itemList = book.itemList.filter(subBook => !subBook.selected)
      //   }
      //   return book
      // })).then(() => {
      //   //合并 重新计算ID
      //   const list = computedId(appendAddToShelf([].concat(removeFromShelf(this.shelfList), ...this.shelfSelected)))
      //   this.setShelfList(list).then(() => {
      //     this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
      //     this.onComplete()
      //   })
      // })
      this.moveOutOffGroup(this.onComplete)
    },
    //创建分组
    createNewGroup() {
      if (!this.newGroupName || this.newGroupName.length === 0) {
        return
      }
      if (this.showNewGroup) {
        this.shelfCategory.title = this.newGroupName
        this.onComplete()
      } else {
        const group = {
          //
          id: this.shelfList[this.shelfList.length - 2].id + 1,
          itemList: [],
          selected: false,
          title: this.newGroupName,
          type: 2//分组
        }
        //排除加号
        let list = removeFromShelf(this.shelfList)
        list.push(group)
        // list = appendAddToShelf(list)
        // this.setShelfList(list).then(() => {
        //   this.moveToGroup(group)
        // })
        this.setShelfList(appendAddToShelf(list)).then(() => {
          this.moveToGroup(group)
        })
      }
    },
    onComplete() {
      saveBookShelf(this.shelfList)
      this.hide()
      this.setIsEditMode(false)
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";

.dialog-list-wrapper {
  width: 100%;
  padding: 0 px2rem(20);
  box-sizing: border-box;
  font-size: px2rem(14);
  @include scroll;
  .dialog-list-item {
    display: flex;
    padding: px2rem(15) 0;
    box-sizing: border-box;
    color: #666;
    &.is-add {
      color: $color-blue;
      &:active {
        color: $color-blue-transparent;
      }
    }
    &:active {
      color: rgba(102, 102, 102, 0.5);
    }
    .dialog-list-item-text {
      flex: 1;
    }
    .dialog-list-icon-wrapper {
      flex: 0 0 px2rem(30);
      color: $color-blue;
      @include right;
    }
  }
}

.dialog-new-group-wrapper {
  width: 100%;
  padding: 0 px2rem(20);
  box-sizing: border-box;
  .dialog-input-title-wrapper {
    font-size: px2rem(10);
    margin-top: px2rem(20);
  }
  .dialog-input-wrapper {
    width: 100%;
    padding: 0 0 px2rem(30) 0;
    box-sizing: border-box;
    .dialog-input-inner-wrapper {
      display: flex;
      width: 100%;
      padding: px2rem(10) 0;
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(14);
      color: #666;
      .dialog-input {
        flex: 1;
        border: none;
        &:focus {
          outline: none;
        }
      }
      .dialog-input-clear-wrapper {
        flex: 0 0 px2rem(30);
        color: #ccc;
        @include center;
        &:active {
          color: #999;
        }
      }
    }
  }
}

.group-dialog-btn-wrapper {
  width: 100%;
  @include center;
}
.dialog-btn {
  flex: 1;
  &.is-empty {
    color: rgba(255, 255, 255, 0.5);
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
