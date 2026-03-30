import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/leads',
      name: 'leads',
      component: () => import('../views/LeadsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: "login",
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/users',
      name: "users",
      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/salary',
      name: "salary",
      component: () => import('../views/SalaryView.vue')
    },
    {
      path: '/okk',
      name: "okk",
      component: () => import('../views/OKKView.vue')
    },
    // {
    //   path: '/phones',
    //   name: "phones",
    //   component: () => import('../views/PhonesView.vue')
    // }
  ],
})

// Глобальный guard
router.beforeEach((to, from, next) => {
  const userObject = JSON.parse(localStorage.getItem('userObject'));
  const authorized = !!userObject; // true, если есть пользователь

  // Если пользователь не авторизован и он не идет на страницу логина
  if (!authorized && to.path !== '/login') {
    next('/login');
    return;
  }

  // Во всех остальных случаях — разрешаем переход
  next();
});


export default router
