"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputData = void 0;
/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
const config = require("../../../config");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const InputDataModel_1 = require("./InputDataModel/InputDataModel");
const networkService = new spinal_model_bmsnetwork_1.NetworkService();
/**
 * Simulation Class to generate data from an extrenal source
 *
 * @class InputData
 */
class InputData {
    /**
     *Creates an instance of InputData.
     * @memberof InputData
     */
    constructor(apiConnector) {
        const intervalTest = config.intervalTime;
        this.apiConnector = apiConnector;
        this.devices = [];
        this.onData = null;
        this.generateData();
        // this.running = false;
        setInterval(this.onDataInterval.bind(this), intervalTest);
    }
    /**
     * @private
     * @memberof InputData
     */
    onDataInterval() {
        if (this.onData !== null) {
            this.getAndUpdateDevice();
            console.log("** DONE **");
        }
    }
    /**
     * @param {onDataFunctionType} onData
     * @memberof InputData
     */
    setOnDataCBFunc(onData) {
        this.onData = onData;
    }
    /**
     * Run function, it is executed every "intervalTime" seconds
     * and stops when an error is detected
     *
     * @return {*}  {Promise<void>}
     * @memberof InputData
     */
    async run() {
        this.running = true;
        while (true) {
            if (!this.running)
                break;
            const before = Date.now();
            try {
                this.generateData();
                console.log("** DONE **");
            }
            catch (e) {
                console.error(e);
                this.running = false;
                await this.waitFct(1000 * 60);
                process.exit(0);
            }
            finally {
                const delta = Date.now() - before;
                const timeout = config.intervalTime - delta;
                await this.waitFct(timeout);
            }
        }
    }
    /**
       * Used by function run() to wait "nb" seconds
       *
       * @private
       * @param {number} nb number of seconds
       * @return {*}  {Promise<void>}
       * @memberof Alarm
       */
    waitFct(nb) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, nb >= 0 ? nb : 0);
        });
    }
    /**
     * @private
     * @memberof InputData
     */
    async generateData() {
        const fields = "all";
        const response = await this.apiConnector.getAll(`https://${config.api_host}:${config.api_port}/api/objects?fields=${fields}`);
        const equipments = response.data.data;
        console.log("Start monitoring ......");
        for (const equipment of equipments) {
            const device = await this.generateDataDevice(equipment);
            this.devices.push(device);
        }
        this.onDataInterval();
    }
    async getDeviceProperties(DeviceId) {
        // const fields = "description,id,name,properties";
        const fields = "all";
        const response = await this.apiConnector.get(`https://${config.api_host}:${config.api_port}/api/objects/${DeviceId}?fields=${fields}`);
        const properties = response.data.properties;
        return properties;
    }
    /**
     * @private
     * @returns {InputDataDevice}
     * @memberof InputData
     */
    // private generateDataDevice(model: any): InputDataDevice {
    async generateDataDevice(model) {
        // Function to create a device or Endpoint Group
        function createFunc(str, type, description, id, location, constructor) {
            return new constructor(str, type, description, id, location, '');
        }
        const device = createFunc(`${model.name}`, 'device', `${model.description}`, `${model.id}`, `${model.location}`, InputDataModel_1.InputDataDevice);
        const properties = await this.getDeviceProperties(model.id);
        for (let property of properties) {
            let endPointObj = undefined;
            if (property.state != null) {
                endPointObj = {
                    name: property.description,
                    currentValue: 10,
                    unit: '',
                    dataType: InputDataModel_1.InputDataEndpointDataType.Double,
                    type: InputDataModel_1.InputDataEndpointType.Other,
                    id: property.id,
                    path: '',
                };
            }
            else {
                endPointObj = {
                    name: property.description,
                    currentValue: "null",
                    unit: '',
                    dataType: InputDataModel_1.InputDataEndpointDataType.String,
                    type: InputDataModel_1.InputDataEndpointType.Other,
                    id: property.id,
                    path: '',
                };
            }
            const endPoint = new InputDataModel_1.InputDataEndpoint(endPointObj.name, endPointObj.currentValue, endPointObj.unit, endPointObj.dataType, endPointObj.type, endPointObj.id, endPointObj.path);
            device.children.push(endPoint);
        }
        return device;
    }
    /**
     * @private
     * @returns {InputDataDevice}
     * @memberof InputData
     */
    getAndUpdateDevice() {
        if (this.devices.length > 0) {
            for (let elt of this.devices) {
                this.onData(elt);
            }
        }
    }
}
exports.InputData = InputData;
//# sourceMappingURL=InputData.js.map