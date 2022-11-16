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
    running: boolean;
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
     * Run function, it is executed every "intervalTime" seconds
     * and stops when an error is detected
     *
     * @return {*}  {Promise<void>}
     * @memberof InputData
     */
    run(): Promise<void>;
    /**
       * Used by function run() to wait "nb" seconds
       *
       * @private
       * @param {number} nb number of seconds
       * @return {*}  {Promise<void>}
       * @memberof Alarm
       */
    private waitFct;
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
    private getAndUpdateDevice;
}
export { InputData };
