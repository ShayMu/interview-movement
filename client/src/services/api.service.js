import { setCookie, getCookie } from "../utils/helpers.util";

class API {
    constructor() {
        this.headerTokenKey = 'X-Auth-Token';
        this.tokenKey = 'authToken';
        this.token = getCookie(this.tokenKey);
    }
    
    setToken(value) {
        setCookie(this.tokenKey, value, 60 * 24 * 7); // save token for a few days
        this.token = value;
    }

    getAuthHeaders() {
        let headers = {};
        if (this.token) headers[this.headerTokenKey] = this.token;
        else {
            // for testing purposes
            // in production should have a login page to send those headers 
            headers['X-Auth-Username'] = 'eve.holt@reqres.in';
            headers['X-Auth-Password'] = 'cityslicka';
        }

        return headers;
    }

    async request(path, method='GET', params={}, options={}) {
        if (options.handleError !== false) options.handleError = true;
        return new Promise(resolve => {
            let url = 'http://localhost:8081/' + path;
            let reqOptions = {
                method,
                headers: {
                    ...this.getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            };
    
            if (method == 'GET') url += this.buildGETParams(params);
            else reqOptions.body = JSON.stringify(params);

            fetch(url, reqOptions).then(async response=>{
                let data = await response.text();
                let errorMsg = null;
                let fields = null;

                let serverToken = response.headers.get(this.headerTokenKey);
                if (serverToken) this.setToken(serverToken);

                try {
                    fields = JSON.parse(data);
                }
                catch(e) {
                    errorMsg = e.message;
                }

                if (fields && !fields.ok) {
                    let action = this.handleError(fields);
                    switch (action) {
                        case 'retry': return resolve(await this.request(path, method, params));
                    }
                    errorMsg = fields.errorType?fields.msg:'Request Error: ' + response.statusText;
                }

                if (errorMsg && options.handleError) {
                    window.app.alert.show(errorMsg);
                    fields = null;
                }
                resolve({response, fields, err: errorMsg});
            }).catch(err=>{
                if (options.handleError) window.app.alert.show(err.message);
                resolve({err: err.message});
            })
        });
    }

    handleError(resError) {
        let action = '';
        switch(resError.errorType) {
            case 'invalidToken': {
                this.setToken('');
                action = 'retry'; // should be either retry to get a new token or login to return to login page
            } break;
            case 'invalidCred': {
                this.setToken('');
                action = 'login'; // here we don't have a login page, but in actual system we should return/stay in the login page
            }
        }

        return action;
    }

    buildGETParams(params) {
        let retVal = '';

        if (Object.keys(params).length) {
            retVal += '?';
            for (let key in params) retVal += key + '=' + params[key] + '&';
            retVal = retVal.substring(0, retVal.length-1);
        }

        return retVal;
    }
}

const apiService = new API();
export default apiService;