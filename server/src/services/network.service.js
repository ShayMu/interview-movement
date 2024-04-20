class NetworkService {
    constructor() { }

    async request(url, method='GET', params={}) {
        return new Promise(resolve => {
            let options = {
                method
            };
    
            if (method == 'GET') url += this.buildGETParams(params);
            else {
                options.headers = {
                    'Content-Type': 'application/json'
                };
                options.body = JSON.stringify(params);
            }

            fetch(url, options).then(async response=>{
                let data = await response.text();

                try {
                    resolve({response, fields: JSON.parse(data)});
                }
                catch(e) {
                    resolve({response, err: e});
                }
            })
        });
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

const networkService = new NetworkService();
module.exports = networkService;