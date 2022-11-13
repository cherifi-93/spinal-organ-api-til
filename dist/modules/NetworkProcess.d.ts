import { ForgeFileItem } from "spinal-lib-forgefile";
import { InputData } from "./InputData/InputData";
import { InputDataDevice } from "./InputData/InputDataModel/InputDataModel";
import { ConfigOrgan } from "../Utils/ConfigOrgan";
/**
 *
 *
 * @export
 * @class NetworkProcess
 */
export declare class NetworkProcess {
    private inputData;
    private nwService;
    /**
     *Creates an instance of NetworkProcess.
     * @param {InputData} inputData
     * @memberof NetworkProcess
     */
    constructor(inputData: InputData);
    /**
     *
     *
     * @param {ForgeFileItem} forgeFile
     * @param {ConfigOrgan} configOrgan
     * @returns {Promise<void>}
     * @memberof NetworkProcess
     */
    init(forgeFile: ForgeFileItem, configOrgan: ConfigOrgan): Promise<void>;
    /**
     *
     *
     * @param {InputDataDevice} obj
     * @memberof NetworkProcess
     */
    updateData(obj: InputDataDevice): void;
}
