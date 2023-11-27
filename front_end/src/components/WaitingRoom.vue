<template>
    <div></div>
</template>
<script>
import { userAPI } from "@/api/user";
export default {
    async created() {
        this.lastPath = this.$router.history.router.history._startLocation;
        await this.getAllUser();
        window.passWaitingRoom = true;
        this.directToNextPage();
    },
    data() {
        return {
            lastPath: null,
        };
    },
    methods: {
        directToNextPage() {
            if (this.lastPath == "/waiting-room") {
                this.lastPath = "/";
            }
            this.$router.push(this.lastPath);
        },
        async getAllUser() {
            let allUserRes = await userAPI.getAllUserInfo();

            if (allUserRes.status == 200) {
                this.$store.commit("user/setAllUserInfo", allUserRes.data);
            }
        },
    },
};
</script>
