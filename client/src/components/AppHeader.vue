<template>
    <div class="navbar">
        <div class="navbar-collapse">
            <el-button @click="onClickMenu" circle type="success">
                <el-icon>
                    <Menu />
                </el-icon>
            </el-button>
        </div>
        <div class="navbar-user">
          <el-dropdown placement="bottom-end" trigger="click">
            <div>
              <div>
                <el-button type="success">
                  <el-icon style="vertical-align: middle" :size="20">
                    <User />
                  </el-icon>
                  <span>{{ userName || 'user' }}</span>
                </el-button>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="userView" :icon="iconUser">Профиль</el-dropdown-item>
                <el-dropdown-item @click="logout" :icon="iconClose">Выйти</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
    </div>
</template>


<style>
.navbar {
    height: 20px;
    padding-bottom: 20px;
    color: white;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid gray;
    margin-bottom: 30px;
}
  
.navbar-collapse {
    margin-top: -5px;
}
  
.navbar-user {
    margin-right: 40px;
}
</style>


<script>

    import { User, Menu } from '@element-plus/icons-vue'


    export default {
        data() {
            return {
                title: 'appLayout'
            }
        },
        components: {
            User,
            Menu
        },
        props: {
            userName: {
                type: String,
                required: false,
            },
            onClickMenu: {
                type: Function
            }
        },
        methods: {
            userView() {
                this.$router.push('/profile')
            },
            logout() {
                this.$router.push('/login')
            }
        }
    }

</script>