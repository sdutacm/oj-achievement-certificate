<template>
    <div class="AppContainer" >
        <Menu :certificateRef="certificateRef" />
        <fallback v-if="certificateData.isLogin === false" class="flexCenter"/>
        <certificate ref="certificateRef" class="certificate flexCenter" @updateData="handleUpdate" v-show="!isMobile && certificateData.isLogin" />
        <!-- 移动端 -->

        <media class="media flexCenter"  v-show="isMobile && certificateData.isLogin" :nickname="certificateData.nickname"
            :totalAchievements="certificateData.totalAchievements" :goldCount="certificateData.goldCount"
            :silverCount="certificateData.silverCount" :copperCount="certificateData.copperCount"
            :certificateRef="certificateRef"/>
        <footer >© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>
    
    <!-- 将组件传送到隐藏容器 -->
    <Teleport to="body">
        <div id="hidden-certificate-container" style="position: absolute; left: -9999px; top: -9999px; pointer-events: none;">
            <certificate ref="hiddenCertificateRef" class="certificate" @updateData="handleUpdate" />
        </div>
    </Teleport>
</template>

<script setup>
    import { ref, reactive, onMounted } from "vue";
    import certificate from '@/components/achieveCer.vue'
    import Menu from '@/components/menu.vue'
    import media from '@/components/achievementMedia.vue';
    import fallback from "@/components/fallback.vue";
    const certificateRef = ref(null);
    const hiddenCertificateRef = ref(null);
    const isMobile = ref(false);

    onMounted(() => {
        isMobile.value = window.innerWidth <= 768
        window.addEventListener("resize", () => {
            isMobile.value = window.innerWidth <= 768
        })
    })

    const certificateData = reactive({
        totalAchievements: 0,
        nickname: "",
        goldCount: 0,
        silverCount: 0,
        copperCount: 0,
        isLogin: false
    })

    function handleUpdate(payload) {
        Object.assign(certificateData, payload)
    }

</script>


<style scoped>
    @import url(../assets/Achievement.css);
</style>