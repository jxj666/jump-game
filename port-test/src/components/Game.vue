<template>
  <div id="game">
    <h1><img src="../assets/h1.png" alt="placeholder+image"></h1>
    <h3>已有<span>{{people_num}}</span>位参加活动</h3>
    <div class="girl girl_bg1"></div>
    <div class="btn" :class="btn_style" @click='start'></div>
    <div class="pop" v-if="pop">
      <div class="box">
        <div class="info" v-if="!head">友情提示</div>
        <div class="img" v-if="head"><img src="" alt=""></div>
        <div class="msg1">{{msg}}</div>
        <div class="submit">
          <div class="submit_btn" @click='pop=false'>确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import axios from 'axios'
var CryptoJS = require("crypto-js")
export default {
  name: 'Game',
  data() {
    return {
      people_num: 0,
      ready: 1,
      pop: false,
      msg: '',
      head: '',
    }
  },
  computed: {
    btn_style: function() {
      return {
        btn_bg1: this.ready == 1,
        btn_bg2: this.ready == 2,
        btn_bg3: this.ready == 3,
      }
    },
  },
  beforeMount: function() {
    var gamed = sessionStorage.gamed
    var score = sessionStorage.score
    if (gamed) {
      this.link2()
      sessionStorage.gamed = ''
      sessionStorage.score = ''
    } else {
      this.link1()
    }
  },
  methods: {
    link1: function(data1) {
      // if (!data1) {
      //   alert('请输入参数!')
      //   return
      // }
      axios({
          //url: '/act/rule/JS0001DS001?name=authentication',
          url: `https://easy-mock.com/mock/5a4c44876b0cfc253a3f90b0/example/link1`,
          method: 'post',
          data: {
            keyStr: encryptByDES(data1, 'yanzhengyonghu')
          },
          transformRequest: [function(data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function(response) {
          var data = response.data.data
          this.ready = 2
          if (!data.code) {
            this.msg = data.msg
            this.ready = 3
            this.pop = true
          } else if (data.context.msg_code) {
            this.ready = 2
            sessionStorage.user_avatar = data.context.user_avatar
            sessionStorage.username = data.context.username
            this.people_num=data.context.number
            sessionStorage.ready = 2
          } else {
            this.msg = `没有游戏机会!`
            this.ready = 3
            this.pop = true
          }
          console.log(data)
        }.bind(this))
        .catch(function(error) {
          console.log(error);
        })
    },
    link2: function(data1, data2) {
      // if (!data1 || !data2) {
      //   alert('请输入参数!')
      //   return
      // }
      axios({
          //url: '/act/rule/JS0001DS001?name=redpack_redouble',
          url: `https://easy-mock.com/mock/5a4c44876b0cfc253a3f90b0/example/link2`,
          method: 'post',
          data: {
            score: data1,
            openid: data2,

          },
          transformRequest: [function(data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function(response) {
          var data = response.data.data
          console.log(data)
          if (data.code && data.context.msg_code) {
            this.msg = `恭喜${sessionStorage.username}获得${data.context.details[0].productName}`
            this.haed = sessionStorage.user_avatar
            this.pop = true
            this.ready = 3
          } else if (data.code) {
            this.msg = data.context.msg_info
            this.pop = true
            this.ready = 3
          } else {
            this.msg = `获取红包失败`
            this.pop = true
            this.ready = 3
          }
        }.bind(this))
        .catch(function(error) {
          console.log(error)
        })
    },
    start: function() {
      if (this.ready == 2) {
        location.href = '/a/p/jump-game.html'
      } else if (this.ready == 3) {
        alert('尚未添加返回路径!')
      } else {
        alert('还未加载完毕')
      }

    }
  },
}

function encryptByDES(message, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key)
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    iv: keyHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  console.log(encrypted.toString())
  return encrypted.toString()
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
    margin: 0 0.1rem;
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

.btn_bg2 {
  background: url(../assets/start.png) no-repeat center center;
  background-size: contain;
}

.btn_bg1 {
  background: url(../assets/btn_05.png) no-repeat center center;
  background-size: contain;
}

.btn_bg3 {
  background: url(../assets/btn_03.png) no-repeat center center;
  background-size: contain;
}

.pop {
  position: fixed;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .box {
    position: relative;
    width: 6rem;
    height: 6rem;
    background: #fff;
    margin: 30% auto 0;
    border-radius: 0.5rem;
    padding: 0.5rem 0.1rem 0;
    .info {
      font-size: 0.6rem;
      line-height: 2;
      color: red;
      margin-bottom: 0.5rem;
    }
    .img {
      width: 1.5rem;
      height: 1.5rem;
      background: #000;
      margin: 0.5em auto 0.5rem;
      border-radius: 50%;
    }
    .msg1 {
      line-height: 1.5;
      font-size: 0.5rem;
      padding: 0.1rem 0.5rem;
      color: #f00;
    }
    .submit {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.5rem;
      font-size: 0.5rem;
      line-height: 1.5;
      .submit_btn {
        display: inline-block;
        height: 100%;
        width: 2rem;
        background: #f00;
        color: #fff;
        border-radius: 0.1rem;
      }
    }
  }
}

</style>
