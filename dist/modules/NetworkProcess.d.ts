import { InputData } from "./InputData/InputData";
import { InputDataDevice } from "./InputData/InputDataModel/InputDataModel";
import { ConfigOrgan } from "../Utils/ConfigOrgan";
import { SpinalGraph } from "spinal-env-viewer-graph-service";
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
     * @param {SpinalGraph} graph
     * @param {ConfigOrgan} configOrgan
     * @returns {Promise<void>}
     * @memberof NetworkProcess
     */
    init(graph: SpinalGraph, configOrgan: ConfigOrgan): Promise<void>;
    /**
     *
     *
     * @param {InputDataDevice} obj
     * @memberof NetworkProcess
     */
    updateData(obj: InputDataDevice): void;
}
