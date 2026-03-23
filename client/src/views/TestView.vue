<template>

    <h3>{{ title }}</h3>
    <p>для тестов всяких скриптов only ADMIN</p>

    <el-button @click="getDifinityCalls">Проверить совпдаение звонков</el-button>

</template>


<script>

    import dayjs from 'dayjs'

    export default {

        data() {
            return {
                title: 'Тестовая вкладка',
                gte: dayjs(new Date).format('YYYY-MM-DD'),
                lte: dayjs(new Date).format('YYYY-MM-DD'),
            }
        },
        methods: {
            async getDifinityCalls() {
                let response = await this.$store.dispatch('getDataList', {
                    col: 'api/test/diffinity',
                    params: {
                        gte: this.gte,
                        lte: this.lte
                    }
                })
            }
        }

    }


</script>