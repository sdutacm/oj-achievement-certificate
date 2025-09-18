<template>
    <div class="AppContainer">
        <Menu />
        <el-table v-Loading="Loading" v-show="!Loading" element-loading-background="var(--bg-color)" :data="sets"
            :show-header="false" @row-click="handleRowClick">
            <el-table-column prop="title" />
            <el-table-column prop="date" class-name="time" :width="columnWidth" />
        </el-table>
        <footer>© 2008-2025 SDUTACM. All Rights Reserved.</footer>
    </div>
</template>

<script setup>
    import req from '@/utils/req';
    import { ref, onMounted } from 'vue';
    import { useRouter } from "vue-router";
    const router = useRouter();
    const sets = ref([]);
    const Loading = ref(true);
    const columnWidth = ref(180);

    async function getSetList() {
        try {
            const data = await req.post("/getSetList", { "page": 1, "order": [["setId", "DESC"]], "limit": 20 });
            if (data.rows) {
                data.rows.forEach((item) => {
                    sets.value.push({
                        title: item.title,
                        setId: item.setId,
                        date: item.createdAt.slice(0, 10),
                    })
                });
            }
        } catch (err) {
            console.err("获取set列表失败", err);
        }
    }

    function handleRowClick(row) {
        router.push({
            name: "Set",
            params: { setId: row.setId },
        });
    }

    onMounted(async () => {
        Loading.value = true;
        await getSetList();
        columnWidth.value = window.innerWidth < 768 ? 110 : 180
        window.addEventListener('resize', () => {
            columnWidth.value = window.innerWidth < 768 ? 110 : 180
        })
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