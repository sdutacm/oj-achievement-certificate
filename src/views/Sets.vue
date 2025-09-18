<template>
    <div class="AppContainer">
        <Menu />
        <certificate :setId="setId"/>

        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>
</template>

<script setup>
    import Menu from '@/components/menu.vue';
    import certificate from '@/components/setCer.vue';
    import { useRoute } from "vue-router";
    const route = useRoute();
    const setId = route.params.setId;
</script>

<style scoped>
    @import url(../assets/sets.css);
</style>