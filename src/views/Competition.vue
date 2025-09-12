<template>
    <div class="AppContainer">
        <Menu :certificateRef="certificateRef" :realName="certificateData.realName" :title="certificateData.title"
            :nickname="certificateData.nickname" />
        <fallback v-if="certificateData.isLogin === false" class="flexCenter" />
        <certificate ref="certificateRef" class="certificate flexCenter" v-show="certificateData.isLogin && !isMobile"
            @updateData="handleUpdate" :competitionId="competitionId" v-Loading="certificateData.Loading" element-loading-background="var(--bg-color)"/>

        <media class="media flexCenter" v-show="certificateData.isLogin && isMobile"
            :competitions="certificateData.competitions" :permission="certificateData.permission" v-Loading="certificateData.Loading" element-loading-background="var(--bg-color)"/>
        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>

    <Teleport to="body">
        <div id="hidden-certificate-container"
            style="position: absolute; left: -9999px; top: -9999px; pointer-events: none;">
            <certificate ref="hiddenCertificateRef" class="certificate" :competitionId="competitionId"  @updateData="handleUpdate" />
        </div>
    </Teleport>
</template>

<script setup>
    import { ref, reactive, onMounted } from "vue";
    import certificate from '@/components/competitionCer.vue';
    import Menu from '@/components/menu.vue';
    import fallback from "@/components/fallback.vue";
    import { useRoute } from "vue-router";
    import media from '@/components/competitionMedia.vue';
    const route = useRoute();
    const certificateRef = ref(null);
    const isMobile = ref(false);
    const hiddenCertificateRef = ref(null);
    const competitionId = route.params.competitionId;

    onMounted(() => {
        isMobile.value = window.innerWidth <= 768
        window.addEventListener("resize", () => {
            isMobile.value = window.innerWidth <= 768
        })
    })

    const certificateData = reactive({
        nickname: [],
        realName: [],
        title: "",
        isLogin: false,
        competitions: [],
        permission: 0,
        Loading: true,
    })

    function handleUpdate(payload) {
        Object.assign(certificateData, payload)
    }
</script>

<style scoped>
    @import url(../assets/Competition.css);
</style>