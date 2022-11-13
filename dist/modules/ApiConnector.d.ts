export declare class ApiConnector {
    constructor();
    private getConfig;
    /**
     * @param {string} url
     * @return {*}
     * @memberof ApiConnector
     */
    get(url: string): Promise<import("axios").AxiosResponse<any, any>>;
    getAll(url: string): Promise<any>;
    private getDataLength;
    private getData;
    /**
     *
     * @param {string} url
     * @param {*} data
     * @return {*}
     * @memberof ApiConnector
     */
    post(url: string, data: any): Promise<import("axios").AxiosResponse<any, any>>;
}
