import axios, { AxiosRequestConfig } from "axios";
// const config = require("../../config.json5");
import * as config from "../../config";
const querystring = require('querystring');


export class ApiConnector {
    constructor() {
    }

    private async getConfig() {
        return {
            headers: {
                "X-API-KEY": config.api_key,
                },
            params : {
                limit : 100,
                offset :0
            }
        }
    }

    /**
     * @param {string} url
     * @return {*} 
     * @memberof ApiConnector
     */
    public async get(url: string) {
        const config = await this.getConfig();
        const response = axios.get(url, config);
        return response
    }

    public async getAll(url: string) {
        const response = await this.get(url);
        const dataLength = this.getDataLength(response);
        if(dataLength>100){
            const finalResponse = await this.getData(response,dataLength);
            return finalResponse;
        }
        return response;
    }

    private getDataLength(apiResponse: any) {
        const length = apiResponse.headers["content-range"].split('/').pop();
        // console.log("Response lenght = ",length)
        return length;
      }


    private async getData(apiResponse: any, dataLength: number) {
        let allData = [];
        // let data = undefined;
        const n_iteration = parseInt((dataLength/100).toString());
        // console.log("iteration = ",n_iteration);
        // let data = apiResponse.data.data;

        for(let i=0;i<=n_iteration;i++){
            const config = await this.getConfig();
            const offset = config.params.offset = 100*i;
            // console.log( "offset = ",offset)
            const response =await axios.get(apiResponse.config.url,config );
            // console.log( "response all = ",response)
            const dataNext= response.data.data;
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
    public async post(url: string, data: any) {
        const config = await this.getConfig();
        return axios.post(url, data, config);
    }
  
}