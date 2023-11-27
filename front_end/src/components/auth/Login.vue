<template>
    <div class="container">
        <form @submit.prevent="login">
            <h2 class="mb-4">LOGIN</h2>
            <p>Use your system account</p>
            <div class="input">
                <label for="email"></label>
                <input
                    v-model="userName"
                    class="form-control"
                    type="text"
                    name="email"
                    placeholder="UserName"
                />
            </div>
            <div class="input">
                <label for="password"></label>
                <input
                    v-model="password"
                    class="form-control"
                    type="password"
                    name="password"
                    placeholder="Password"
                />
            </div>
            <div class="alternative-option mt-4">
                <!-- You don't have an account? <span @click="moveToRegister">Register</span> -->
            </div>
            <button type="submit" class="mt-4 btn-pers" id="login_button">
                Login
            </button>
            <div
                class="alert alert-warning alert-dismissible fade show mt-5 d-none"
                role="alert"
                id="alert_1"
            >
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                ></button>
            </div>
        </form>
    </div>
</template>
<style scoped>
.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40rem !important;
    padding: 1.5rem !important;
    box-sizing: border-box;
    border: 1px solid #dadce0;
    -webkit-border-radius: 8px;
    border-radius: 8px;
}
.btn-pers {
    float: right;
    /* padding: 15px; */
    background-color: #add5e6;
    padding-top: 10px;
    padding-left: 20px;
    padding-bottom: 10px;
    padding-right: 20px;
    border-radius: 8px;
    color: #fff;
    font-weight: 600;
}
.btn-pers:hover {
    background-color: #79c7e8;
}
.container .mb-4 {
    margin: 0px 0 -0.125rem;
    padding: 0;
    color: #fff;
    text-align: center;
    color: #202124;
    font-family: "Google Sans", "Noto Sans Myanmar UI", arial, sans-serif;
    font-size: 24px;
    font-weight: 800;
}

.container p {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.1px;
    line-height: 1.5;
    margin-bottom: 25px;
    text-align: center;
}

.container .input {
    position: relative;
}

.container .input input {
    padding: 0.625rem 10px;
    font-size: 1rem;
    letter-spacing: 0.062rem;
    margin-bottom: 1.875rem;
    border: 1px solid #ccc;
    background: transparent;
    border-radius: 4px;
}

.container .input label {
    position: absolute;
    top: 0;
    left: 10px;
    padding: 0.625rem 0;
    font-size: 1rem;
    color: grey;
    pointer-events: none;
    transition: 0.5s;
}

.container .input input:focus ~ label,
.container .input input:valid ~ label,
.container .input input:not([value=""]) ~ label {
    top: -1.125rem;
    left: 10px;
    color: #1a73e8;
    font-size: 0.75rem;
    background-color: white;
    height: 10px;
    padding-left: 5px;
    padding-right: 5px;
}

.container .input input:focus {
    outline: none;
    border: 2px solid #1a73e8;
}

.container input[type="submit"] {
    border: none;
    outline: none;
    color: #fff;
    background-color: #1a73e8;
    padding: 0.625rem 1.25rem;
    cursor: pointer;
    border-radius: 0.312rem;
    font-size: 1rem;
    float: right;
}

.container input[type="submit"]:hover {
    background-color: #287ae6;
    box-shadow: 0 1px 1px 0 rgba(66, 133, 244, 0.45),
        0 1px 3px 1px rgba(66, 133, 244, 0.3);
}

.container .input input:focus ~ label,
.container .input input:valid ~ label,
.container .input input:not([value=""]) ~ label {
    top: -1.125rem;
    left: 10px;
    color: #1a73e8;
    font-size: 0.75rem;
    background-color: white;
    height: 10px;
    padding-left: 5px;
    padding-right: 5px;
}

.container .input input:focus {
    outline: none;
    border: 2px solid #1a73e8;
}
</style>
<script>
//   import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { userAPI } from "@/api/user";

export default {
    name: "login-vue",
    data() {
        return {
            userName: "",
            password: "",
        };
    },
    methods: {
        async login(submitEvent) {
            console.log(submitEvent);
            console.log(this.email, this.password);
            let res = await userAPI.login(this.userName, this.password);
            if (res.status == 200) {
                this.$store.commit("user/setShowUser", res);
                localStorage.feeUserInfo = JSON.stringify(res);
                this.$router.push("/");
            } else {
                console.log("unAuthentication");
            }

            console.log(res);
        },
        moveToRegister() {
            this.$router.push("/register");
        },
    },
};
</script>
