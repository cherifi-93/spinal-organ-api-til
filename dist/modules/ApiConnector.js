"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConnector = void 0;
const axios_1 = require("axios");
// const config = require("../../config.json5");
const config = require("../../config");
const querystring = require('querystring');
class ApiConnector {
    constructor() {
    }
    async getConfig() {
        return {
            headers: {
                "X-API-KEY": config.api_key,
            },
            params: {
                limit: 100,
                offset: 0
            }
        };
    }
    /**
     * @param {string} url
     * @return {*}
     * @memberof ApiConnector
     */
    async get(url) {
        const config = await this.getConfig();
        const response = axios_1.default.get(url, config);
        return response;
    }
    async getAll(url) {
        const response = await this.get(url);
        const dataLength = this.getDataLength(response);
        if (dataLength > 100) {
            const finalResponse = await this.getData(response, dataLength);
            return finalResponse;
        }
        return response;
    }
    getDataLength(apiResponse) {
        const length = apiResponse.headers["content-range"].split('/').pop();
        // console.log("Response lenght = ",length)
        return length;
    }
    async getData(apiResponse, dataLength) {
        let allData = [];
        // let data = undefined;
        const n_iteration = parseInt((dataLength / 100).toString());
        // console.log("iteration = ",n_iteration);
        // let data = apiResponse.data.data;
        for (let i = 0; i <= n_iteration; i++) {
            const config = await this.getConfig();
            const offset = config.params.offset = 100 * i;
            // console.log( "offset = ",offset)
            const response = await axios_1.default.get(apiResponse.config.url, config);
            // console.log( "response all = ",response)
            const dataNext = response.data.data;
            // console.log( "data Next = ",dataNext)
            allData = allData.concat(dataNext);
        }
        // const data = apiResponse.data.data;
        // console.log( data)
        // console.log( allData)
        apiResponse.data.data = allData;
        return apiResponse;
    }
    /**
     *
     * @param {string} url
     * @param {*} data
     * @return {*}
     * @memberof ApiConnector
     */
    async post(url, data) {
        const config = await this.getConfig();
        return axios_1.default.post(url, data, config);
    }
}
exports.ApiConnector = ApiConnector;
//# sourceMappingURL=ApiConnector.js.map