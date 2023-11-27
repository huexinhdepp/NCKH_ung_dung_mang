// import API from './api'
import { appConfigs } from './../configs'
import { feeAjax } from './feeAjax'

// const coreAPI = new API(appConfigs.getAPIUrl(appConfigs.apiDomain.auth))
export const userAPI = {
    login(userName, password) {
        let data = {
            userName: userName,
            password: password
        }
        let options = {
            method: 'POST',
            crossDomain: true,
            data: data,
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.auth) + 'login',
            headers: {}
        }
        return feeAjax(options)
        // return coreAPI.post('login', data)
    },
    getAllUserInfo(){
        let options = {
            method: 'GET',
            data:{},
            crossDomain: true,
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.auth) + 'get-user-infor',
            headers: {}
        }
        return feeAjax(options)
    },
    deleteUser(userId){
        let feeUserInfo =JSON.parse(localStorage.getItem('feeUserInfo'))
        let options = {
            method: 'POST',
            data:{userId:userId},
            headers: {
                authorization: 'Bearer '+ feeUserInfo.access_token
            },
            crossDomain: true,
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.auth) + 'delete-user',
        }
        return feeAjax(options)
    },
    register(userName,userNameDisplay, password, isSuperUser, isStaff){
        // let feeUserInfo =JSON.parse(localStorage.getItem('feeUserInfo'))
        let options = {
            method: 'POST',
            data:{
                "userName":userName,
                "password":password,
                "is_staff":isStaff,
                "is_superuser":isSuperUser,
                "userNameDisplay":userNameDisplay
            },
            headers: {
            },
            crossDomain: true,
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.auth) + 'register',
        }
        return feeAjax(options)
    }
}
