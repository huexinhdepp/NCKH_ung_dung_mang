// import defaultAvatar from '@/assets/image/avatar_default.jpg';

const setAvatarUrl = (state, data) => {
    console.log(state, data)
    // Vue.set(state.userAvatars, data.id, {
    //     loading: data.hasOwnProperty('loading') ? data.loading : true,
    //     url: data.url ? data.url : defaultAvatar,
    // });
};
const setShowUser = (state, data) => {
    console.log(state, data)
    state.user = data;

};
const setStoredUserInfo = (state) => {
    state.user = JSON.parse(localStorage.feeUserInfo)


}
const setAllUserInfo = (state, users) => {
    state.users = users
}

export { setAvatarUrl, setShowUser, setStoredUserInfo,setAllUserInfo };
