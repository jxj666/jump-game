<template>
  <div id="game">
    <h1><img src="../assets/h1.png" alt="placeholder+image"></h1>
    <h3>已有<span>{{people_num}}</span>位参加活动</h3>
    <div class="girl girl_bg1"></div>
    <div class="btn btn_bg1"></div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'Game',
  data() {
    return {
      people_num:0,
    }
  }
}

</script>
<style lang="scss" type="text/css" scoped>
h1 {
  position: absolute;
  width: 100%;
  height: 2.28rem;
  margin: 0 auto;
  top: 1.8rem;
  img {
    height: 100%;
  }
}

h3 {
  position: absolute;
  top: 4.15rem;
  width: 100%;
  margin: 0 auto;
  font-size: 0.36rem;
  color: #fff;
  span {
    font-size: 0.48rem;
    color: #fcef5c;
    margin:0 0.1rem;
  }
}

.girl {
  position: absolute;
  top: 4.7rem;
  left: -0.3rem;
  height: 6rem;
  width: 100%;
}

.girl_bg1 {
  background: url(../assets/maxp1.png) no-repeat center center;
  background-size: contain;
}

.btn {
  position: absolute;
  top: 9.5rem;
  width: 100%;
  height: 1.75rem;
}

.btn_bg1 {
  background: url(../assets/start.png) no-repeat center center;
  background-size: contain;
}

</style>
