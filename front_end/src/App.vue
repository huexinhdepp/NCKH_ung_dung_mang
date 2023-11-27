<template>
    <div id="app">
        <Menu v-if="includeMenu"></Menu>
        <router-view style="padding-top: 100px" />
    </div>
</template>

<script>
import Menu from "./components/common/Menu";
export default {
    created() {
        if (!window.passWaitingRoom && this.includeMenu) {
            this.$router.push("/waiting-room");
        }
        if (localStorage.feeUserInfo) {
            this.$store.commit("user/setStoredUserInfo");
        } else {
            this.$router.push("/login");
        }
    },
    components: {
        Menu,
    },
    computed: {
        includeMenu() {
            if (
                this.$route.name == "waitingRoom" ||
                this.$route.name == "login" ||
                this.$route.name == "repass"
            ) {
                return false;
            }
            return true;
        },
    },
};
</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
    width: 100vw;
}

/* nav a {
  font-weight: bold;
  color: #000000;
  text-decoration: none;
} */

nav a.router-link-exact-active {
    color: #42b983;
}
@import "~bootstrap/dist/css/bootstrap.css";
</style>
<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
</style>

<style>
/* main */
</style>
