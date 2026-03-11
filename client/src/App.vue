<template>
  <el-container style="height: 100vh;">
    <el-aside v-if="showSidebar" width="200px" style="height: 100vh; background-color: #2d2d2d;">
      <el-menu default-active="1" background-color="transparent" text-color="#fff" active-text-color="#ffd04b" router style="height: 100%; display: flex; flex-direction: column; justify-content: flex-start;">
        <template v-for="(item, index) in menuItems" :key="index">
          <el-menu-item v-if="!item.condition || item.condition()" :index="item.path" :to="item.path">
            <el-icon><component :is="item.icon"></component></el-icon>
            {{ item.label }}
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-main style="height: 100%;">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { User, House, Avatar, Service, Star, View, Money } from '@element-plus/icons-vue'

// Получение route
const route = useRoute()

// Условие отображения сайдбара
const showSidebar = computed(() => route.path !== '/login')

// Получение rankName из localStorage
const userObject = JSON.parse(localStorage.getItem('userObject'));
const rankName = userObject?.rankName || '';

console.log(rankName)

// Массив вкладок
const menuItems = [
  {
    label: 'Выйти',
    path: '/login',
    icon: Avatar,
    condition: null, // всегда показывать
  },
  {
    label: 'Профиль',
    path: '/profile',
    icon: User,
    condition: null,
  },
  {
    label: 'Главная',
    path: '/',
    icon: House,
    condition: null,
  },
  {
    label: 'Лиды',
    path: '/leads',
    icon: Service,
    condition: () => rankName === 'admin',
  },
  {
    label: 'Пользователи',
    path: '/users',
    icon: View,
    condition: () => rankName === 'admin',
  },
  {
    label: 'Зарплатная',
    path: '/salary',
    icon: Money,
    condition: null,
  },
  {
    label: 'ОКК',
    path: '/okk',
    icon: Star,
    condition: () => rankName === 'admin',
  },
]
</script>