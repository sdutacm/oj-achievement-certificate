<template>
    <div class="container">
        <div class="certificate-container">
            <div class="certificate-body">
                <div class="content">
                    <div class="title">
                        <p>获奖证书</p>
                        <h1>Certificate of Sets</h1>
                    </div>

                    <div class="user">
                        <p>恭喜 / Congratulation</p>
                        <div class="nickname"></div>
                        <p>完成 / Complete</p>
                        <div class="comp-title"></div>
                        <div class="rank"></div>
                    </div>
                </div>

                <div class="footer">
                    <div class="certificate-information">
                        Date: <strong>{{ IssueDate }}</strong><br />
                        Certificate ID: <strong>{{ CertificateID }}</strong>
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
    import { ref, onMounted } from 'vue';
    import req from '@/utils/req.js';
    const Logo = ref('default');
    const CertificateID = Date.now().toString();
    const IssueDate = new Date().toISOString().slice(0, 10);
    const userId = ref(0);
    const total = ref(0); //题目总数
    const passCount = ref(0);
    const sets = ref([]);
    const isLogin = ref(undefined);


    const props = defineProps({
        setId: String,
    });
    const setId = Number(props.setId);
    console.log(setId);


    function updateLogo() {
        const params = new URLSearchParams(window.location.search)
        Logo.value = params.get('logo') || 'default'
    }

    async function checkSession() {
        try {
            const data = await req.get("/getSession");
            if (data) {
                userId.value = data.userId;
                console.log(userId.value);
                return true;
            }
        } catch (err) {
            console.error("getSession 检查失败", err);
        }
        return false;
    }

    async function ojLogin() {
        try {
            const res = await req.post("/login", {
                loginName: undefined,
                password: undefined
            });
            console.log("模拟登录成功", res);
            return true;
        } catch (err) {
            console.error("模拟登录失败", err);
            return false;
        }
    }

    async function getProblemData() {
        try {
            const [SetDetail, UserProblemResultStats] = await Promise.all([
                req.post("/getSetDetail", { setId }),
                req.post("/getUserProblemResultStats", { userId:userId.value })
            ]);

            let allProblemsIds = [];
            SetDetail.props.sections.forEach(section => {
                section.problems.forEach(problem => {
                    allProblemsIds.push(problem.problemId);
                });
            });
            total.value = allProblemsIds.length;

            const acceptedProblemIds = UserProblemResultStats.acceptedProblemIds;

            passCount.value = 0;
            allProblemsIds.forEach(item => {
                if (acceptedProblemIds.includes(item)) passCount.value++;
            });
            console.log(passCount.value);
            

            return true;
        } catch (err) {
            console.error("获取题目列表失败", err);
            return false;
        }
    }

    onMounted(async () => {
        updateLogo();
        const loggedIn = await checkSession();
        if(!loggedIn){
            isLogin.value = false;
            ojLogin();
        }else{
            isLogin.value = true;
        }
        await getProblemData();
    });


</script>

<style scoped>
    @import url(../assets/setCer.css);
</style>