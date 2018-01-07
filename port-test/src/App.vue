<template>
  <div id="app" v-bind:style="{ height: hightSize+'px'}">
    <router-view/>
  </div>
</template>
<script>
import Game from '@/components/Game'
export default {
  name: 'app',
  data() {
    return {
      hightSize: 800,
    }
  },
  beforeCreate() {
    function get_hfs() {
      document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px'
    }
    get_hfs();
    function throttle(method, context) {
      clearTimeout(method.timer)
      method.timer = setTimeout(function() {
        method.call(context)
      }, 100);
    }
    window.onresize = function() {
      throttle(get_hfs)
    }
    console.log(window.screen.availHeight)
  },
  beforeMount(){
    this.hightSize=window.screen.availHeight
  }
}

</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #7d0011 url(./assets/back.jpg) no-repeat 0 0;
  background-size: 7.5rem auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 0rem;
  margin: 0;
  position: relative;
}

html {
  padding: 0;
  margin: 0;
}

body {
  padding: 0;
  margin: 0;
}

</style>
