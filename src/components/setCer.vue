<template>
    <div class="container">
        <div class="select" v-if="permission === 3 && !Loading">
            <el-select v-model="selectedGroupId" placeholder="Select groups" multiple clearable collapse-tags
                :max-collapse-tags="3" style="width: 480px;">
                <el-option v-for="group in Groups" :key="group.groupId" :label="group.name" :value="group.groupId" />
            </el-select>
            <span></span>
            <el-button type="primary" round @click="showCertificates" :loading="btnLoading" >Show All</el-button>
        </div>
        <div v-if="permission !== 3 || showCert" class="Cert" :class="{'top-margin':permission===3}">
            <div v-for="(item, index) in sets" :key="index" >
            <div class="certificate-container">
                <div class="certificate-body">
                    <div class="content">
                        <div class="title">
                            <p>获奖证书</p>
                            <h1>Certificate of Sets</h1>
                        </div>

                        <div class="user">
                            <p>恭喜 / Congratulation</p>
                            <div class="nickname">{{ item.nickname }}</div>
                            <p>完成 / Complete</p>
                            <div class="comp-title">{{ title }}</div>
                            <div class="count">{{ item.passCount }} / {{ total }}</div>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="certificate-information">
                            Date: <strong>{{ IssueDate }}</strong><br />
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
        

    </div>

</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import req from '@/utils/req.js';
    const Logo = ref('default');
    const CertificateID = Date.now().toString();
    const IssueDate = new Date().toISOString().slice(0, 10);
    const userId = ref(0);
    const total = ref(0); //题目总数
    const allProblemsIds = ref([]);
    const sets = ref([]);
    const isLogin = ref(undefined);
    const Loading = ref(true);
    const permission = ref(0);
    const Groups = ref([]);
    const selectedGroupId = ref([]);
    const showCert = ref(false);
    const title = ref("");
    const btnLoading = ref(false);


    const props = defineProps({
        setId: String,
    });
    const setId = Number(props.setId);
    console.log(setId);


    function updateLogo() {
        const params = new URLSearchParams(window.location.search)
        Logo.value = params.get('logo') || 'default'
    }
    let currentNickname;
    async function checkSession() {
        try {
            const data = await req.get("/getSession");
            if (data) {
                userId.value = data.userId;
                permission.value = data.permission;
                currentNickname = data.nickname;
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
                loginName: "acm_admin",
                password: "A5C0M6&sdut__oj",
            });
            console.log("模拟登录成功", res);
            return true;
        } catch (err) {
            console.error("模拟登录失败", err);
            return false;
        }
    }
    // 获取题目集的所有题目
    let userPass;
    async function getProblemData() {
        try {
            const SetDetail = await req.post("/getSetDetail", { setId })
            allProblemsIds.value = [];
            SetDetail.props.sections.forEach(section => {
                section.problems.forEach(problem => {
                    allProblemsIds.value.push(problem.problemId);
                });
            });
            total.value = allProblemsIds.value.length;
            title.value = SetDetail.title;
            userPass = await getUserPassCount(userId.value);
            return true;
        } catch (err) {
            console.error("获取题目列表失败", err);
            return false;
        }
    }
    // 用户完成的题目
    async function getUserPassCount(userId) {
        try {
            const UserProblemResultStats = await req.post("/getUserProblemResultStats", { userId });
            const acceptedProblemIds = UserProblemResultStats.acceptedProblemIds || [];

            let userPassCount = 0;
            allProblemsIds.value.forEach(item => {
                if (acceptedProblemIds.includes(item)) userPassCount++;
            });
            console.log(userPassCount);
            return userPassCount;
        } catch (err) {
            console.error("获取用户完成信息失败", err);
            return 0;
        }
    }
    // 获取 group 中的所有成员
    async function getGroupMembers() {
        try {
            const UserGroups = await req.post("/getUserGroups", { userId: userId.value })
            const FavoriteList = await req.post("/getFavoriteList")

            Groups.value = [];
            if (UserGroups) {
                UserGroups.rows.forEach(item => {
                    Groups.value.push({
                        name: item.name,
                        groupId: item.groupId,
                        members: [],
                    });
                });
            }
            if (FavoriteList) {
                FavoriteList.rows.forEach(item => {
                    Groups.value.push({
                        name: item.target.name,
                        groupId: item.target.groupId,
                        members: [],
                    });
                })
            }
            const request = Groups.value.map(group =>
                req.post("/getGroupMemberList", { groupId: group.groupId })
                    .then(data => {
                        if (data) {
                            group.members = data.rows.map(member => ({
                                userId: member.user.userId,
                                nickname: member.user.nickname,
                            }));
                        }
                    })
            );
            await Promise.all(request);
        } catch (err) {
            console.error("获取 Group 失败", err);
        }
    }

    // 点击 btn 调用
    async function showCertificates() {
        btnLoading.value = true;
        try{
            const selectedGroups = Groups.value.filter(g =>
            selectedGroupId.value.includes(g.groupId)
        );

        let members = [];
        selectedGroups.forEach(group => {
            group.members.forEach(member => {
                members.push(member);
            });
        });
        let results = [];
        for (const item of members) {
            const userPass = await getUserPassCount(item.userId);
            results.push({
                userId: item.userId,
                nickname: item.nickname,
                total: total.value,
                passCount: userPass,
            });
        }
        console.log(results);
        sets.value = results;
        }catch (err) {
            console.error("生成证书失败", err);
        }finally{
            showCert.value = true;
            btnLoading.value = false;
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
        await getProblemData();
        await getGroupMembers();
        if(permission.value !== 3){
            sets.value = [{
                userId: userId.value,
                passCount: userPass,
                nickname: currentNickname,
            }]
        }
        Loading.value = false;
    });


    const emit = defineEmits();

    watch([isLogin, sets, Loading, total, permission, title], () => {
        emit("updateData", {
            isLogin: isLogin.value,
            sets: sets.value,
            Loading: Loading.value,
            permission: permission.value,
            total: total.value,
            nickname: sets.value.map(a => a.nickname),
            title: title.value,
        })
    }, { immediate: true })

</script>

<style scoped>
    @import url(../assets/setCer.css);
</style>