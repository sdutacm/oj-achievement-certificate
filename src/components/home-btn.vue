<template>
    <div class="homeBtn">
        <el-button class="btnCard" @click="router.push('/achievement')" plain>
            <div class="btnContent">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor">
                    <path
                        d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
                </svg>
                <h2>Achievement</h2>
                <p>Get certificates of achievements</p>
            </div>
        </el-button>
        <el-button class="btnCard" @click="router.push('/sets')" plain disabled>
            <div class="btnContent">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor">
                    <path
                        d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-560H160v560Zm40-80h200v-80H200v80Zm382-80 198-198-57-57-141 142-57-57-56 57 113 113Zm-382-80h200v-80H200v80Zm0-160h200v-80H200v80Zm-40 400v-560 560Z" />
                </svg>
                <h2>Sets</h2>
                <p>Get certificates of Sets</p>
            </div>
        </el-button><el-button class="btnCard" @click="router.push('/competition')" plain>
            <div class="btnContent">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor">
                    <path
                        d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z" />
                </svg>
                <h2>Competition</h2>
                <p>Get certificates of competitions</p>
            </div>
        </el-button>
    </div>

</template>

<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter();

</script>

<style scoped>
    @import url(../assets/home-btn.css);

</style>