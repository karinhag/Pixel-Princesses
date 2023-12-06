import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/createQuestion/:pollId',
      name: 'CreateQuestionView',
      component: () => import('@/views/CreateQuestionView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/chooseAnswer/:id',
      name: 'chooseAnswerView',
      component: () => import('@/views/chooseAnswerView.vue')
    },
  
    {
      path: '/eliminatedPlayer/:id',
      name: 'eliminatedPlayer',
      component:() =>import('@/views/EliminatedPlayerView.vue')
    }

  ]
})

export default router
