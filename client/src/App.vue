<template>
  <el-container style="height: 100vh;">
    <el-aside v-if="showSidebar" width="200px" style="height: 100vh; background-color: #2d2d2d;">
      <el-menu
        default-active="1"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        style="height: 100%; display: flex; flex-direction: column; justify-content: flex-start;"
      >

        <el-menu-item index="/login" :to="'/login'">
          <el-icon>
            <Avatar></Avatar>
          </el-icon>
          Выйти
        </el-menu-item>

        <el-menu-item index="/profile" :to="'/profile'">
          <el-icon>
            <User></User>
          </el-icon>
          Профиль
        </el-menu-item>

        <el-menu-item index="/" :to="'/'">
          <el-icon>
            <House></House>
          </el-icon>
          Главная
        </el-menu-item>

        <el-menu-item index="/leads" :to="'/leads'">
          <el-icon>
            <Service></Service>
          </el-icon>
          Лиды
        </el-menu-item>
        
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
import { User, House, Avatar, Service, Star } from '@element-plus/icons-vue'

const route = useRoute()

const showSidebar = computed(() => route.path !== '/login')
</script>