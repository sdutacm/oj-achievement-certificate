<template>
    <div class="container" v-Loading="Loading" element-loading-background="var(--bg-color)">
        <div class="certificate-container" v-for="(comp, index) in competitions" :key="index">
        <div class="certificate-body" >
                <div class="content">
                    <div class="title">
                        <p>获奖证书</p>
                        <h1>Certificate of Competition</h1>
                    </div>

                    <div class="user">
                        <p>恭喜 / Congratulation</p>
                        <div class="nickname">{{ nickname }}</div>
                        <p>获得 / Acquire</p>
                        <div class="rank">第{{ comp.rank }}名</div>
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
    import { ref, onMounted, computed, watch } from "vue";
    import req from "@/utils/req.js";
    const CertificateID = Date.now().toString();
    const competitions = ref("");
    const nickname = ref("");
    const userId = ref(0);
    const isLogin = ref(undefined);

    async function checkSession() {
        try {
            const data = await req.get("/getSession");
            if (data) {
                nickname.value = data.nickname;
                userId.value = data.userId;
                console.log("nickname", nickname.value);
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
                loginName: '3214984261@qq.com',
                password: 'QWERzxcv123456'
            });
            console.log("模拟登录成功:", res);
            return true;
        } catch (err) {
            console.error("模拟登录失败:", err);
            return false;
        }
    }

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
                    });
                });
            } else {
                competitions.value = "no competition record";
            }
        } catch (err) {
            console.error("获取rating失败", err);
        }
    }


    onMounted(async () => {
        const loggedIn = await checkSession();
        if (!loggedIn) {
            isLogin.value = false;
            ojLogin();
        } else {
            isLogin.value = true;
        }
        await getUserDetail();
    });
</script>

<style scoped>
    @import url(../assets/competitionCer.css);

</style>