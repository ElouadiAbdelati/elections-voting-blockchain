import {Area } from '../model/Area';


export class AreaService {
  static async createArea(ctx,id:number,areaName:string):Promise<Area> {
      const area:Area=new Area(id,areaName);
       const buffer: Buffer = Buffer.from(JSON.stringify(area));
       await ctx.stub.putState(id, buffer);
       return area;
  }

}
