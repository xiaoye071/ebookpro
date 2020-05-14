<template>
  <div class="shelf-search-wrapper" :class="{'search-top':ifInputClicked,'search-hide':ifHideShow}">
    <div class="shelf-search" :class="{'search-top':ifInputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input
            type="text"
            class="seach-input"
            :placeholder="$t('shelf.search')"
            @click="onSearchClick"
            v-model="searchText"
          />
        </div>
        <div class="icon-clear-wrapper" v-show="searchText.length>0" @click="clearSearch">
          <span class="icon-close-circle-fill icon"></span>
        </div>
      </div>
      <div class="icon-clock-wrapper" v-if="!ifInputClicked" @click="switchLocale">
        <span class="icon-cn icon" v-if="lang==='cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-btn">{{$t('shelf.cancel')}}</span>
      </div>
    </div>

    <transition name="shelf-tab-slide-up">
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <div
          class="shelf-search-tab-item"
          v-for="item in tabs"
          :key="item.id"
          @click="onTabClick(item.id)"
        >
          <span
            class="shelf-search-tab-text"
            :class="{'is-selected':item.id===selectedTab}"
          >{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template> 

<script>
import { setLocalStorage } from "../../utils/localStorage"
import { shelfBookMixin } from '../../utils/mixin'
export default {
  mixins: [shelfBookMixin],
  computed: {
    lang() {
      return this.$i18n.locale
    },
    tabs() {
      return [
        {
          id: 1,
          text: this.$t('shelf.default'),
          selected: true
        },
        {
          id: 2,
          text: this.$t('shelf.progress'),
          selected: false
        },
        {
          id: 3,
          text: this.$t('shelf.purchase'),
          selected: false
        }
      ]
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0 && this.ifInputClicked) {
        this.ifHideShadow = false //显示 影阴
      } else {
        this.ifHideShadow = true//隐藏 
      }
    }
  },
  data() {
    return {
      ifHideShow: true,
      ifInputClicked: false,
      searchText: '',
      selectedTab: 1
    }
  },
  methods: {
    onTabClick(id) {
      this.selectedTab = id
      // this.tabs.forEach(tab => {
      //   if (tab.id === item.id) {
      //     tab.selected = true
      //   } else {
      //     tab.selected = false
      //   }
      // })
    },
    clearSearch() {
      this.searchText = ''
    },
    switchLocale() {
      if (this.lang === 'en') {
        this.$i18n.locale = 'cn'
      } else {
        this.$i18n.locale = 'en'
      }
      setLocalStorage('locale', this.$i18n.locale)
    },
    onSearchClick() {
      this.ifInputClicked = true
      this.setShelfTitleVisible(false)
    },
    onCancelClick() {
      this.ifInputClicked = false
      this.setShelfTitleVisible(true)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.shelf-search-wrapper {
  position: absolute;
  z-index: 105;
  width: 100%;
  height: px2rem(94);
  font-size: px2rem(16);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.search-top {
    position: fixed;
    top: 0;
    left: 0;
  }
  &.search-hide {
    box-shadow: none;
  }
  .shelf-search {
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(52);
    display: flex;
    transition: all $animationTime linear;
    &.search-top {
      top: 0;
    }
    .search-wrapper {
      flex: 1;
      display: flex;
      margin: px2rem(8) 0 px2rem(8) px2rem(10);
      border-radius: px2rem(3);
      border: px2rem(1) solid #ccc;
      .icon-search-wrapper {
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        .seach-input {
          width: 100%;
          font-size: px2rem(14);
          border: none;
          color: #333;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper {
        flex: 0 0 px2rem(24);
        @include left;
        .icon-close-circle-fill {
          font-size: px2rem(14);
          color: #ccc;
        }
      }
    }
    .icon-clock-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn,
      .icon-en {
        font-size: px2rem(14);
        color: #666;
      }
    }
    .cancel-btn-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .cancel-btn {
        font-size: px2rem(14);
        color: #666;
      }
    }
  }
  .shelf-search-tab-wrapper {
    position: absolute;
    top: px2rem(52);
    left: 0;
    z-index: 105;
    display: flex;
    width: 100%;
    height: px2rem(42);
    .shelf-search-tab-item {
      flex: 1;
      @include center;
      .shelf-search-tab-text {
        font-size: px2rem(14);
        color: #999;
        &.is-selected {
          color: $color-blue;
          // color: #666;
        }
      }
    }
  }
}
</style>
