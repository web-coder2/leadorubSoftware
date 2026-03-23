<template>
  <el-container style="height: 100vh;">
    <el-aside :width="isMobile ? '60px' : '200px'" v-if="showSidebar && !isLoading" style="height: 100vh; background-color: #2d2d2d;">
      <el-menu default-active="1" background-color="transparent" text-color="#fff" active-text-color="#ffd04b" router style="height: 100%; display: flex; flex-direction: column; justify-content: flex-start;">
        <template v-for="(item, index) in menuItems" :key="index">
          <el-menu-item v-if="!item.condition || item.condition()" :index="item.path" :to="item.path">
            <el-icon><component :is="item.icon"></component></el-icon>
            <span v-if="!isMobile">{{ item.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-main style="height: 100%;">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { User, House, Avatar, Service, Star, View, Money, Check } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      userObject: null,
      rankName: '',
      route: null,
      menuItems: [],
      isLoading: true,
      isMobile: true,
    }
  },
  computed: {
    showSidebar() {
      return this.route.path !== '/login'
    }
  },
  methods: {
    initializeMenu() {
      this.menuItems = [
        {
          label: 'Выйти',
          path: '/login',
          icon: Avatar,
          condition: null,
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
          // condition: () => this.rankName === 'admin',
          condition: null,
        },
        {
          label: 'Пользователи',
          path: '/users',
          icon: View,
          condition: () => this.rankName === 'admin',
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
          condition: () => this.rankName === 'admin',
        },
        {
          label: 'Тест',
          path: '/test',
          icon: Check,
          condition: () => this.rankName === 'admin'
        }
      ]
    }
  },
  async beforeMount() {
    this.route = this.$router.currentRoute
    this.userObject = this.$store.getters['getUserObject']
    this.rankName = this.userObject.rankName
    this.initializeMenu()
    console.log(this.userObject)
    this.isLoading = false

    this.isMobile = window.innerWidth < 480 ? true : false

  }
}
</script>