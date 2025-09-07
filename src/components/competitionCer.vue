<template>
    <div class="container" v-Loading="Loading" element-loading-background="var(--bg-color)">
        <div v-if="competitions === undefined" style="color: var(--font-color);">You haven't joined any competitions yet.</div>
        <div class="certificate-container" v-for="(comp, index) in competitions" :key="index">
            <div class="certificate-body">
                <div class="content">
                    <div class="title">
                        <p>获奖证书</p>
                        <h1>Certificate of Competition</h1>
                    </div>

                    <div class="user"> 

                        <p>恭喜 / Congratulation</p>
                        <div class="nickname">{{ comp.nickname }}</div>
                        <p>获得 / Acquire</p>
                        <div class="rank">第 {{ comp.rank }} 名</div>
                    </div>

                    <div class="comp-title">{{ comp.title }}</div>

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
</template>

<script setup>
    import { ref, onMounted, watch } from "vue";
    import req from "@/utils/req.js";
    const CertificateID = Date.now().toString();
    const competitions = ref();
    const userId = ref(0);
    const isLogin = ref(undefined);
    const Logo = ref('default');
    const Loading = ref(true);
    const permission = ref(0); // 0 为普通用户
    const compTitle = ref("");
    const compDate = ref("");

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
                loginName: 'acm_admin',
                password: 'A5C0M6&sdut__oj'
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
            if (data.ratingHistory) {
                data.ratingHistory.forEach((item) => {
                    competitions.value.push({
                        competitionId: item.competition.competitionId,
                        title: item.competition.title,
                        rank: item.rank,
                        date: item.date,
                        nickname: item.username,
                    });
                });
            } else {
                competitions.value = undefined;
            }
        } catch (err) {
            console.error("获取rating失败", err);
        }
    }

// 管理员查看
    async function getCompetitionDetail(){
        try{
            const data = await req.post("/getCompetitionDetail", {
                competitionId:50
            });
            compTitle.value = data.title;
            compDate.value = data.startAt.slice(0, 10);
        }catch (err) {
            console.error("获取比赛信息失败", err);
        }
    }

    async function getCompetitionRanklist() {
        try{
            const data = await req.post("/getCompetitionRanklist", {
                competitionId:50
            });
            competitions.value = [];
            data.rows.forEach((item) => {
                competitions.value.push({
                    rank: item.rank,
                    nickname: item.user.nickname,
                    title: compTitle.value,
                    date: compDate.value,
                });
            });
        }catch (err) {
            console.error("获取比赛榜单失败", err);
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
        if(permission.value != 0){
            await getCompetitionDetail();
            await getCompetitionRanklist();
        }else{
            await getUserDetail();
        }
        
        Loading.value = false;
    });

    const emit = defineEmits()

    watch([isLogin], () => {
        emit("updateData", {
            isLogin: isLogin.value
        })
    }, { immediate: true }) 
</script>

<style scoped>
    @import url(../assets/competitionCer.css);

</style>