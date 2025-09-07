<template>
    <div class="AppContainer">
        <Menu />
        <fallback v-if="certificateData.isLogin === false" class="flexCenter" />
        <certificate ref="certificateRef" class="certificate flexCenter"  v-show="certificateData.isLogin"  @updateData="handleUpdate"/>
        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>
</template>

<script setup>
    import { ref, reactive } from "vue";
    import certificate from '@/components/competitionCer.vue'
    import Menu from '@/components/menu.vue';
    import fallback from "@/components/fallback.vue";
    const certificateRef = ref(null);

    const certificateData = reactive({
        nickname: "",
        isLogin: false,
    })

    function handleUpdate(payload) {
        Object.assign(certificateData, payload)
    }
</script>

<style scoped>
    @import url(../assets/Competition.css);
</style>