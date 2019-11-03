<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <div class="ebook-popup-title-text">{{$t('book.selectFont')}}</div>
      </div>
      <div class="ebook-popup-list-wraper">
        <div
          class="ebook-popup-item"
          v-for="(item,index) in fontFamilyList"
          :key="index"
          @click="setFontFamily(item.font)"
        >
          <div class="ebook-popup-item-text" :class="{'selected':isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
  

<script>
import { FONT_FAMILY } from "../../utils/book"
import { ebookMixin } from "../../utils/mixin";
import { saveFontFamily } from "../../utils/localStorage";

export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList: FONT_FAMILY
    }
  },
  methods: {
    setFontFamily(font) {
      this.setDefaultFontFamily(font)
      saveFontFamily(this.fileName, font)
      if (font === 'Default') {
        this.currentBook.rendition.themes.font("Times New Roman")
      } else {
        this.currentBook.rendition.themes.font(font)
      }
    },

    isSelected(item) {
      return this.defaultFontFamily === item.font
    },

    hide() {
      this.setFontFamilyVisible(false)
    }

  },
  mounted() {
    // setLocalStorage('a', 1)
    // setLocalStorage('b', 2)
    // removeLocalStorage('a', 1)
    // clearLocalStorage('a', 1)
    // console.log(setLocalStorage(this.fileName))
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/global.scss";
.ebook-popup-list {
  background: white;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba((0), 0, 0, 0.1);
  .ebook-popup-title {
    position: relative;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: px2rem(1) solid #b8b9b8;
    text-align: center;
    .ebook-popup-title-icon {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: 100%;
      font-size: px2rem(16);
      font-weight: bold;
      @include center;
    }
    .ebook-popup-title-text {
      font-size: px2rem(14);
      font-weight: bold;
    }
  }
  .ebook-popup-list-wraper {
    .ebook-popup-item {
      display: flex;
      padding: px2rem(15);
      .ebook-popup-item-text {
        flex: 1;
        font-size: px2rem(14);
        text-align: left;
        &.selected {
          color: #346cb9;
          font-weight: bold;
        }
      }
      .ebook-popup-item-check {
        flex: 1;
        text-align: right;
        font-size: px2rem(14);
        font-weight: bold;
        color: #346cb9;
      }
    }
  }
}
</style>