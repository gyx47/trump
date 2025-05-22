import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import index from '@/components/pages/index'
import test from '@/components/pages/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
   
    {
        path: '/test',
        name: 'test',
        component: test
      },
  ]
})
