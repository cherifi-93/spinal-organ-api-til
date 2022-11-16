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
import {SpinalGraphService, SpinalNodeRef} from "spinal-env-viewer-graph-service";
import { FileSystem, spinalCore } from "spinal-core-connectorjs_type";
import { SpinalGraph } from "spinal-model-graph";

require("json5/lib/register");
// get the config
import * as config from "../config";

import { InputData } from "./modules/InputData/InputData";
import { NetworkProcess } from "./modules/NetworkProcess";
import { ApiConnector } from "./modules/ApiConnector";



// Cette fonction est executée en cas de deconnexion au hub
FileSystem.onConnectionError = (error_code: number) => {
  setTimeout(() => {
        console.log('STOP ERROR');
        process.exit(error_code); // kill le process;
    }, 5000);
}



class SpinalMain {
  connect: spinal.FileSystem;
  constructor() { 
      const url = `${config.hubProtocol}://${config.userId}:${config.userPassword}@${config.hubHost}:${config.hubPort}/`;
      this.connect = spinalCore.connect(url)
  }
  
  /**
   * 
   * Initialize connection with the hub and load graph
   * @return {*}
   * @memberof SpinalMain
   */
  public init() {
    return new Promise((resolve, reject) => {
        spinalCore.load(this.connect, config.digitalTwinPath, async (graph: SpinalGraph) => {
          SpinalGraphService.setGraph(graph);
          console.log("Connected to the hub");
          await this.MainJob(graph);
          resolve(graph);
        }, () => {
            reject()
        })
    });
  }



  /**
   * The main function of the class
   */
  public async MainJob(graph: SpinalGraph) {

    const apiConnector = new ApiConnector();
    const inputData = new InputData(apiConnector);
    const networkProcess = new NetworkProcess(inputData);

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
Main()