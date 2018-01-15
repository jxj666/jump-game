<template>
  <div id="game">
    <h1 :class="h1_style"><img src="../assets/h1.png" alt="placeholder+image"></h1>
    <h3>已有<span>{{people_num}}</span>位参加活动</h3>
    <div class="girl girl_bg1"></div>
    <div class="btn" :class="btn_style" @click='start'></div>
    <div class="pop1" v-if="pop1">
      <div class="box">
        <div class="info">{{title}}</div>
        <div class="msg1">{{msg}}</div>
        <div class="submit">
          <div class="submit_btn" @click='pop1=false'>确定</div>
        </div>
      </div>
    </div>
    <div class="pop2" v-if="pop2">
      <div class="box">
        <div class="info">{{title2}}</div>
        <div class="list_box1">
          <div class="list1" v-if='lists[0]'>
            <div class="img"><img :src='JSON.parse(lists[0].data).avatar' alt=""></div>
            <h5>{{JSON.parse(lists[0].data).nickname}}</h5>
            <p>{{lists[0].score}}</p>
          </div>
          <div class="list2" v-if='lists[1]'>
            <div class="img"><img :src='JSON.parse(lists[0].data).avatar' alt=""></div>
            <h5>{{JSON.parse(lists[1].data).nickname}}</h5>
            <p>{{lists[1].score}}</p>
            <div class="one"></div>
          </div>
          <div class="list3" v-if='lists[2]'>
            <div class="img"><img :src='JSON.parse(lists[0].data).avatar' alt=""></div>
            <h5>{{JSON.parse(lists[2].data).nickname}}</h5>
            <p>{{lists[3].score}}</p>
          </div>
        </div>
        <div class="list_box2" v-if='lists.length>3'>
          <div class="list" v-for='(x,index) in lists' v-if='index>2'>
            <div class="count">{{index+1}}</div>
            <div class="img"><img :src='JSON.parse(x.data).avatar' alt=""></div>
            <h5>{{JSON.parse(x.data).nickname}}</h5>
            <p>{{x.score}}</p>
          </div>
        </div>
        <div class="close" @click='pop2=false'></div>
      </div>
    </div>
    <div class="list_btn" @click='show_list' :class='list_style'></div>
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
      pop1: false,
      pop2: false,
      msg: '',
      head: '',
      lists: [],
      title: '',
      title2: '',
      h1_start: true,
      h1_shake: false,
      list_shake: false,
      btn_shake: false,
    }
  },
  computed: {
    btn_style() {
      return {
        btn_bg1: this.ready == 1,
        btn_bg2: this.ready == 2,
        btn_bg3: this.ready == 3,
        btn_shake: this.btn_shake == 2 || 3,
      }
    },
    h1_style() {
      return {
        h1_start: this.h1_start == true,
        h1_shake: this.h1_shake == true,
      }
    },
    list_style() {
      return {
        list_shake: this.list_shake == true,
      }
    }
  },
  beforeMount: function() {

    var gamed = sessionStorage.gamed
    var score = sessionStorage.score
    this.people_num = sessionStorage.people_num
    this.link3()
    if (gamed) {
      this.link2()
      sessionStorage.gamed = ''
      sessionStorage.score = ''
    } else {
      this.link1()
    }
    setTimeout(x => this.h1_start = false, 100)
    setTimeout(x => this.h1_shake = true, 1100)
    setTimeout(x => this.list_shake = true, 100)
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
            this.title = '错误提示'
            this.msg = data.msg
            this.ready = 3
            this.pop1 = true
          } else if (data.context.msg_code) {
            this.ready = 2
            sessionStorage.user_avatar = data.context.user_avatar
            sessionStorage.username = data.context.username.length > 7 ? data.context.username.slice(0, 7) + '...' : data.context.username
            sessionStorage.people_num = data.context.number
            this.people_num = data.context.number
            sessionStorage.ready = 2
          } else {
            this.title = ' 错误提示'
            this.msg = `没有游戏机会!`
            this.ready = 3
            this.pop1 = true
          }
          console.log(data)
        }.bind(this))
        .catch(function(error) {
          console.log(error);
        })
    },
    link2: function(data1, data2) {
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
            this.title = '恭喜'
            this.msg = `恭喜${sessionStorage.username}获得${data.context.details[0].productName}`
            this.head = sessionStorage.user_avatar
            this.pop1 = true
            this.ready = 3
          } else if (data.code) {
            this.msg = data.context.msg_info
            this.pop1 = true
            this.ready = 3
          } else {
            this.msg = `获取红包失败`
            this.pop1 = true
            this.ready = 3
          }
        }.bind(this))
        .catch(function(error) {
          console.log(error)
        })
    },
    link3: function(data1, data2) {
      axios({
          //url: '/act/rule/JS0001DS001?name=scores_ranking',
          url: `https://easy-mock.com/mock/5a4c44876b0cfc253a3f90b0/example/link3`,
          method: 'post',
          data: {
            activityId: "JS0004DS004",
            business_id: "JS0004_SCORE",
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
          this.lists = data.context.act_users
          this.title2 = ' TOP ' + data.context.act_users.length
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
    },
    show_list: function() {
      this.pop2 = true

      this.link3()
    },
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
  top: 1.95rem;
  transition: 1s;
  img {
    height: 100%;
  }
}

.h1_start {
  top: 0rem;
}

.h1_shake {
  animation: animation1 .5s;
}

@keyframes animation1 {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(0.8);
  }
}

.list_shake {
  animation: animation2 .5s infinite;
}

@keyframes animation2 {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.btn_shake {
  animation: animation3 .5s infinite;
}

@keyframes animation3 {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
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
  margin-bottom: 0.5rem;
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

.pop1 {
  position: fixed;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .box {
    position: relative;
    width: 7.24rem;
    height: 8.55rem;
    background: url(../assets/pop_03.png) no-repeat center center;
    background-size: contain;
    margin: 20% auto 0;
    border-radius: 0.5rem;
    .info {
      position: relative;
      top: 2rem;
      font-size: 0.4rem;
      color: #333333;
      line-height: 2;
      margin-bottom: 0.5rem;
    }
    .msg1 {
      position: relative;
      top: 2rem;
      line-height: 1.5;
      font-size: 0.48rem;
      padding: 0.1rem 1rem;
      color: #f00;
    }
    .submit {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 2.2rem;
      font-size: 0.5rem;
      line-height: 1.5;
      .submit_btn {
        font-size: 0.34rem;
        line-height: 0.7rem;
        display: inline-block;
        height: 0.78rem;
        width: 4.09rem;
        background: url(../assets/submit.png) no-repeat center center;
        background-size: contain;
        color: #fff;
        border-radius: 0.1rem;
        position: relative;
      }
    }
  }
}

.pop2 {
  position: fixed;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  .box {
    position: relative;
    width: 7.16rem;
    height: 11.67rem;
    background: url(../assets/pop_07.png) no-repeat center center;
    background-size: contain;
    margin: 0rem auto 0;
    border-radius: 0.5rem;
    .close {
      width: 0.76rem;
      height: 0.76rem;
      background: url(../assets/close_03.png) no-repeat center center;
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -0.38rem;
      background-size: contain;
    }
    .info {
      position: relative;
      top: 1.85rem;
      font-size: 0.4rem;
      color: #333333;
      line-height: 2;
      margin-bottom: 0.5rem;
    }
    .list_box1 {
      height: 1.8rem;
      position: absolute;
      left: 0;
      right: 0;
      top: 3.7rem;
      .list1 {
        left: 0.88rem;
      }
      .list2 {
        left: 50%;
        margin-left: -0.9rem;
        top: 0.18rem;
        .one {
          position: absolute;
          width: 0.25rem;
          height: 0.23rem;
          z-index: 110;
          background: url(../assets/one_03.png) no-repeat center center;
          background-size: contain;
          top: -0.1rem;
          right: 0.5rem;
        }
      }
      .list3 {
        right: 0.88rem;
      }
      &>div {
        top: 0.2rem;
        position: absolute;
        width: 1.8rem;
        height: 1.6rem;
        .img {
          line-height: 0;
          width: 0.8rem;
          height: 0.8rem;
          overflow: hidden;
          border-radius: 50%;
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
          }
        }

        h5 {
          margin: 0 auto;
          font-size: 0.22rem;
          color: #333333;
          line-height: 0.22rem;
          margin-top: 0.1rem;
          height: 0.22rem;
          overflow: hidden;
        }
        p {
          margin: 0 auto;
          font-size: 0.26rem;
          color: #ec3f31;
          line-height: 0.26rem;
          margin-top: 0.1rem;
        }
      }
    }
    .list_box2 {
      position: absolute;
      height: 4.25rem;
      overflow: auto;
      width: 100%;
      top: 5.6rem;

      .list {
        width: 85%;
        height: 1.05rem;
        padding: 0;
        margin: 0 auto;
        overflow: hidden;
        line-height: 1.05rem;
        .count {
          width: 1.4rem;
          float: left;
          font-size: 0.48rem;
          color: #ec3f31;
        }
        .img {
          width: 0.8rem;
          height: 0.8rem;
          overflow: hidden;
          border-radius: 50%;
          float: left;
          line-height: 0;
          margin: 0.1rem 0.1rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        h5 {
          float: left;
          width: 2rem;
          margin: 0;
          font-size: 0.26rem;
          font-weight: normal;
          padding: 0 0.2rem;
          text-align: left;
          overflow: hidden;
        }
        p {
          float: left;
          width: 1.2rem;
          margin: 0;
          font-size: 0.32rem;
          color: #ec3f31;
        }
      }
    }
  }
}

.list_btn {
  width: 2.46rem;
  height: 2.71rem;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  background: url(../assets/list_03.png) no-repeat center center;
  background-size: contain;
}

</style>
