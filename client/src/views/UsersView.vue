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
        <el-table-column label="Редактировать">
            <template #default="{ row }">
                <el-button type="success" @click="editUser(row)">Редактировать</el-button>
            </template>
        </el-table-column>
    </el-table>


    <el-dialog title="Редактировать пользователя" v-model="isShowModalEditUser" width="500px">
      <el-form :model="editedUser" label-width="120px">
        <el-form-item label="Логин" prop="email">
          <el-input v-model="editedUser.email"></el-input>
        </el-form-item>
        <el-form-item label="Имя" prop="name">
          <el-input v-model="editedUser.name"></el-input>
        </el-form-item>
        <el-form-item label="Ранк" prop="rankName">
          <el-input v-model="editedUser.rankName"></el-input>
        </el-form-item>
        <el-form-item label="Пароль" prop="password">
          <el-input v-model="editedUser.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowModalEditUser = false">Отмена</el-button>
        <el-button type="primary" @click="saveUser">Сохранить</el-button>
      </div>
    </el-dialog>

</template>

<script>

    import axios from 'axios';
    import { ElMessage } from 'element-plus';

    export default {
        data() {
            return {
                usersArray: [],
                editedUser: null,
                isShowModalEditUser: false,
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

                    ElMessage({
                        message: 'Пользователь успешно удален',
                        type: 'success',
                    });

                    await this.getUsersList()

                } catch (e) {
                    console.log(e.message)
                }
            },
            editUser(userObject) {
                this.editedUser = userObject
                this.isShowModalEditUser = true
            },
            async saveUser() {
                const result = await axios.post('http://localhost:3000/api/users/edit', {
                    editUser: this.editedUser
                })
                this.isShowModalEditUser = false

                ElMessage({
                    message: 'Пользователь успешно обновлен',
                    type: 'success',
                });
            }
        }
    }

</script>