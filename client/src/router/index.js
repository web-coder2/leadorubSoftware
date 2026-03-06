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
      path: '/login',
      name: "login",
      component: () => import('../views/loginView.vue')
    }
  ],
})

// Глобальный guard
router.beforeEach((to, from, next) => {
  const userObject = JSON.parse(localStorage.getItem('userObject')); // или другое название ключа

  // Проверяем, нужен ли авторизация
  if (to.meta.requiresAuth) {
    // Проверка наличия email и password
    if (
      !userObject ||
      !userObject.email ||
      !userObject.password ||
      userObject.email === null ||
      userObject.password === null ||
      userObject.email === undefined ||
      userObject.password === undefined
    ) {
      // Перенаправление на логин
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
