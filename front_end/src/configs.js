// import { util } from './plugins/util';
const host = 'http://3.26.73.49:8000'
var configs = {
    defaultAvatar: '/img/avatar_default.jpg',
    dataTypeIcon: {
        // icon cho các kiểu dữ liệu: numeric, text, date, datetime, time,
        numeric: 'mdi-numeric',
        text: 'mdi-alphabetical-variant',
        date: 'mdi-calendar-month-outline',
        datetime: 'mdi-calendar-clock',
        time: 'mdi-timer-outline',
        all: 'mdi-table-row'
    },
    maxOpenTab: 15,
    apiDomain: {
        auth: 'auth/',
        document: 'API/document/',
        subject: 'API/subject/',
        scheduler: 'API/scheduler/'
    },
    reformatUrl(obj) {
        for (let key in obj) {
            if (obj[key]) {
                if (typeof obj[key] == 'string') {
                    // obj[key] = util.addEnvToUrl(obj[key]);
                } else if (typeof obj[key] == 'object') {
                    this.reformatUrl(obj[key]);
                }
            }
        }
    },
    getAPIUrl(path) {
        let url = host + '/' + path
        return url
    },
};
// sửa lại url theo môi trường code
configs.reformatUrl(configs.apiDomain);

// Thêm các domain thuộc uniqueApiDomain vào khai báo domain của api
for (let key in configs.uniqueApiDomain) {
    configs.apiDomain[key] = configs.uniqueApiDomain[key];
}

export const appConfigs = configs;
