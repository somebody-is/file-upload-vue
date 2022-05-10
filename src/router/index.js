import Vue from 'vue'
import Router from 'vue-router'
import SimpleFile from '@/view/SimpleFile'
import BigFile from '@/view/BigFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SimpleFile',
      component: SimpleFile
    },{
      path: '/big',
      name: 'BigFile',
      component: BigFile
    }
  ]
})
