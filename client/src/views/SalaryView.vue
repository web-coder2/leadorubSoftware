<template>
    <h3>Зарплатная</h3>


    <el-form inline>
        <el-form-item label="Начало">
          <!-- <el-date-picker v-model="gte" type="date" style="width: 200px"/> -->
            <el-input v-model="gte" type="date" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="Конец">
          <!-- <el-date-picker v-model="lte" type="date" style="width: 200px"/> -->
          <el-input v-model="lte" type="date" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="getSalaryData">Применить</el-button>
        </el-form-item>
    </el-form>

    <div style="margin-top: 30px; margin-bottom: 30px">
        <!-- easy buttons -->
        <el-button @click="easyGetSalary('today')">сегодня</el-button>
        <el-button @click="easyGetSalary('yesterday')">вчера</el-button>
    </div>

    <el-button @click="isShowClearCalculation = true" v-if="userRank === 'admin'">Проверить чистую</el-button>

    <el-table :data="salaryTableData" style="width: 100%">
        <el-table-column prop="name" label="Имя"></el-table-column>
        <!-- <el-table-column prop="email" label="Логин"></el-table-column> -->
        <el-table-column prop="countCalls" label="Звонки"></el-table-column>
        <el-table-column v-if="userRole === 'admin'" prop="countCallsWithProfile" label="Звонки из профиля"></el-table-column>
        <el-table-column prop="countLeads" label="Лиды"></el-table-column>
        <el-table-column prop="countTargets" label="Целевые"></el-table-column>
        <el-table-column prop="countHolds" label="Холды"></el-table-column>
        <el-table-column v-if="userRole === 'admin'" prop="sumHold" label="Сумма холдов"></el-table-column>
        <el-table-column prop="salary" label="Зарплата"></el-table-column>
        <el-table-column prop="scriptBonus" label="Бонус"></el-table-column>
        <el-table-column prop="salary + scriptBonus" label="Итого ЗП">
            <template #default="{ row }">
                <p>{{ row.salary + row.scriptBonus }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="clear" label="Чистая"></el-table-column>
        <!-- <el-table-column prop="brokerSalary" label="ЗП брокерам"></el-table-column> -->
    </el-table>
    
</template>


<script>

    import dayjs from 'dayjs'
    import axios from 'axios'

    export default {
        data() {
            return {
                salaryTableData: [],
                gte: dayjs(new Date).format('YYYY-MM-DD'),
                lte: dayjs(new Date).format('YYYY-MM-DD'),
                userObject: null,
                userRole: null,
            }
        },
        methods: {
            async getSalaryData() {
                const response = await this.$store.dispatch('getDataList', {
                    col: 'api/salary/get',
                    params: {
                        gte: dayjs(this.gte).format('YYYY-MM-DD'),
                        lte: dayjs(this.lte).format('YYYY-MM-DD')
                    }
                })
                this.salaryTableData = response.data
            },
            async easyGetSalary(dayMode) {

                if (dayMode === 'today') {
                    this.gte = dayjs(new Date).format('YYYY-MM-DD')
                    this.lte = dayjs(new Date).format('YYYY-MM-DD')
                } else if (dayMode === 'yesterday') {
                    this.gte = dayjs(new Date).subtract(1, 'day').format('YYYY-MM-DD')
                    this.lte = dayjs(new Date).subtract(1, 'day').format('YYYY-MM-DD')
                }

                await this.getSalaryData()

            },
            async getUserStats() {
                this.userObject = this.$store.getters['getUserObject']
                this.userRole = this.userObject.rankName
            }
        },
        async beforeMount() {
            await this.getSalaryData()
            await this.getUserStats()
        }
    }

</script>