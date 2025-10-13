<template>
    <div class="AppContainer">
        <Menu :certificateRef="certificateRef" :nickname="certificateData.nickname" :title="certificateData.title"
            :isLogin="certificateData.isLogin" :permission="certificateData.permission" :showDownload="showDownloadBtn"/>
        <div class="back" @click="router.push('/sets')" v-show="!certificateData.Loading">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg><span>back</span>
        </div>
        <fallback v-if="certificateData.isLogin === false" class="flexCenter" />
        <certificate ref="certificateRef" class="certificate flexCenter" v-Loading="certificateData.Loading"
            element-loading-background="var(--bg-color)" :setId="setId" @updateData="handleUpdate"
            v-show="certificateData.isLogin && !isMobile" @updateDownloadVisible="updateDownloadVisible" />

        <Media class="flexCenter" v-show="certificateData.isLogin && isMobile" :permission="certificateData.permission"
            :total="certificateData.total" :sets="certificateData.sets" :title="certificateData.title"
            v-Loading="certificateData.Loading" element-loading-background="var(--bg-color)" />
        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>

    <Teleport to="body">
        <div id="hidden-certificate-container"
            style="position: absolute; left: -9999px; top: -9999px; pointer-events: none;">
            <certificate ref="hiddenCertificateRef" class="certificate" :setId="setId" @updateData="handleUpdate" />
        </div>
    </Teleport>
</template>

<script setup>
    import { ref, reactive, onMounted } from "vue";
    import fallback from "@/components/fallback.vue";
    import Menu from '@/components/menu.vue';
    import certificate from '@/components/setCer.vue';
    import { useRoute, useRouter } from "vue-router";
    import Media from '@/components/setsMedia.vue'
    const route = useRoute();
    const setId = route.params.setId;
    const isMobile = ref(false);
    const certificateRef = ref(null);
    const router = useRouter();
    const showDownloadBtn = ref(false);


    onMounted(() => {
        isMobile.value = window.innerWidth <= 768
        window.addEventListener("resize", () => {
            isMobile.value = window.innerWidth <= 768
        })
    })

    const updateDownloadVisible = (visible) => {
        showDownloadBtn.value = visible;
    };

    const certificateData = reactive({
        Loading: true,
        sets: [],
        isLogin: false,
        permission: 0,
        total: 0,
        nickname: [],
        title: "",
    })

    function handleUpdate(payload) {
        Object.assign(certificateData, payload)
    }
</script>

<style scoped>
    @import url(../assets/sets.css);
</style>