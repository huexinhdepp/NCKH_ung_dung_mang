import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginVue from '../components/auth/Login.vue'
import ShowListDocumentVue from '@/components/document/ShowListDocument.vue'
import ConfigDocument from '@/components/document/ConfigDocument.vue'
import EditDocument from '@/components/document/EditDocument.vue'
import AddSubject from '@/components/document/AddSubject.vue'
import VueScheduler from '@/components/scheduler/VueScheduler.vue'
import EditScheduler from '@/components/scheduler/EditScheduler.vue'
import DocumentToDashboard from '@/components/dashboard/DocumentToDashboard.vue'
import DashboardWorkspace from '@/components/dashboard/DashboardWorkspace.vue'
import WaitingRoomVue from '@/components/WaitingRoom.vue'
import UserController from '../components/auth/UserController.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/user-controller',
    name: 'userController',
    component: UserController
  },
  {
    path: '/login',
    name: 'login',
    component: LoginVue
  },
  {
    path: '/document',
    name: 'showListDocument',
    component: ShowListDocumentVue
  },
  {
    path: '/document/config',
    name: 'addDocument',
    component: ConfigDocument
  },
  {
    path: '/document/editDocument/:id',
    name: 'editDocument',
    component: EditDocument
  },
  {
    path: '/dashboard/',
    name: 'listDashboard',
    component: DocumentToDashboard
  },
  {
    path: '/dashboard/workspace/:id',
    name: 'dashboardWorkspace',
    component: DashboardWorkspace
  }, {
    path: '/document/config/addSubject',
    name: 'addSubject',
    component: AddSubject
  },
  {
    path: '/scheduler',
    name: 'MainScheduler',
    component: VueScheduler
  },
  {
    path: '/scheduler/editScheduler/:id',
    name: 'EditScheduler',
    component: EditScheduler
  },
  {
    path: '/waiting-room',
    name: 'waitingRoom',
    component: WaitingRoomVue
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
