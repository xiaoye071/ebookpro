<template>
  <div>
    <div
      class="search-bar-wrapper"
      :class="{'hide-title':!titlevisible,'hide-shadow':!titleShadow}"
    >
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titlevisible">
          <div class="title-text-wrapper">
            <span class="title-text">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titlevisible}">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titlevisible}">
        <div class="search-bar-blank" :class="{'hide-title':!titlevisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text" class="input" :placeholder="$t('home.hint')" v-model="searchText" />
        </div>
      </div>
    </div>
    <hot-search-list></hot-search-list>
  </div>
</template>

<script type="text/ecmascript-6">
import { homeMixin } from '../../utils/mixin'
import HotSearchList from "./HotSearchList"
export default {
  components: {
    HotSearchList
  },
  mixins: [homeMixin],
  data() {
    return {
      searchText: '',
      titlevisible: true,
      titleShadow: false
    }
  },
  watch: {
    offsetY(offsetY) {
      console.log(offsetY)
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    }
  },
  methods: {
    hideTitle() {
      this.titlevisible = false
    },
    hideShadow() {
      this.titleShadow = false
    },
    showTitle() {
      this.titlevisible = true
    },
    showShadow() {
      this.titleShadow = true
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.search-bar-wrapper {
  position: relative;
  width: 100%;
  height: px2rem(94);
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(42);
    @include center;

    .title-text-wrapper {
      width: 100%;
      font-size: px2rem(14);
      font-weight: bold;
      height: px2rem(42);
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      top: 0;
      right: px2rem(15);
      height: px2rem(42);
      @include center;
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    top: 0;
    left: px2rem(10);
    z-index: 110;
    height: px2rem(42);
    @include center;
    &.hide-title {
      transition: height $animationTime $animationType;
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper {
    position: absolute;
    top: px2rem(42);
    left: 0;
    width: 100%;
    height: px2rem(52);
    display: flex;
    padding: px2rem(5) px2rem(10);
    box-sizing: border-box;
    transition: top $animationTime $animationType;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      width: 100%;
      padding: px2rem(5) px2rem(15);
      background: #f4f4f4;
      border-radius: px2rem(25);
      border: px2rem(1) solid #eee;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        border: none;
        width: 100%;
        height: px2rem(22);
        background: transparent;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #cccccc;
        }
      }
    }
  }
}
</style>
