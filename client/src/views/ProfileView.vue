<template>
    <div v-if="userData">
        <h3>{{ title }} {{ userData.email }}</h3>
        <p>Ранк: {{ userData.rankName }}</p>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                title: "Личный кабинет",
                userData: null
            }
        },
        mounted() {
            const userObjectString = localStorage.getItem('userObject');

            if (userObjectString) {
                this.userData = JSON.parse(userObjectString);
                console.log(this.userData);
            }
        }
    }

</script>