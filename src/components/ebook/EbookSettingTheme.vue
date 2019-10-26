<template>
  <transition name="silde-up">
    <div class="setting-wrapper" v-show="titleVisible && visible===1">
      <div class="setting-theme">
        <div
          class="setting-theme-item"
          v-for="(item,index) in themeList"
          :key="index"
          @click="setTheme(index)"
        >
          <div
            class="preview"
            :style="{background:item.style.body.background}"
            :class="{'selected':item.name===defaultTheme}"
          ></div>
          <div class="text" :class="{'selected':item.name===defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import { ebookMixin } from "../../utils/mixin";
import { saveTheme } from '../../utils/localStorage';
export default {
  mixins: [ebookMixin],
  // computed: {
  //   themeList() {
  //     return themeList(this)
  //   }
  // },
  // data() {
  //   return {
  //     // themeList: themeList,
  //     initGobalStyle() {
  //       // addCss('http://127.168.0.1:8081/theme/theme_default.css')
  //       switch (this.defaultTheme) {
  //         case 'Default':
  //           addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  //           break;
  //         case 'Eye':
  //           addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  //           break;
  //         case 'Gold':
  //           addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  //           break;
  //         case 'Night':
  //           addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
  //           break;
  //         default:
  //           addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  //           break;
  //       }
  //     },
  //   }
  // },
  methods: {
    setTheme(index) {
      const theme = this.themeList[index]
      this.setDefaultTheme(theme.name).then(() => {
        this.currentBook.rendition.themes.select(this.defaultTheme)
        this.initGobalStyle()
      })
      saveTheme(this.fileName, theme.name)
    }
  }
}
</script>

<style  lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global.scss";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  z-index: 160;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .setting-theme {
    height: 100%;
    display: flex;
    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(5);
      box-sizing: border-box;
      .preview {
        flex: 1;
        border: px2rem(1) solid #ccc;
        box-sizing: border-box;
        &.selected {
          box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, 0.1);
        }
      }
      .text {
        flex: 0 0 px2rem(20);
        font-size: px2rem(14);
        color: #ccc;
        @include center;
        &.selected {
          color: #333;
        }
      }
    }
  }
}
</style>