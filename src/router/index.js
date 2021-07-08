import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Blog from '../components/blogs/blog.vue'
import Detail from '../components/blogs/detail.vue'
import Message from '../components/message.vue'
import Index from '../components/index.vue'
import Manage from '../components/manage/manage.vue'
import Manageindex from '../components/manage/manage_index.vue'
import Edit from '../components/manage/edit.vue'
import Modify from '../components/manage/modify.vue'
import Post from '../components/manage/post.vue'
import Msgmanage from '../components/manage/msgmanage.vue'
import Person from '../components/manage/person.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', name: 'Index', redirect: '/home', component: Index, children: [{ path: '/home', component: Home }, { path: '/blog', component: Blog }, { path: '/Imessage', component: Message }] },
  { path: '/blog/detail', name: 'Detail', component: Detail },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/Imanage',
    name: 'Manage',
    component: Manage,
    redirect: '/Imanage/Imanage_index',
    children: [
      { path: '/Imanage/Imanage_index', component: Manageindex },
      { path: '/Imanage/Imanage_index/edit', component: Edit },
      { path: '/Imanage/Imanage_index/Imodify', name: 'Modify', component: Modify },
      { path: '/Imanage/Imanage_index/post', component: Post },
      { path: '/Imanage/Imanage_index/Imsg_manage', component: Msgmanage },
      { path: '/Imanage/Imanage_index/person_info', component: Person }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
