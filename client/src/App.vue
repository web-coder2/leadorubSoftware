<template>
  <el-container style="height: 100vh;">
    <el-aside :width="isShowMenu ? fullSidebarWidth : '60px'" v-if="showSidebar && !isLoading" style="height: 100vh; background-color: #2d2d2d;">
      <el-menu default-active="1" background-color="transparent" text-color="#fff" active-text-color="#ffd04b" router style="height: 100%; display: flex; flex-direction: column; justify-content: flex-start;">
        <template v-for="(item, index) in menuItems" :key="index">
          
          <el-tooltip :content="item.label" :disabled="isShowMenu" placement="right">
            <el-menu-item v-if="!item.condition || item.condition()" :index="item.path" :to="item.path">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span v-if="isShowMenu">{{ item.label }}</span>
            </el-menu-item>
          </el-tooltip>

        </template>
        <el-button @click="isShowMenu =! isShowMenu" circle class="collapse-btn">
          <el-icon>
            <ArrowDown v-if="isShowMenu"/>
            <ArrowRight v-if="!isShowMenu"/>
          </el-icon>
        </el-button>
      </el-menu>
    </el-aside>

    <el-main style="height: 100%;">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style>

.collapse-btn {
  margin-top: auto;
  margin-bottom: 20px;
  background-color: rgb(26, 25, 25) !important;
  width: 30px !important;
  margin-left: calc(50% - 15px);
}

.collapse-btn:hover {
  background-color: rgb(49, 48, 48);
}

</style>

<script>
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { User, House, Avatar, Service, Star, View, Money, Phone, ArrowRight, ArrowDown } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      userObject: null,
      rankName: '',
      route: null,
      menuItems: [],
      isLoading: true,
      isMobile: true,
      isShowMenu: false, // переменая для коллапса сайдбара
    }
  },
  components: {
    ArrowDown,
    ArrowRight
  },
  computed: {
    showSidebar() {
      return this.route.path !== '/login'
    },
    // ширина открытого развернутого сайдбара
    fullSidebarWidth() {
      return this.isMobile ? '100%' : '200px'
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
        // {
        //   label: 'Сверка',
        //   path: '/phones',
        //   icon: Phone,
        //   condition: () => this.rankName === 'admin'
        // }
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