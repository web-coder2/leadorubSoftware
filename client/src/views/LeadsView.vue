<template>
    <h3>Лиды с БД</h3>

    <div class="form-filter">
        <el-input type="date" v-model="gte"></el-input>
        <el-input type="date" v-model="lte"></el-input>
        <el-button @click="fetchLeads" type="info" style="margin-top: 10px;">Применить</el-button>
    </div>

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

</template>


<script>

    import dayjs from 'dayjs'
    import axios from 'axios'

    import Pagination from '../components/Pagination.vue'

    export default {
        data() {
            return {
                gte: dayjs(new Date).format('YYYY-MM-DD'),
                lte: dayjs(new Date).format('YYYY-MM-DD'),
                leadsTableData: [],
                currentData: [],
                rowsInPage: 5,
            }
        },
        components: {
            Pagination
        },
        methods: {
            async fetchLeads() {
                const response = await axios.get('http://localhost:3000/api/leads/get', {
                    params: {
                        gte: this.gte,
                        lte: this.lte
                    }
                })
                this.leadsTableData = response.data.leads
                this.updateCurrentData(1, this.rowsInPage);
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
                this.rowsInPage = rowsInPage;
                this.updateCurrentData(page, rowsInPage);
            },
            updateCurrentData(page, rowsInPage) {
                const start = (page - 1) * rowsInPage;
                this.currentData = this.leadsTableData.slice(start, start + rowsInPage);
            }
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