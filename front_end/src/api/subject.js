// import API from './api'
import { appConfigs } from './../configs'
import { feeAjax } from './feeAjax'

export const subjectAPI = {
    getListSubject() {
        let feeUserInfo =JSON.parse(localStorage.getItem('feeUserInfo'))
        let options = {
            method: 'GET',
            crossDomain: true,
            'contentType': 'application/json',
            data: {},
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.subject) + 'get-all',
            headers: {
                authorization: 'Bearer '+ feeUserInfo.access_token
            }
        }
        return feeAjax(options)
    },
    createSubject(name,subjectId,description) {
        let data = {
            name: name,
            subjectId: subjectId,
            description: description,
        };
        let feeUserInfo =JSON.parse(localStorage.getItem('feeUserInfo'))
        console.log(feeUserInfo.access_token)
        console.log(localStorage.getItem('feeUserInfo'))
        let options = {
            method: 'POST',
            crossDomain: true,
            'contentType': 'application/json',
            data: JSON.stringify(data),
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.subject) + 'create/',
            headers: {
                authorization: 'Bearer '+ feeUserInfo.access_token
            }
        }
        console.log(options)
        return feeAjax(options)
    }
}