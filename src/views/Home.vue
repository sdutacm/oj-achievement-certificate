<template>
    <div class="AppContainer">
        <Menu />
        <div class="container">
            <div class="title">
                <h1>OJ Certificate</h1>
                <p class="verson">{{ version }}</p>
            </div>
            <h2>GetStart</h2>
            <p>Select the type of certificate you want to obtain</p>
            <homeBtn />
            <p class="more">More features are under development, so stay tuned... 😊</p>
        </div>

        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>

</template>

<script setup>
    import Menu from '@/components/menu.vue';
    import homeBtn from '@/components/homeBtn.vue';
    
    const version = import.meta.env.VITE_APP_VERSION;
</script>

<style scoped>
    @import url(../assets/Home.css);
</style>