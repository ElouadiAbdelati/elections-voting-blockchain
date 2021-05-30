import {Ballot} from '../model/Ballot';
import {Candidat} from '../model/Candidat';
import {Voter} from '../model/voter';
import {ServiceUtils} from '../utils/serviceUtils';
import {CandidatService} from './CandidatService';


export class BallotService {
    static async createBallot(ctx, voterId:string, electionId): Promise<Ballot> {

        const voter: Voter = await ServiceUtils.readMyAsset(ctx, voterId);
        if (voter === null) {
            throw new Error(`The voter ${voterId} does not exist`);

        }
        const candidats: Candidat[] = await CandidatService.getAllCandidatsByArea(ctx, voter.areaId);
        if (candidats.length === 0) {
            throw new Error(`The list of candidats area  ${voter.areaId} does not exist`);
        }

        const ballot: Ballot = new Ballot(ctx, candidats, electionId);
        voter.ballot = ballot;
        const buffer: Buffer = Buffer.from(JSON.stringify(voter));
        await ctx.stub.putState(voterId, buffer);

        return ballot;

    }
}
