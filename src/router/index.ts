import { createRouter, createWebHistory } from 'vue-router'
import OnboardingPage from '@/pages/OnboardingPage.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'onboarding',
    component: OnboardingPage,
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
