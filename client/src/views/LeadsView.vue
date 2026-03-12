<template>
    <div>
      <h3>Лиды с БД</h3>

      <div class="form-filter">
        <el-input type="date" v-model="gte"></el-input>
        <el-input type="date" v-model="lte"></el-input>

        <el-select style="margin-top:10px" v-model="selectedStatuses" multiple placeholder="Выбрать статус">
          <el-option v-for="status in statusesArray" :label="status" :value="status" :key="status"></el-option>
        </el-select>

        <el-select style="margin-top:10px" v-model="selectedUsers" multiple placeholder="Выбрать юзера">
          <el-option v-for="user in usersArray" :label="user.name" :value="user.name" :key="user._id"></el-option>
        </el-select>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <el-button @click="fetchLeads" type="info">Применить</el-button>
          <el-button @click="resetFilters" type="warning">Сбросить</el-button>
        </div>
      </div>
  
      <!-- Вкладки для выбора таблицы -->
      <el-tabs v-model="activeTab" style="margin-top: 20px" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="Системные лиды" name="leads">
          <div class="table-data">
            <el-table :data="currentData" style="width: 100%">
              <el-table-column prop="date" label="Дата"></el-table-column>
              <el-table-column prop="phone" label="Телефон"></el-table-column>
              <el-table-column prop="userName" label="Имя"></el-table-column>
              <el-table-column prop="statusOKK" label="Статус ОКК">
                <template #default="{ row }">
                  <p>{{ row.statusOKK ? 'Целевой' : 'Нецелевой' }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="selfLead" label="Сам перевел">
                <template #default="{ row }">
                  <p>{{ row.selfLead ? 'Сам' : 'На брокера' }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="broker" label="Брокер"></el-table-column>
              <el-table-column prop="residenceStatus" label="Статус">
                <template #default="{ row }">
                  <el-badge :value="row.residenceStatus" :type="getTypeOfBadge(row.residenceStatus)"></el-badge>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="Цена"></el-table-column>
              <el-table-column prop="countHold" label="Кол-во холдов"></el-table-column>
            </el-table>
  
            <Pagination :tableData="leadsTableData" :rowsInPage="rowsInPage" @page-change="handlePageChange"></Pagination>
          </div>
        </el-tab-pane>
  
        <el-tab-pane label="ручные лиды" name="another">
            <el-table :data="usersTransfersData" style="width: 100%">
                <el-table-column prop="date" label="Дата"></el-table-column>
                <el-table-column prop="phone" label="Телефон"></el-table-column>
                <el-table-column prop="userName" label="Имя"></el-table-column>
                <el-table-column prop="client" label="Клиент"></el-table-column>
                <el-table-column prop="description" label="Описание"></el-table-column>
              </el-table>

        </el-tab-pane>
      </el-tabs>
    </div>
</template>
  
<script>
  import dayjs from 'dayjs'
  import axios from 'axios'
  import Pagination from '../components/Pagination.vue'
  
  export default {
    data() {
      return {
        activeTab: 'leads', // активная вкладка
        gte: dayjs(new Date()).format('YYYY-MM-DD'),
        lte: dayjs(new Date()).format('YYYY-MM-DD'),
        leadsTableData: [],
        usersTransfersData: [],
        currentData: [],
        rowsInPage: 5,
        statusesArray: ['hold', 'confirmed', 'refused', 'invalid', 'breaked', 'created'],
        usersArray: [],
        selectedStatuses: null,
        selectedUsers: null,
      }
    },
    components: {
      Pagination
    },
    methods: {
      handleTabClick(tab) {
        if (tab.name === 'leads') {
            this.fetchLeads()
        } else if (tab.name === 'another') {
            console.log(12312321)
            this.fetchUsersTrasnfers()
        }
      },
      async fetchLeads() {
        const params = {
          gte: this.gte,
          lte: this.lte,
          statuses: this.selectedStatuses,
          users: this.selectedUsers
        };
  
        const response = await this.$store.dispatch('getDataList', {
          col: 'api/leads/get',
          params: params
        })
  
        this.leadsTableData = response.leads
        this.updateCurrentData(1, this.rowsInPage)

        await this.fetchUsersTrasnfers()

      },
      async fetchUsersTrasnfers() {

        const params = {
            gte: this.gte,
            lte: this.lte,
        };

        let response = await this.$store.dispatch('getDataList', {
            col: 'api/transfers/get',
            params: params
        })

        this.usersTransfersData = response.transfers
      },
      async getUsersList() {
        let response = await axios.get('http://localhost:3000/api/users/getList')
        this.usersArray = response.data.data
      },
      getTypeOfBadge(status) {
        let type
        if (status === 'hold') {
          type = 'success'
        } else if (status === 'created') {
          type = 'info'
        } else if (status === 'invalid') {
          type = 'danger'
        } else if (status === 'breaked') {
          type = 'primary'
        }
        return type
      },
      handlePageChange({ page, rowsInPage }) {
        this.rowsInPage = rowsInPage
        this.updateCurrentData(page, rowsInPage)
      },
      updateCurrentData(page, rowsInPage) {
        const start = (page - 1) * rowsInPage
        this.currentData = this.leadsTableData.slice(start, start + rowsInPage)
      },
      async resetFilters() {
        this.selectedStatuses = null
        this.selectedUsers = null
        this.gte = dayjs().format('YYYY-MM-DD')
        this.lte = dayjs().format('YYYY-MM-DD')
        await this.fetchLeads()
      }
    },
    async beforeMount() {
      await this.getUsersList()
    }
  }
</script>
  
<style>
  .form-filter {
    width: 40% !important;
  }
  .table-data {
    margin-top: 30px;
  }
</style>