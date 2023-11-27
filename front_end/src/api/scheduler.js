/* eslint-disable no-unused-vars */
import { appConfigs } from './../configs'
import { feeAjax } from './feeAjax'

export const schedulerAPI = {
    getScheduler(firstday, lastday) {
        let feeUserInfo = JSON.parse(localStorage.getItem('feeUserInfo'))
        // console.log(feeUserInfo)
        let data = {
            start_date: firstday,
            end_date: lastday,
            user_id: feeUserInfo.userInfo.userName,
        };
        let options = {
            method: 'GET',
            crossDomain: true,
            'contentType': 'application/json',
            data: data,
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.scheduler) + 'sessions',
            headers: {
                authorization: 'Bearer ' + feeUserInfo.access_token
            }
        }
        return feeAjax(options)
    },
    createScheduler(classroom_id, date, time_slot, user_applied, classId, note,isOnline, docId) {
        let data = {
            classroom_id: classroom_id,
            date: date,
            time_slot: time_slot,
            user_applied: user_applied,
            classId: classId,
            isOnline:isOnline,
            documentId:docId,
            note:note,
        }
        let feeUserInfo = JSON.parse(localStorage.getItem('feeUserInfo'))
        console.log(feeUserInfo.access_token)
        console.log(localStorage.getItem('feeUserInfo'))
        let options = {
            method: 'POST',
            crossDomain: true,
            'contentType': 'application/json',
            data: JSON.stringify(data),
            url: appConfigs.getAPIUrl(appConfigs.apiDomain.scheduler) + 'create',
            headers: {
                authorization: 'Bearer ' + feeUserInfo.access_token
            }
        }
        console.log(options)
        return feeAjax(options)
    }
}