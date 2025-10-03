<template>
    <div class="AppContainer">
        <Menu />
        <el-table v-if="!Loading" :data="competitions" :show-header="false" @row-click="handleRowClick">
            <el-table-column prop="title" />
            <el-table-column prop="date" class-name="time" :width="columnWidth" />
        </el-table>
        
        <div class="load" v-Loading="Loading" element-loading-background="var(--bg-color)" v-if="Loading">
        </div>
        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>

</template>

<script setup>
    import req from '@/utils/req';
    import { ref, onMounted } from 'vue';
    import { useRouter } from "vue-router";
    const router = useRouter();
    const competitions = ref([]);
    const Loading = ref(true);
    const columnWidth = ref(180);

    async function getCompetitionList() {
        try {
            const data = await req.post("/getCompetitionList", { "page": 1, "order": [["competitionId", "DESC"]], "limit": 20 });
            if (data.rows) {
                data.rows.forEach((item) => {
                    competitions.value.push({
                        title: item.title,
                        competitionId: item.competitionId,
                        date: item.startAt.slice(0, 10),
                    })
                });
            }
        } catch (err) {
            console.error("获取比赛列表失败", err);
        }
    }
    function handleRowClick(row) {
        router.push({
            name: "Competition",
            params: { competitionId: row.competitionId },
        });
    }

    onMounted(async () => {
        Loading.value = true;
        columnWidth.value = window.innerWidth < 768 ? 110 : 180
        window.addEventListener('resize', () => {
            columnWidth.value = window.innerWidth < 768 ? 110 : 180
        })
        await getCompetitionList();
        Loading.value = false;
    })
</script>

<style scoped>
    .AppContainer {
        -webkit-user-select: none;
        user-select: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        width: 100vw;
        background-color: var(--bg-color);
        box-sizing: border-box;
        padding-top: 55px;
    }

    footer {
        margin-top: auto;
        width: 100%;
        height: 50px;
        background-color: var(--footer-bg);
        color: #777;
        font-size: 14px;
        line-height: 50px;
        text-align: center;
    }

    .load {
        width: 80%;
        flex: 1;
    }

    .el-table {
        width: 80%;
        margin: 24px;
    }

    :deep(.el-table .cell) {
        padding-left: 45px;
    }

    :deep(.el-table__row) {
        height: 60px;
    }

    @media screen and (max-width: 768px) {
        :deep(.el-table .cell) {
            padding-left: 15px;
            padding-right: 10px;
        }
    }


</style>