<template>
  <div
    class="shelf-item"
    :class="{'item-shadow':data.type===1 || data.type===2}"
    @click="onItemClick"
  >
    <component
      class="shelf-item-comp"
      :class="{'is-selected':isEditMode && data.type===2}"
      :is="item"
      :data="data"
    ></component>
    <div
      class="icon-selected"
      :class="{'is-selected':data.selected}"
      v-show="isEditMode && data.type===1"
    ></div>
  </div>
</template>

<script>
import { shelfBookMixin } from '../../utils/mixin'
import shelfItemBook from './shelfItemBook'
import shelfItemCategory from './shelfItemCategory'
import shelfItemAdd from './shelfItemAdd'
import { gotoBookHome } from "../../utils/store"
export default {
  mixins: [shelfBookMixin],
  components: {
    shelfItemBook,
    shelfItemCategory,
    shelfItemAdd
  },
  data() {
    return {
      book: shelfItemBook,
      category: shelfItemCategory,
      add: shelfItemAdd
    }
  },
  props: {
    data: Object
  },
  computed: {
    item() {
      return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
    },
  },
  watch: {
  },
  methods: {
    onItemClick() {
      if (this.isEditMode) {
        this.data.selected = !this.data.selected
        if (this.data.selected) {
          this.shelfSelected.pushWithoutDuplicate(this.data)
        } else {
          this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
        }
      } else {
        if (this.data.type === 1) {
          this.showBookDetail(this.data)
        } else if (this.data.type === 2) {
          this.$router.push({
            path: '/store/category',
            query: {
              title: this.data.title,
            }
          })
        } else {
          gotoBookHome(this)
        }
      }

    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/global";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
  }
  .shelf-item-comp {
    opacity: 1;
    .is-selected {
      opacity: 0.5;
    }
  }
  .icon-selected {
    position: absolute;
    bottom: px2rem(5);
    right: px2rem(5);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.4);
    &.is-selected {
      color: rgb(144, 144, 235);
    }
  }
}
</style>
