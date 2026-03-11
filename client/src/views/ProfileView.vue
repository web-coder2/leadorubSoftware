<template>
    <div v-if="userData">
        <h3>{{ title }} {{ userData.email }}</h3>
        <p>Ранк: {{ userData.rankName }}</p>
    </div>

    <Statistics v-if="userData" :userName="userData.name"></Statistics>

</template>

<script>

    import Statistics from '@/components/Statistics.vue';

    export default {
        data() {
            return {
                title: "Личный кабинет",
                userData: null
            }
        },
        components: {
            Statistics
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