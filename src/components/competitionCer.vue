<template>
    <div class="container" >
        <div v-if="competitions.length == 0" style="color: var(--font-color);">You haven't joined this competition.
        </div>
        <div v-else v-for="(comp, index) in competitions" :key="index">
            <div class="certificate-container">
                <div class="certificate-body">
                    <div class="content">
                        <div class="title">
                            <p>获奖证书</p>
                            <h1>Certificate of Competition</h1>
                        </div>

                        <div class="user">
                            <p>恭喜 / Congratulation</p>
                            <div class="nickname">{{ comp.realName || comp.nickname }}</div>
                            <p>获得 / Acquire</p>
                            <div class="comp-title">{{ comp.title }}</div>
                            <div class="rank">第 {{ comp.rank }} 名</div>
                        </div>


                        <div class="total">Total <strong>{{ comp.total }}</strong></div>
                    </div>

                    <div class="footer">
                        <div class="certificate-information">
                            Date: <strong>{{ comp.date }}</strong><br />
                            Certificate ID: <strong>{{ CertificateID }}{{ index }}</strong>
                        </div>
                    </div>

                    <div class="left">
                        <div class="top"></div>
                        <div class="bottom"></div>
                        <div class="mid-bottom"></div>
                        <div class="mid-top"></div>
                    </div>

                    <div class="right">
                        <div class="top"></div>
                        <div class="bottom"></div>
                        <div class="logo">
                            <img v-if="Logo === 'zzcz'" src="@/assets/zzcz_logo.png" alt="Logo_zzcz"
                                crossorigin="anonymous" />
                            <img v-else src="@/assets/sdutacm_logo_colorful.png" alt="Default Logo"
                                crossorigin="anonymous" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from "vue";
    import req from "@/utils/req.js";
    const CertificateID = Date.now().toString();
    const competitions = ref([]);
    const userId = ref(0);
    const isLogin = ref(undefined);
    const Logo = ref('default');
    const Loading = ref(true);
    const permission = ref(0); // 0 为普通用户
    const compTitle = ref("");
    const compDate = ref("");

    const props = defineProps({
        competitionId: String,
    });
    const competitionId = Number(props.competitionId);

    function updateLogo() {
        const params = new URLSearchParams(window.location.search)
        Logo.value = params.get('logo') || 'default'
    }


    async function checkSession() {
        try {
            const data = await req.get("/getSession");
            if (data) {
                userId.value = data.userId;
                permission.value = data.permission;
                return true;
            }
        } catch (err) {
            console.error("getSession 检查失败:", err);
        }
        return false;
    }

    async function ojLogin() {
        try {
            const res = await req.post("/login", {
                loginName: undefined,
                password: undefined
            });
            console.log("模拟登录成功:", res);
            return true;
        } catch (err) {
            console.error("模拟登录失败:", err);
            return false;
        }
    }

    // 个人用户查看
    async function getUserDetail() {
        try {
            const data = await req.post("/getUserDetail", {
                userId: userId.value
            });
            competitions.value = [];
            if (data) {
                data.ratingHistory.forEach((item) => {
                    if (item.competition.competitionId === competitionId) {
                        competitions.value.push({
                            competitionId: item.competition.competitionId,
                            title: item.competition.title,
                            rank: item.rank,
                            date: item.date,
                            nickname: data.username,
                            realName: "",
                            total: ""
                        });
                    }
                });
                await getTotalParticipants();
            } else {
                competitions.value = undefined;
            }
        } catch (err) {
            console.error("获取rating失败", err);
        }
    }

    async function getTotalParticipants() {
        try {
            const data = await req.post("/getPublicCompetitionParticipants", { competitionId });
            const userRow = data.rows.find(item => item.userId === userId.value);
            if (userRow) {
                const comp = competitions.value.find(c => c.competitionId === competitionId);
                if (comp) {
                    comp.realName = userRow.info.realName || userRow.info.subname;
                    comp.total = data.count;
                }
            }
        } catch (err) {
            console.error("参赛人员名单获取失败", err);
        }
    }

    // 管理员查看
    async function getCompetitionDetail() {
        try {
            const data = await req.post("/getCompetitionDetail", { competitionId });
            compTitle.value = data.title;
            compDate.value = data.startAt.slice(0, 10);
        } catch (err) {
            console.error("获取比赛信息失败", err);
        }
    }

    async function loadCompetitionData() {
        try {
            const [ranklistRes, participantsRes] = await Promise.all([
                req.post("/getCompetitionRanklist", { competitionId }),
                req.post("/getPublicCompetitionParticipants", { competitionId })
            ]);

            const realNameMap = {};
            participantsRes.rows.forEach(item => {
                realNameMap[item.userId] = item.info.realName || item.info.subname || "";
            });

            competitions.value = ranklistRes.rows.map(item => ({
                competitionId: competitionId,
                rank: item.rank,
                nickname: item.user.nickname,
                userId: item.user.userId,
                title: compTitle.value,
                date: compDate.value,
                total: ranklistRes.count,
                realName: realNameMap[item.user.userId]
            }));
        } catch (err) {
            console.error("获取比赛数据失败", err);
        }
    }

    onMounted(async () => {
        Loading.value = true;
        updateLogo();
        const loggedIn = await checkSession();
        if (!loggedIn) {
            isLogin.value = false;
            ojLogin();
        } else {
            isLogin.value = true;
        }
        if (permission.value == 3) {
            await getCompetitionDetail();
            await loadCompetitionData();
        } else {
            await getUserDetail();
        }
        Loading.value = false;
    });

    const emit = defineEmits()

    watch([isLogin, competitions, compTitle, permission, Loading], () => {
        emit("updateData", {
            isLogin: isLogin.value,
            nickname: competitions.value.map(a => a.nickname),
            realName: competitions.value.map(a => a.realName),
            title: compTitle.value || competitions.value[0]?.title,
            competitions: competitions.value,
            permission: permission.value,
            Loading: Loading.value,
        })
    }, { immediate: true }) 
</script>

<style scoped>
    @import url(../assets/competitionCer.css);

</style>