<template>
  <div
    class="h-100 w-100"
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    ">
    <HomeUserInfo />
    <div class="home">
      <div class="home-grid-layout">
        <div
          class="home-tab document-title"
          @click="
            () => {
              $router.push('/document');
            }
          ">
          <v-icon class="icon-home-tab" aria-hidden="false">
            mdi-format-list-bulleted-square
          </v-icon>
          <p class="title-home-tab">Văn bản hành chính</p>
        </div>
        <div
          class="home-tab schedular-title"
          @click="
            () => {
              $router.push('/scheduler');
            }
          ">
          <v-icon class="icon-home-tab" aria-hidden="false">
            mdi-calendar
          </v-icon>
          <p class="title-home-tab">Lịch trình</p>
        </div>
        <div class="home-tab news-title">
          <v-icon class="icon-home-tab" aria-hidden="false">
            mdi-newspaper
          </v-icon>
          <p class="title-home-tab">Tin tức</p>
        </div>
        <div
          class="home-tab dashboard-title"
          @click="
            () => {
              $router.push('/dashboard');
            }
          ">
          <v-icon class="icon-home-tab" aria-hidden="false">
            mdi-view-dashboard-outline
          </v-icon>
          <p class="title-home-tab">Báo cáo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import userAPI from "@/api/user";
import HomeUserInfo from "./../components/auth/homeUserInfo.vue";
export default {
  components: {
    HomeUserInfo,
  },
  created() {},
  methods: {},
};
</script>
<style scoped>
.dashboard-title {
  background: #b6f8f1;
}
.dashboard-title:hover {
  background-color: #ff8f6d;
  transition: background-color 1000ms linear;
}
.news-title {
  background: #b6d1e8;
}
.news-title:hover {
  background-color: #ff9ae2;
  transition: background-color 1000ms linear;
}
.document-title {
  background: #ff8383;
}
.document-title:hover {
  background-color: #8acbfa;
  transition: background-color 1000ms linear;
}
.schedular-title {
  background: #ceff89;
}
.schedular-title:hover {
  background-color: #fbff92;
  transition: background-color 1000ms linear;
}
.title-home-tab {
  margin: 0;
  font-size: 20px;
}

.home {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.home-grid-layout {
  display: grid;
  grid-template-columns: auto auto;
}
.home-tab {
  cursor: pointer;
  margin: 20px;
  width: 350px;
  border-radius: 10px;
  height: 80px;
  display: flex;
  align-items: center;
}
.icon-home-tab {
  font-size: 45px !important;
  margin-left: 15px;
  margin-right: 15px;
}
</style>
