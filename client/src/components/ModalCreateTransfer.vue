<template>

    <el-button type="success" @click="openModalShow">Создать лид</el-button>



    <el-dialog title="Редактировать пользователя" v-model="isShowModal" width="500px">

        <el-form :model="transferObject" label-width="120px">
            <el-form-item label="Телефон" prop="phone">
                <el-input v-model="transferObject.date" type="date"></el-input>
            </el-form-item>
            <el-form-item label="Телефон" prop="phone">
                <el-input v-model="transferObject.phone"></el-input>
            </el-form-item>
            <el-form-item label="Клиент" prop="client">
                <el-input v-model="transferObject.client"></el-input>
            </el-form-item>
            <el-form-item label="Описание" prop="description">
                <el-input v-model="transferObject.description"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowModal = false">Отмена</el-button>
          <el-button type="primary" @click="saveTransfer">Сохранить</el-button>
        </div>

    </el-dialog>

</template>

<script>

    import dayjs from 'dayjs'

    import { ElMessage } from 'element-plus';


    export default {
        data() {
            return {
                isShowModal: false,
                transferObject: {
                    date: dayjs().format('YYYY-MM-DD'),
                    userName: this.userName,
                    phone: '',
                    client: '',
                    description: ''
                }
            }
        },
        props: {
            userName: {
                type: String,
                required: true
            }
        },
        methods: {
            openModalShow() {
                this.isShowModal = true
            },
            async saveTransfer() {
                try {

                    this.transferObject.date = dayjs(this.transferObject.date).format('YYYY-MM-DD')

                    const response = await this.$store.dispatch('createDataList', {
                        col: "api/transfers/create",
                        data: {
                            transferObject: this.transferObject
                        }
                    })

                    this.isShowModal = false

                    ElMessage({
                        message: 'Трансфер успешно добавлен в БД',
                        type: 'success',
                    });

                } catch (e) {
                    console.log(e.message)
                }
            }
        }
    }

</script>