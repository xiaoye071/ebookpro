<template>
  <div class="popup" v-show="popupVisible">
    <transition name="fade">
      <div class="pop-bg" @click.stop.prevent="hide" v-show="popupVisible"></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="pop-wrapper" v-show="visible">
        <div class="pop-title" v-if="title && title.length > 0">{{ title }}</div>
        <div
          class="pop-btn"
          :class="{ danger: item.type === 'danger' }"
          v-for="(item, index) in btn"
          :key="index"
          @click="item.click"
        >{{ item.text }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "popup",
  props: {
    title: String,
    btn: Array
  },
  data() {
    return {
      popupVisible: false,
      visible: false
    };
  },
  methods: {
    show() {
      this.popupVisible = true;
      setTimeout(() => {
        this.visible = true;
      });
    },
    hide() {
      this.visible = false;
      setTimeout(() => {
        this.popupVisible = false;
      }, 200);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  .pop-bg {
    width: 100%;
    height: 100%;
  }
  .pop-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 2000;
    width: 100%;
    background: white;
    .pop-title {
      width: 100%;
      height: px2rem(46);
      font-size: px2rem(14);
      line-height: px2rem(14);
      // overflow: hidden;
      // text-overflow: ellipsis(3);
      // white-space: nowrap;
      padding: px2rem(15);
      color: #999;
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #eee;
      text-align: center;
      @include center;
    }
    .pop-btn {
      width: 100%;
      height: px2rem(60);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(14);
      line-height: px2rem(14);
      color: #666;
      font-weight: bold;
      @include center;
      &.danger {
        // color: $color-pink;
        color: pink;
      }
    }
  }
}
</style>
