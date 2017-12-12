import {getToken} from 'common/util/storeUtil'

function httpBody(bodyData) {
    return {
        "token": getToken() || "",
        "sitecode": "cine.web",
        "channel": "",
        "locale": "zh_CN",
        "appver": 10000,
        "data": bodyData
    };
}

function toQueryString(obj) {
    let parts = [],
        i;
    for (i in obj) {
        if (obj.hasOwnProperty(i) && obj[i]) {
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return parts.join("&");
}

function request(obj) {

    return new Promise((resolve, reject) => {

        if (obj.params) {
            obj.url += '?' + toQueryString(obj.params);
        }

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText ? JSON.parse(xhr.responseText) : undefined);
                } else {
                    reject(xhr.responseText);
                }
            }
        };
        xhr.open(obj.method, obj.url, true);
        xhr.setRequestHeader("Accept", "application/json");
        if (obj.contentType) {
            xhr.setRequestHeader("Content-Type", obj.contentType);
        }
        xhr.send(obj.data ? JSON.stringify(obj.data) : undefined);
    });

}

export let get = (url, params) => request({method: "GET", url, params});
export let post = (url, _data) => {
    let data = httpBody(_data);
    return request({method: "POST", contentType: "application/json", url, data})
};