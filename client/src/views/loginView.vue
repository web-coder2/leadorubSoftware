<template>
    <div class="form-container">
        <h2 align="center">Войти в кабинет</h2>
        <el-input v-model="email" placeholder="Введите email" class="input" clearable></el-input>
        <el-input v-model="password" type="password" placeholder="Введите пароль" class="input" clearable></el-input>
        <el-button type="info" class="login-button" @click="login">Войти</el-button>
    </div>
</template>
  
<script>

    import axios from 'axios';

    export default {
        data() {
            return {
                email: "",
                password: ""
            }
        },
        methods: {
            async login() {
                const response = await axios.post('http://localhost:3000/api/users/auth', {
                    email: this.email,
                    password: this.password
                })


                let responseUser = response.data.user

                if (responseUser.length !== 0) {
                    localStorage.setItem('userObject', JSON.stringify({ email: this.email, password: this.password, rankName: responseUser[0].rankName }));
                    this.$router.push({ name: 'home' });
                }
            }
        }
    }
</script>
  
<style>

.form-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
  
.input {
    width: 100%;
}
  
.login-button {
    width: 100%;
    font-size: 16px;
}

</style>