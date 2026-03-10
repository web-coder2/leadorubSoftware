<template>
    <h3>Пользователи</h3>

    <el-table :data="usersArray" style="width: 100%">
        <el-table-column prop="email" label="Логин"></el-table-column>
        <el-table-column prop="name" label="Имя"></el-table-column>
        <el-table-column prop="rankName" label="Ранк"></el-table-column>
        <el-table-column prop="password" label="Пароль"></el-table-column>
        <el-table-column label="Удалить">
            <template #default="{ row }">
                <el-button type="danger" @click="deleteUser(row._id)">Удалить</el-button>
            </template>
        </el-table-column>
    </el-table>

</template>

<script>

    import axios from 'axios';


    export default {
        data() {
            return {
                usersArray: []
            }
        },
        async beforeMount() {
            await this.getUsersList()
        },
        methods: {
            async getUsersList() {
                const response = await axios.get('http://localhost:3000/api/users/getList')

                this.usersArray = response.data.data
            },
            async deleteUser(id) {
                try {

                    const response = await axios.post('http://localhost:3000/api/users/delete', {
                        id: id
                    })

                    console.log(response)

                    await this.getUsersList()

                } catch (e) {
                    console.log(e.message)
                }
            }
        }
    }

</script>