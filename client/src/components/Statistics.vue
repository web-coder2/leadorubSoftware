<template>
    <p>Статистика по лидам Личный кабинет {{ userName }}</p>

    <div style="margin-top: 50px; width: 50%;">
        <div class="label"  v-for="(date, index) in leadsWeekData">
            <p>Дата: <strong>{{ index }}</strong></p>
            <p>Кол-во лидов <strong>{{ date.length }}</strong></p>
            <el-progress :text-inside="true" :stroke-width="20" :percentage="getPercentFromAll(date.length)" :format="format" status="success"/>
        </div>
        <h4>Всего лидов за неделю: {{ allLeadsInWeek }}</h4>
    </div>

</template>

<style scoped>
.label {
    display: flex;
    justify-content: space-between;
}

.label p {
    color: var(--el-text-color-secondary);
    margin: 16px 0 8px 0;
    font-size: 15px;
}
</style>

<script>

    import dayjs from 'dayjs';

    export default {
        data() {
            return {
                leadsWeekData: [],
                allLeadsInWeek: 0
            }
        },
        props: {
            userName: {
                type: String,
                required: true,
                default: 'admin'
            }
        },
        methods: {
            async getLeadIntensity() {
                const response = await this.$store.dispatch('getDataList', {
                    col: 'api/leads/intensity',
                    params: {
                        gte: dayjs().startOf('week').format('YYYY-MM-DD'),
                        userName: this.userName,
                    }
                })
                this.leadsWeekData = response.intensity

                for (let date in this.leadsWeekData) {
                    this.allLeadsInWeek += this.leadsWeekData[date].length
                }
            },
            getPercentFromAll(countLeads) {
                return Math.round(countLeads / this.allLeadsInWeek * 100)
            },
        },
        async beforeMount() {
            await this.getLeadIntensity()
        }
    }

</script>