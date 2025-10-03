<template>
    <div class="AppContainer">
        <Menu />
        <fallback v-if="certificateData.isLogin === false" class="flexCenter" />
        <certificate ref="certificateRef" class="certificate flexCenter" v-Loading="certificateData.Loading"
            element-loading-background="var(--bg-color)" :setId="setId" @updateData="handleUpdate"
            v-show="certificateData.isLogin && !isMobile" />

        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from "vue";
    import fallback from "@/components/fallback.vue";
    import Menu from '@/components/menu.vue';
    import certificate from '@/components/setCer.vue';
    import { useRoute } from "vue-router";
    const route = useRoute();
    const setId = route.params.setId;
    const isMobile = ref(false);


    onMounted(() => {
        isMobile.value = window.innerWidth <= 768
        window.addEventListener("resize", () => {
            isMobile.value = window.innerWidth <= 768
        })
    })

    const certificateData = reactive({
        Loading: true,
        sets: [],
        isLogin: false,
        permission: 0,
    })

    function handleUpdate(payload) {
        Object.assign(certificateData, payload)
    }
</script>

<style scoped>
    @import url(../assets/sets.css);
</style>