"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
require("json5/lib/register");
// get the config
const config = require("../config");
const InputData_1 = require("./modules/InputData/InputData");
const NetworkProcess_1 = require("./modules/NetworkProcess");
const ApiConnector_1 = require("./modules/ApiConnector");
// Cette fonction est executée en cas de deconnexion au hub
spinal_core_connectorjs_type_1.FileSystem.onConnectionError = (error_code) => {
    setTimeout(() => {
        console.log('STOP ERROR');
        process.exit(error_code); // kill le process;
    }, 5000);
};
class SpinalMain {
    constructor() {
        const url = `${config.hubProtocol}://${config.userId}:${config.userPassword}@${config.hubHost}:${config.hubPort}/`;
        this.connect = spinal_core_connectorjs_type_1.spinalCore.connect(url);
    }
    /**
     *
     * Initialize connection with the hub and load graph
     * @return {*}
     * @memberof SpinalMain
     */
    init() {
        return new Promise((resolve, reject) => {
            spinal_core_connectorjs_type_1.spinalCore.load(this.connect, config.digitalTwinPath, async (graph) => {
                spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph);
                console.log("Connected to the hub");
                await this.MainJob(graph);
                resolve(graph);
            }, () => {
                reject();
            });
        });
    }
    /**
     * The main function of the class
     */
    async MainJob(graph) {
        const apiConnector = new ApiConnector_1.ApiConnector();
        const inputData = new InputData_1.InputData(apiConnector);
        const networkProcess = new NetworkProcess_1.NetworkProcess(inputData);
        networkProcess.init(graph, config.organ);
    }
}
async function Main() {
    // try {
    console.log('Organ Start');
    const spinalMain = new SpinalMain();
    await spinalMain.init();
    // await spinalMain.MainJob();
    // } 
    // catch (error) {
    //     console.error(error);
    //     setTimeout(() => {
    //         console.log('STOP ERROR');
    //         process.exit(0);
    //     }, 5000);
    // }
}
// Call main function
Main();
//# sourceMappingURL=index.js.map