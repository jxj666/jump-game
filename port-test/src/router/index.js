import Vue from 'vue'
import Router from 'vue-router'
import Game from '@/components/Game'
import Jump from '@/components/Jump'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: ' Game',
      component: Game,
    },
    {
      path: '/jump',
      name: ' Jump',
      component: Jump,
    }
  ]
})
