<template>
    <Box class="movie-add-form">
        <h3>Yangi kino qo'shish</h3>
        <form class="add-form d-flex" @submit.prevent>
            <Input class="new-movie-label" placeholder="Qanday kino?" v-model="name" />
            <!-- v-on:input="name = $event.target.value" formaga foydalanuvchi tomonidan yozilgan malumotni kodimiz bn sinxronlashtirish -->
            <Input class="new-movie-label" placeholder="Necha marotaba ko'rilgan?" type="number" v-model="viewers" />
            <PrimaryButton class="btn-outline-dark" type="submit" @click="addMovie">Qo'shish</PrimaryButton>
        </form>
    </Box>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            viewers: '',
        }
    },
    methods: {
        addMovie() {
            if (!this.name || !this.viewers) return
            const newMovie = {
                name: this.name,
                viewers: this.viewers,
                favourite: false,
                like: false
            }
            this.$emit('createMovie', newMovie)
            this.name = ""
            this.viewers = ""
        }
    },
    unmounted() { // unmount qilish bu foydalanuvchiga malumotlarni korinmas qilish yani yashirish
        console.log('UNMOUNT');
    }
}
</script>

<style>
.movie-add-form {
    margin-top: 2rem;
}
</style>