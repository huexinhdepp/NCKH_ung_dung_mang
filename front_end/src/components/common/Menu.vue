<template>
    <div>
        <div class="menu">
            <div>
                <img
                    src="../static/Logo-DH-Cong-nghiep-Ha-Noi.webp"
                    alt=""
                    style="width: 60px; height: 60px; margin-left: 30px"
                />
            </div>
            <div class="menu-options">
                <v-btn
                    color="primary"
                    class="menu-item"
                    @click="() => toRedirect('/')"
                >
                    Trang chính
                </v-btn>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            class="menu-item"
                            v-bind="attrs"
                            v-on="on"
                        >
                            Văn bản hành chính
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item
                            class="menu-item-drop-down"
                            v-for="(item, index) in documentItem"
                            @click="item.handler"
                            :key="index"
                            style="cursor: pointer"
                        >
                            <v-list-item-title>{{
                                item.title
                            }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-btn
                    class="menu-item"
                    color="primary"
                    @click="() => toRedirect('/scheduler')"
                >
                    Lịch trình
                </v-btn>

                <v-btn
                    class="menu-item"
                    color="primary"
                    @click="() => toRedirect('/dashboard')"
                >
                    Báo cáo
                </v-btn>
                <v-btn
                    class="menu-item"
                    color="primary"
                    @click="() => toRedirect('/user-controller')"
                    v-if="isSuperUser"
                >
                    Quản lý tài khoản
                </v-btn>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        let self = this;
        return {
            documentItem: [
                {
                    title: "Danh sách văn bản hành chính",
                    handler() {
                        self.toRedirect("/document");
                    },
                },
                {
                    title: "Tạo mới",
                    handler() {
                        self.toRedirect("/document/config");
                    },
                },
            ],
        };
    },
    computed: {
        isSuperUser() {
            console.log(this.$store.state.user);
            if (this.$store.state.user.user.userInfo) {
                return (
                    this.$store.state.user.user.userInfo.orgChart == "superUser"
                );
            }
            return false;
        },
    },
    methods: {
        toRedirect(name) {
            this.$router.push(name);
        },
    },
};
</script>

<style>
.menu {
    z-index: 1000;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #131236;
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
}
.menu-options {
    color: white;
    font-weight: 700;
    height: 50px;

    display: flex;
    margin-right: 40px;
}
.menu-item {
    background-color: #131236 !important;
}
.menu-item:hover {
    background: rgb(54, 40, 181);
}
.menu-item-drop-down:hover {
    background: rgb(176, 173, 166);
}
.v-menu {
    display: block;
}
</style>
