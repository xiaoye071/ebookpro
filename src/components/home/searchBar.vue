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
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titlevisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titlevisible}">
        <div class="search-bar-blank" :class="{'hide-title':!titlevisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            type="text"
            class="input"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotsearch"
            @keyup.13.exact="search"
          />
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
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
      titleShadow: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY(offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    search() {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showFlapCard() {
      this.setFlapCardVisible(true)
    },
    back() {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      if (this.hotSearchVisible) {
        this.hideHotsearch()
      } else {
        this.$router.push('/store/shelf')
      }
      this.showTitle()
    },
    hideHotsearch() {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideTitle()
      }
    },
    hideTitle() {
      this.titlevisible = false
    },
    hideShadow() {
      this.titleShadow = false
    },
    showHotsearch() {
      this.hideTitle()
      this.hideShadow()
      this.hotSearchVisible = true
      //当dom加载完毕后,重置
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
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
    z-index: 200;
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
    z-index: 120;
    display: flex;
    height: px2rem(52);
    padding: px2rem(10);
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
      background: #f4f4f4;
      border-radius: px2rem(20);
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        width: 100%;
        height: px2rem(22);
        background: transparent;
        border: none;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color: #666;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          //修改文字 颜色
          color: #cccccc;
        }
      }
    }
  }
}
</style>
