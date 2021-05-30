/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import moment = require('moment');
import { Area } from './model/Area';
import { Ballot } from './model/ballot';
import { Candidat } from './model/Candidat';
import { Election } from './model/Election';



@Info({ title: 'ElectionContract', description: 'My Smart Contract' })
export class ElectionContract extends Contract {

    @Transaction()
    @Returns('Election')
    async createElection(ctx: Context, name: string, year: number, startDate: string, endDate: string): Promise<Election> {
        let election: Election = new Election(name, year, startDate, endDate);
        let buffer: Buffer = Buffer.from(JSON.stringify(election));
        await ctx.stub.putState(election.electionId, buffer);
        return election;
    }

    @Transaction()
    @Returns('Area')
    async createArea(ctx: Context, id: number, areaName: string): Promise<Area> {
        let area: Area = new Area(id, areaName);
        let buffer: Buffer = Buffer.from(JSON.stringify(area));
        await ctx.stub.putState(id.toString(), buffer);
        return area;
    }

    @Transaction()
    @Returns('Candidat')
    async createCandidat(ctx: Context, candidatId: string, description: string, nomSGP: string, prenomSGP: string, areaId: number, partiId: number): Promise<Candidat> {
        let candidat: Candidat = new Candidat(candidatId, description, nomSGP, prenomSGP, areaId, partiId);
        let buffer: Buffer = Buffer.from(JSON.stringify(candidat));
        await ctx.stub.putState(candidatId, buffer);
        return candidat;
    }

    @Transaction()
    @Returns('Ballot')
    async createBallot(ctx: Context, electionId: string): Promise<Ballot> {
        let ballot: Ballot = new Ballot(electionId);
        let buffer: Buffer = Buffer.from(JSON.stringify(ballot));
        await ctx.stub.putState(ballot.ballotId, buffer);
        return ballot;
    }

    @Transaction(false)
    @Returns('Candidat[]')
    async getAllCandidatsByArea(ctx: Context, areaId: number): Promise<Candidat[]> {
        let result = JSON.parse(await this.queryByObjectType(ctx, 'candidat'));
        let candidats: Candidat[];
        for (let i = 0; i < result.length; i++) {
            console.log("hdgdsjfgds: " + result[0]);
            let candidat: Candidat = result[i] as Candidat;
            candidats[i] = candidat;
        }
        console.log("l condidat li jab : " + candidats);
        console.log("l condidat li jab 2 : " + await this.queryByObjectType(ctx, 'candidat'));
        // tslint:disable-next-line:prefer-let
        let candidatsArea: Candidat[];
        let j = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < candidats.length; i++) {
            console.log("area dyl l candidat: " + candidats[i].areaId);
            console.log("area bch tan9lbo: " + areaId);
            if (candidats[i].areaId === areaId) {
                candidatsArea[j] = candidats[i];
                j++;
            }
        }
        return candidatsArea;
    }

    @Transaction(false)
    @Returns('Candidat')
    async getCandidatById(ctx: Context, candidatId: string): Promise<Candidat> {
        const data: Uint8Array = await ctx.stub.getState(candidatId);
        const candidat: Candidat = JSON.parse(data.toString()) as Candidat;
        return candidat;
    }

    @Transaction(false)
    @Returns('boolean')
    public async myAssetExists(ctx: Context, myAssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(myAssetId);
        return (!!data && data.length > 0);
    }

    @Transaction(false)
    @Returns('any')
    async readMyAsset(ctx: Context, myAssetId: string): Promise<any> {

        let exists = await this.myAssetExists(ctx, myAssetId);

        if (!exists) {
            // throw new Error(`The my asset ${myAssetId} does not exist`);
            let response = {
                error: ''
            };
            response.error = `The my asset ${myAssetId} does not exist`;
            return response;
        }

        let buffer = await ctx.stub.getState(myAssetId);
        let asset = JSON.parse(buffer.toString());
        return asset;
    }

    @Transaction(false)
    @Returns('any')
    public async queryAll(ctx: Context): Promise<any> {

        const queryString = {
            selector: {}
        };

        const queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;

    }

    @Transaction(false)
    @Returns('any')
    public async queryWithQueryString(ctx: Context, queryString: string): Promise<any> {

        let resultsIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];

        while (true) {
            let res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes: any;


                try {
                    jsonRes = JSON.parse((res.value.value as Buffer).toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = (res.value.value as Buffer).toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }
    }

    @Transaction(false)
    @Returns('any')
    public async queryByObjectType(ctx: Context, objectType: string): Promise<any> {

        const queryString = {
            selector: {
                type: objectType
            }
        };

        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;

    }
    /*
        @Transaction()
        @Returns('string')
         async createVoter(ctx: any, args: any):Promise<string> {
            // query state for elections
            let currElections = JSON.parse(await this.queryByObjectType(ctx, 2021));
    
            if (currElections.length === 0) {
                // tslint:disable-next-line:no-shadowed-variable
             
                let response = 'no elections. Run the init() function first.';
                return response;
            }
            args = JSON.parse(args);
    
            // create a new voter
            let newVoter = await new Voter(args.voterId, args.areaId);
    
            // update state with new voter
            await ctx.stub.putState(newVoter.voterId, Buffer.from(JSON.stringify(newVoter)));
    
    
            // generate ballot with the given votableItems
            await this.createBallot(ctx, newVoter.voterId, currElections[0].electionId);
    
            let response: string = `voter with voterId ${newVoter.voterId} is updated in the world state`;
            return response;
        }
    
        @Transaction()
        @Returns('string')
        async castVote(ctx, args):Promise<string> {
            args = JSON.parse(args);
    
            // get the political party the voter voted for, also the key
            let candidatId = args.picked;
    
            // check to make sure the election exists
            let electionExists = await this.myAssetExists(ctx, args.electionId);
    
            if (electionExists) {
    
                // make sure we have an election
                let electionAsBytes = await ctx.stub.getState(args.electionId);
                let election = await JSON.parse(electionAsBytes);
                let voterAsBytes = await ctx.stub.getState(args.voterId);
                let voter = await JSON.parse(voterAsBytes);
                // ballotCast ==> voter voted
                if (voter.ballotCast) {
                  
                   let response = 'this voter has already cast this ballot!';
                    return response;
                }
    
                // check the date of the election, to make sure the election is still open
                let currentTime = await new Date(2020, 11, 3);
    
                // parse date objects
                // @ts-ignore
                let parsedCurrentTime = Date.parse(currentTime);
                let electionStart = await Date.parse(election.startDate);
                let electionEnd = await Date.parse(election.endDate);
    
                // only allow vote if the election has started
                if (parsedCurrentTime >= electionStart && parsedCurrentTime < electionEnd) {
    
                    let candidatExists = await this.myAssetExists(ctx, candidatId);
                    if (!candidatExists) {
                        // tslint:disable-next-line:no-shadowed-variable
                     
                       let response = 'VotableId does not exist!';
                        return response;
                    }
    
                    // get the votable object from the state - with the votableId the user picked
                    let candidatAsBytes = await ctx.stub.getState(candidatId);
                    let candidat = await JSON.parse(candidatAsBytes);
    
                    // increase the vote of the political party that was picked by the voter
                    await candidat.count++;
    
                    // update the state with the new vote count
                    let result = await ctx.stub.putState(candidatId, Buffer.from(JSON.stringify(candidat)));
                    console.log(result);
    
                    // make sure this voter cannot vote again!
                    voter.ballotCast = true;
                    voter.picked = {};
                    voter.picked = args.picked;
    
                    // update state to say that this voter has voted, and who they picked
                    let response = await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
                    console.log(response);
                    return voter;
    
                } else {
                   
                   let response = 'the election is not open now!';
                    return response;
                }
    
            } else {
                
               let response = 'the election or the voter does not exist!';
                return response;
            }
        }
    
        @Transaction()
        @Returns('Ballot')
         async createBallot(ctx:Context, voterId:string, electionId): Promise<Ballot> {
    
            let voter: Voter = await this.readMyAsset(ctx, voterId);
            if (voter === null) {
                throw new Error(`The voter ${voterId} does not exist`);
    
            }
            let candidats: Candidat[] = await this.getAllCandidatsByArea(ctx, voter.areaId);
            if (candidats.length === 0) {
                throw new Error(`The list of candidats area  ${voter.areaId} does not exist`);
            }
    
            let ballot: Ballot = new Ballot(ctx, candidats, electionId);
            voter.ballot = ballot;
            let buffer: Buffer = Buffer.from(JSON.stringify(voter));
            await ctx.stub.putState(voterId, buffer);
    
            return ballot;
    
        }
        
        
    
        
    
        */


}
