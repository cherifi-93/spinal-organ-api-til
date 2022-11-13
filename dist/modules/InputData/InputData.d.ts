import { InputDataDevice } from './InputDataModel/InputDataModel';
import { ApiConnector } from '../ApiConnector';
declare type onDataFunctionType = (obj: InputDataDevice) => void;
/**
 * Simulation Class to generate data from an extrenal source
 *
 * @class InputData
 */
declare class InputData {
    /**
     * @private
     * @type {onDataFunctionType}
     * @memberof InputData
     */
    private onData;
    /**
     * @private
     * @type {InputDataDevice[]}
     * @memberof InputData
     */
    private devices;
    private apiConnector;
    /**
     *Creates an instance of InputData.
     * @memberof InputData
     */
    constructor(apiConnector: ApiConnector);
    /**
     * @private
     * @memberof InputData
     */
    private onDataInterval;
    /**
     * @param {onDataFunctionType} onData
     * @memberof InputData
     */
    setOnDataCBFunc(onData: onDataFunctionType): void;
    /**
     * @private
     * @memberof InputData
     */
    private generateData;
    private getDeviceProperties;
    /**
     * @private
     * @returns {InputDataDevice}
     * @memberof InputData
     */
    private generateDataDevice;
    /**
     * @private
     * @returns {InputDataDevice}
     * @memberof InputData
     */
    private getAndUpdateOneRandomDevice;
}
export { InputData };
