<template>
  <div id="app">
    <!-- <span class="text">ADSSDDDDDEE</span> -->

    <router-view />
  </div>
</template>

<script>

/*“...”  js  运算符   */
// import {mapGetters} from 'vuex'

// const getters={
//   a:()=>1,
//   b:()=>2,
//   c:()=>3
// }

// function fn(key) {
//   const data={}
//   key.forEach(key => {
//     if(getters.hasOwnProperty(key)){
//       data[key]=getters[key]
//     }
//   });
//   return data
// }
export default {
  computed:{
    // ...mapGetters(['test']),
    // ...fn(['a','b','c'])
  },
  mounted() {
    // this.$store.dispatch("setTest", 9).then(() => {
      // console.log(this.test)
      // console.log(this.$store.state.book.test);
    // });
    // console.log(this.a,this.b,this.c)
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const html = document.querySelector("html");
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  html.style.fontSize = fontSize + "px";
});
</script>

<style lang="scss" scoped>

// @import "./assets/style/global"; 
#app{
  width:100%;
  height: 100%;
  overflow: hidden;
}
</style>
