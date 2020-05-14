<template>
  <div class="shelf-list" :style="{top:shelfListTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{height:itemHeight}"></shelf-item>
        <div class="shelf-list-item-title">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>
 
<script>
import { shelfBookMixin } from '../../utils/mixin'
import shelfItem from './shelfItem'
import { realPx, px2rem } from '../../utils/utils'
export default {
  mixins: [shelfBookMixin],
  components: {
    shelfItem
  },
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: Array
  },
  computed: {
    shelfListTop() {
      return px2rem(this.top) + 'rem'
    },
    itemHeight() {//计算图书的高度
      return ((window.innerWidth - realPx(120)) / 3 / 250 * 350) + 'px'
    }
  },
  watch: {
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/global";
.shelf-list {
  position: absolute;
  // top: px2rem(94);
  left: 0;
  z-index: 100;
  display: flex;
  flex-flow: row wrap; //水平排列且换行
  width: 100%;
  padding: 0 px2rem(15);
  box-sizing: border-box;
  #shelf-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
  }
  .shelf-list-item-wrapper {
    flex: 0 0 33.33%;
    width: 33.33%;
    padding: px2rem(15);
    box-sizing: border-box;
    &.list-leave-active {
      display: none;
    }
    &.list-move {
      transition: transform 0.5s;
    }
    .shelf-list-item-title {
      margin-top: px2rem(5);
    }
  }
}
</style>
