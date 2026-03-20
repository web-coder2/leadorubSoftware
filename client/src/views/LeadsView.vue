<template>
    <div>
      <h3>Лиды с БД</h3>

      <div class="form-filter">
        <el-input type="date" v-model="gte"></el-input>
        <el-input type="date" v-model="lte"></el-input>

        <el-select v-if="activeTab === 'leads'" style="margin-top:10px" v-model="selectedStatuses" multiple placeholder="Выбрать статус">
          <el-option v-for="status in statusesArray" :label="status" :value="status" :key="status"></el-option>
        </el-select>

        <el-select v-if="activeTab === 'leads'" style="margin-top:10px" v-model="selectedUsers" multiple placeholder="Выбрать юзера">
          <el-option v-for="user in usersArray" :label="user.name" :value="user.name" :key="user._id"></el-option>
        </el-select>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <el-button @click="fetchLeads(); fetchUsersTrasnfers()" type="info">Применить</el-button>
          <el-button @click="resetFilters(); fetchUsersTrasnfers()" type="warning">Сбросить</el-button>
        </div>
      </div>

      <el-button v-if="rankName === 'admin'" style="margin-top: 20px; margin-bottom: 20px" type="success" plain @click="isShowModalCreateLead = true">Создать лид</el-button>
  
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
              <el-table-column prop="commentOKK" label="Коментарий"></el-table-column>
              <el-table-column v-if="rankName === 'admin'" prop="selfLeadName" label="Сам перевел" />
              <el-table-column v-if="rankName === 'admin'" prop="broker" label="Брокер"></el-table-column>
              <el-table-column prop="residenceStatus" label="Статус">
                <template #default="{ row }">
                  <el-badge :value="row.residenceStatus" :type="getTypeOfBadge(row.residenceStatus)"></el-badge>
                </template>
              </el-table-column>
              <el-table-column v-if="rankName === 'admin'" prop="price" label="Цена"></el-table-column>
              <el-table-column v-if="rankName === 'admin'" prop="countHold" label="Кол-во холдов">
                <template #default="{ row }">
                    <div style="display: flex; align-items: center">
                      <p>{{ row.countHold }}</p>
                      <el-button v-if="row.offersList.length > 0" @click="openInfoModalLead(row)" circle style="margin-left: 10px">
                        <el-icon>
                          <Plus/>
                        </el-icon>
                      </el-button>
                    </div>
                </template>
              </el-table-column>
            </el-table>
  
            <Pagination :tableData="leadsTableData" :rowsInPage="rowsInPage" @page-change="handlePageChange"></Pagination>
          </div>
        </el-tab-pane>
  
        <!-- <el-tab-pane label="ручные лиды" name="another">
            <el-table :data="usersTransfersData" style="width: 100%">
                <el-table-column prop="date" label="Дата"></el-table-column>
                <el-table-column prop="phone" label="Телефон"></el-table-column>
                <el-table-column prop="userName" label="Имя"></el-table-column>
                <el-table-column prop="client" label="Клиент"></el-table-column>
                <el-table-column prop="description" label="Описание"></el-table-column>
                <el-table-column prop="broker" label="Брокер"></el-table-column>
                <el-table-column prop="countHold" label="Кол-во холдов"></el-table-column>
                <el-table-column v-if="rankName === 'admin'" prop="price" label="Цена"></el-table-column>
                <el-table-column prop="residenceStatus" label="статус">
                  <template #default="{ row }">
                    <el-badge :value="row.residenceStatus" :type="getTypeOfBadge(row.residenceStatus)"></el-badge>
                  </template>
                </el-table-column>
                <el-table-column prop="selfTransfer" label="сам перевел"></el-table-column>
                <el-table-column prop="statusOKK" label="ОКК"></el-table-column>
              </el-table>
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <el-dialog title="Информация о системном лиде" v-model="isShowModalLeadInfo" width="700px">
      <h3 style="margin-bottom: 15px;">С этого лида была переведено:</h3>
      <ul style="list-style: none; padding: 0;">
        <li v-for="(item, index) in isShowLeadObjectToModal.offersList" :key="index" style="padding: 10px; margin-bottom: 8px; background-color: #f5f5f5; border-radius: 4px; display: flex; flex-direction: column;">
          <span><strong>Оффер</strong> {{ item.offerName }}</span>
          <span><strong>Цена</strong> {{ item.price }}</span>
          <span><strong>Бркоер</strong> {{ item.broker }}</span>
          <span><strong>Статус</strong> {{ item.status }}</span>
        </li>
      </ul>
    </el-dialog>


    <el-dialog title="Создание системного лида" v-model="isShowModalCreateLead" width="500px">
      <el-form :model="newLeadsObject" label-width="120px">
        <el-form-item label="Дата" prop="date">
          <el-input v-model="newLeadsObject.date" type="date"></el-input>
        </el-form-item>
        <el-form-item label="Брокер" prop="broker">
          <el-input v-model="newLeadsObject.broker"></el-input>
        </el-form-item>
        <el-form-item label="Цена офера" prop="price">
          <el-input v-model="newLeadsObject.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="Телефон" prop="phone">
          <el-input v-model="newLeadsObject.phone"></el-input>
        </el-form-item>
        <el-form-item label="Статус ОКК" prop="statusOKK">
          <el-select v-model="newLeadsObject.statusOKK">
            <el-option :value="true" :label="'Целевой'" />
            <el-option :value="false" :label="'Нецелевой'" />
          </el-select>
        </el-form-item>
        <el-form-item label="сам перевел ?" prop="selfLead">
          <el-select v-model="newLeadsObject.selfLead">
            <!-- <el-option :value="true" :label="'Сам'" />
            <el-option :value="false" :label="'На брокера'" /> -->
            <el-option v-for="item in selfLeadsOptions" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="резиденция" prop="residenceStatus">
          <el-select v-model="newLeadsObject.residenceStatus" placeholder="Выбрать статус">
            <el-option v-for="status in statusesArray" :label="status" :value="status" :key="status"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Кол-во холдов" prop="countHold">
          <el-input v-model="newLeadsObject.countHold"></el-input>
        </el-form-item>
        <el-form-item label="Лидоруб" prop="UserName">
          <FormItemSelect v-if="usersList.length > 0" v-model="newLeadsObject.userName" :options="usersList" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowModalCreateLead = false">Отмена</el-button>
        <el-button type="primary" @click="createHandSytemLead">Сохранить</el-button>
      </div>
    </el-dialog>

</template>
  
<script>
  import dayjs from 'dayjs'
  import axios from 'axios'
  import Pagination from '../components/Pagination.vue'

  import FormItemSelect from '../components/FormItemSelect.vue'
  import { ElMessage } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue'

  
  export default {
    data() {
      return {
        activeTab: 'leads', // активная вкладка
        gte: dayjs(new Date()).format('YYYY-MM-DD'),
        lte: dayjs(new Date()).format('YYYY-MM-DD'),
        leadsTableData: [],
        usersTransfersData: [],
        currentData: [],
        rowsInPage: 10,
        statusesArray: ['hold', 'confirmed', 'refused', 'invalid', 'breaked', 'created'],
        usersArray: [],
        selectedStatuses: null,
        selectedUsers: null,
        isShowModalCreateLead: false,
        isShowModalLeadInfo: false,
        newLeadsObject: {
          date: dayjs().format('YYYY-MM-DD'),
          broker: 'Володя Банкир',
          price: 0,
          phone: '',
          audioArray: [],
          residenceStatus: 'created',
          statusOKK: false,
          selfLead: false,
          userName: '',
          countHold: 0,
        },
        isShowLeadObjectToModal: null,
        usersList: [],
        userObject: null,
        rankName: null,
        selfLeadsOptions: ['Сам', 'На брокера', 'Ручной'],
      }
    },
    components: {
      Pagination,
      FormItemSelect,
      Plus,
    },
    methods: {
      handleTabClick(tab) {
        if (tab.name === 'leads') {
            this.fetchLeads()
        } else if (tab.name === 'another') {
            this.fetchUsersTrasnfers()
        }
      }, 
      openInfoModalLead(lead) {
        this.isShowLeadObjectToModal = lead
        this.isShowModalLeadInfo = true
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
      },
      async fetchAllUsers() {
        try {
          const response = await this.$store.dispatch('getDataList', { col: 'api/users/getList' })
          this.usersList = response.data.map(user => ({
            value: user.name,
            label: user.name
          }));
        } catch (e) {
          console.log(e.message)
        }
      },
      async createHandSytemLead() {
        try {

          this.newLeadsObject.phone = this.newLeadsObject.phone.replace(/\D/g, '')

          const response = await this.$store.dispatch('createDataList', {
            col: 'api/leads/create',
            data: {
              leadObject: this.newLeadsObject
            }
          })

          ElMessage({
            message: 'Лид успешно Создан',
            type: 'success',
          });

        } catch (e) {
          console.log(e.message)
          ElMessage({
            message: `Ошибка при создании лида ${e.message}`,
            type: 'error',
            });
        }
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
        let response = await this.$store.dispatch('getDataList', {
            col: 'api/users/getList'
        })
        this.usersArray = response.data
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
      await this.fetchAllUsers()

      this.userObject = this.$store.getters['getUserObject']
      this.rankName = this.userObject.rankName

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