import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import(/* webpackChunkName: "create" */ './views/Create.vue')
    },
    {
      path: '/claim/:packet_id/:code',
      name: 'claim',
      component: () => import(/* webpackChunkName: "claim" */ './views/Claim.vue')
    },
    {
      name: '404',
      path: '/404',
      component: () => import('@/views/NotFound.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
