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
import * as config from "../../../config";
import {NetworkService} from "spinal-model-bmsnetwork"
import {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointDataType,
  InputDataEndpointType,
} from './InputDataModel/InputDataModel';

import { ApiConnector } from '../ApiConnector';

const networkService = new NetworkService();


type onDataFunctionType = (obj: InputDataDevice) => void;

/**
 * Simulation Class to generate data from an extrenal source
 *
 * @class InputData
 */
class InputData {
  /**
   * @private
   * @type {onDataFunctionType}
   * @memberof InputData
   */
  private onData: onDataFunctionType;

  /**
   * @private
   * @type {InputDataDevice[]}
   * @memberof InputData
   */
  private devices: InputDataDevice[];


  private apiConnector: ApiConnector;


  /**
   *Creates an instance of InputData.
   * @memberof InputData
   */
  constructor( apiConnector: ApiConnector) {
    const intervalTest = 2000;
    this.apiConnector = apiConnector;
    this.devices = [];
    this.onData = null;
    this.generateData();
    // setInterval(this.onDataInterval.bind(this), intervalTest);
  }

  /**
   * @private
   * @memberof InputData
   */
  private onDataInterval() {
    if (this.onData !== null) {
      this.getAndUpdateOneRandomDevice();
    }
  }

  /**
   * @param {onDataFunctionType} onData
   * @memberof InputData
   */
  public setOnDataCBFunc(onData: onDataFunctionType): void {
    this.onData = onData;
  }

  /**
   * @private
   * @memberof InputData
   */
  private async generateData() {
    const fields = "all";
    const response = await this.apiConnector.getAll(`https://${config.api_host}/api/objects?fields=${fields}`);
    // const response = await this.apiConnector.getAll(`https://${config.api_host}/api/objects`);

    console.log("response : ", response);

    const equipments = response.data.data;

    for( const equipment of equipments){
      const device = await this.generateDataDevice(equipment);
      // console.log("device : ", device);

      this.devices.push(device);
    }
    this.onDataInterval();
  }

  private async getDeviceProperties(DeviceId: string) {
    // const fields = "description,id,name,properties";
    const fields = "all";

    const response = await this.apiConnector.get(`https://${config.api_host}/api/objects/${DeviceId}?fields=${fields}`);

    const properties = response.data.properties;

    console.log("properties : ", properties);

    return properties;
    
  }


  /**
   * @private
   * @returns {InputDataDevice}
   * @memberof InputData
   */
  // private generateDataDevice(model: any): InputDataDevice {
  private async generateDataDevice(model: any): Promise<InputDataDevice> {

    // Function to create a device or Endpoint Group
    function createFunc(
      str: string,
      type: string,
      description: string,
      id: string,
      location: string,
      constructor: typeof InputDataDevice
    ): any {
      return new constructor(str, type,description, id,location,'');
    }


    const device: InputDataDevice = createFunc(
      `${model.name}`,
      'device',
      `${model.description}`,
      `${model.id}`,
      `${model.location}`,
      InputDataDevice,
    );


    const properties = await this.getDeviceProperties(model.id);

    for(let property of properties){
      let endPointObj = undefined;

      if(property.state!= null){
        endPointObj= {
          name : property.description,
          currentValue : property.state.message,
          unit:'',
          dataType: InputDataEndpointDataType.String,
          type: InputDataEndpointType.Other,
          id :property.id,
          path :'',
        };
      }
      else{
        endPointObj= {
          name : property.description,
          currentValue : "null",
          unit:'',
          dataType: InputDataEndpointDataType.String,
          type: InputDataEndpointType.Other,
          id :property.id,
          path :'',
        };
      }
      
      const endPoint: InputDataEndpoint = new InputDataEndpoint(
        endPointObj.name, 
        endPointObj.currentValue,
        endPointObj.unit,
        endPointObj.dataType,
        endPointObj.type,
        endPointObj.id,
        endPointObj.path)

        console.log("endpoint == ", endPoint)
        device.children.push(endPoint);
    }


  
    return device;
  }


  /**
   * @private
   * @returns {InputDataDevice}
   * @memberof InputData
   */
  private getAndUpdateOneRandomDevice(): any {
    if (this.devices.length > 0) {
      for(let elt of this.devices){
        this.onData(elt);

      }
    }

  }


  // static async create_Attributes(parentNode, tab, categoryName) {




  //   let categoryAttributes = await AttributeService.addCategoryAttribute(parentNode, categoryName);

  //   for (let elt2 in tab) {

  //     if (typeof tab[elt2] != "object") {

  //       AttributeService.addAttributeByCategory(parentNode, categoryAttributes, elt2, tab[elt2]);

  //     }

  //     else {




  //       await DeviceHelper.create_Attributes(parentNode, tab[elt2], elt2);




  //     }

  //   }

  // }
}

export { InputData };
