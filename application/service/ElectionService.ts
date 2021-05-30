import {Election } from '../model/Election';

export class ElectionService {
  static async createElection(ctx,name:string, year:number, startDate:Date, endDate:Date):Promise<Election> {
    const election:Election=new Election(name, year, startDate, endDate);
     const buffer: Buffer = Buffer.from(JSON.stringify(election));
     await ctx.stub.putState(election.electionId, buffer);
     return election;
}
}
