import Vue from 'vue'
import Router from 'vue-router'
const baseRouters = [
  {
    path: '/404',
    name: 'notFound',
    component: () => import('@/views/error/notFound.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/test.vue'),
  },
  {
    path: '/resume',
    name: 'resume',
    component: () => import('@/views/resume/resume.vue'),
  },
  {
    path: '*',
    redirect: '/404',
  },
]

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  // base: '/common-pc/',
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: baseRouters,
})

export default router
