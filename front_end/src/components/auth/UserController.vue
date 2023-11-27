<template>
    <div>
        <h1 style="text-align: center">
            Danh sách các tài khoản trong hệ thống
        </h1>
        <div style="display: flex; justify-content: center">
            <v-simple-table style="width: 70%">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">id</th>
                            <th class="text-left">Tên trên hệ thống</th>
                            <th class="text-left">Tên người dùng</th>
                            <th class="text-left">Chức năng trên hệ thống</th>
                            <th class="text-left">ngày tham gia</th>
                            <th class="text-left">ngày tham gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in allUsers" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.userNameDisplay }}</td>
                            <td>{{ item.userName }}</td>
                            <td>
                                {{
                                    item.is_superuser
                                        ? "Quản trị viên"
                                        : item.is_staff
                                        ? "Người dùng phân quyền"
                                        : "Sinh viên"
                                }}
                            </td>
                            <td>
                                {{ dateFormatter(item.date_joined) }}
                            </td>
                            <td>
                                <v-menu offset-y v-if="!item.is_superuser">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on">
                                            mdi mdi-pencil
                                        </v-icon>
                                    </template>
                                    <v-list>
                                        <v-list-item
                                            style="cursor: pointer"
                                            @click="() => deleteUser(item.id)"
                                        >
                                            <v-list-item-title
                                                >Xóa người dùng khỏi hệ
                                                thống</v-list-item-title
                                            >
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div>
            <h3 style="margin-left: 100px; margin-top: 150px">
                Thêm người dùng mới
            </h3>
            <div style="display: flex; justify-content: center">
                <div style="width: 800px">
                    <div style="display: flex; justify-content: space-between">
                        <div>
                            <div class="input">
                                <!-- <label for="email"></label> -->
                                <p>Tên đăng nhập</p>
                                <input
                                    v-model="userName"
                                    class="form-control"
                                    type="text"
                                    name="userName"
                                    placeholder="UserName"
                                />
                            </div>
                            <div class="input">
                                <!-- <label for="email"></label> -->
                                <p>Tên người dùng</p>
                                <input
                                    v-model="userNameDisplay"
                                    class="form-control"
                                    type="text"
                                    name="userName"
                                    placeholder="userNameDisplay"
                                />
                            </div>
                        </div>
                        <div>
                            <div class="input">
                                <p>Mật khẩu</p>
                                <!-- <label for="password"></label> -->
                                <input
                                    v-model="password"
                                    class="form-control"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                />
                            </div>
                            <div class="input">
                                <p>Mật khẩu(xác nhận)</p>
                                <!-- <label for="password"></label> -->
                                <input
                                    v-model="confirmPassword"
                                    class="form-control"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        Người dùng này là:
                        <v-radio-group v-model="permission">
                            <v-radio
                                v-for="(item, i) in rolePermission"
                                :key="i"
                                :label="item.label"
                                :value="item.value"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <v-btn
                        type="submit"
                        class="mt-4 btn-pers"
                        id="login_button"
                        @click="register"
                    >
                        Đăng ký
                    </v-btn>
                    <p v-if="registerSuccessful" style="color: green">
                        Đăng ký thành công
                    </p>
                    <p v-if="userNameExist" style="color: red">
                        Tên đăng nhập đã tồn tại
                    </p>
                    <p v-if="inValidInfo" style="color: red">
                        Thông tin không hợp lệ, vui lòng kiểm tra lại
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import dayjs from "dayjs";
import { userAPI } from "@/api/user";

export default {
    created() {
        if (this.$store.state.user.user.userInfo.orgChart != "superUser") {
            this.$router.push("/");
        }
        this.allUsers = this.$store.state.user.users;
    },
    data() {
        return {
            items: [
                { title: "Click Me" },
                { title: "Click Me" },
                { title: "Click Me" },
                { title: "Click Me 2" },
            ],
            allUsers: [],
            rolePermission: [
                {
                    label: "Người dùng thông thường",
                    value: "user",
                },
                {
                    label: "Người dùng cấp cao",
                    value: "staff",
                },
                {
                    label: "Quyền quản lý",
                    value: "superUser",
                },
            ],
            userName: "",
            userNameDisplay: "",
            password: "",
            confirmPassword: "",
            permission: "",
            registerSuccessful: false,
            userNameExist: false,
            inValidInfo: false,
        };
    },
    methods: {
        async deleteUser(id) {
            let res = await userAPI.deleteUser(id);
            if (res.status == 200) {
                this.allUsers = this.allUsers.filter((u) => u.id != id);
                this.$store.commit("user/setAllUserInfo", this.allUsers);
            }
        },
        dateFormatter(date) {
            return dayjs(date).format("YYYY-MM-DD");
        },
        async register() {
            if (this.password != this.confirmPassword) {
                this.inValidInfo = true;
                setTimeout(() => {
                    this.inValidInfo = false;
                }, 5000);
                return;
            }
            if (
                this.userName != "" &&
                this.userName.length > 8 &&
                this.userNameDisplay != "" &&
                this.permission != ""
            ) {
                let isSuperUser = false;
                let isStaff = false;
                if (this.permission == "superUser") {
                    isSuperUser = true;
                } else if (this.permission == "staff") {
                    isStaff = true;
                }
                let res = await userAPI.register(
                    this.userName,
                    this.userNameDisplay,
                    this.password,
                    isSuperUser,
                    isStaff
                );
                if (res.status == 200) {
                    this.registerSuccessful = true;
                    setTimeout(() => {
                        this.registerSuccessful = false;
                    }, 5000);
                    return;
                } else {
                    this.userNameExist = true;
                    setTimeout(() => {
                        this.userNameExist = false;
                    }, 5000);
                    return;
                }
            }
            this.inValidInfo = true;
            setTimeout(() => {
                this.inValidInfo = false;
            }, 5000);
            return;
        },
    },
};
</script>

<style>
.v-menu {
    display: block;
}
.input {
    width: 350px;
}
</style>
