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
      component: () => import('../views/salaryView.vue')
    },
    {
      path: '/salary',
      name: "salary",
      component: () => import('../views/salaryView.vue')
    },
    {
      path: '/okk',
      name: "okk",
      component: () => import('../views/OKKView.vue')
    },
  ],
})

const userObjectString = localStorage.getItem('userObject');

// Глобальный guard
router.beforeEach((to, from, next) => {
  const userObject = JSON.parse(localStorage.getItem('userObject'));

  if (to.meta.requiresAuth) {
    if (
      !userObject ||
      !userObject.email ||
      !userObject.password
    ) {
      return next({ name: 'login' });
    }
  }

  const rankName = userObject?.rankName;

  if (!rankName) {
    return next({ name: 'login' });
  }

  const adminRoutes = ['home', 'profile', 'leads', 'users', 'salary', 'okk', '']
  const leadorubRoutes = ['home', 'profile', 'salary', 'login', '']
  const holdorubRoutes = ['home', 'profile', 'salary', 'login', '']

  if (rankName === 'admin') {
    return next();
  } else if (rankName === 'leadorub') {
    if ( to.name &&  (leadorubRoutes.includes(to.name))) {
      return next()
    } else {
      return next({ name: 'home' });
    }
  } else if (rankName === 'holdorub') {
    if ( to.name && (holdorubRoutes.includes(to.name))) {
      return next()
    } else {
      return next({ name: 'home' })
    }
  } else {
    return next({ name: 'login' });
  }
});

export default router
