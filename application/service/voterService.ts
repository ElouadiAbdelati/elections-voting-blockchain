import {Voter} from '../model/Voter';
import {ServiceUtils} from '../utils/serviceUtils';
import {BallotService} from './BallotService';

export class VoterService {
    /**
     *
     * @param {*} ctx
     * @param {*} args
     * @returns
     */
    static async createVoter(ctx: any, args: any):Promise<string> {
        // query state for elections
        const currElections = JSON.parse(await ServiceUtils.queryByObjectType(ctx, 2021));

        if (currElections.length === 0) {
            // tslint:disable-next-line:no-shadowed-variable
         
            const response = 'no elections. Run the init() function first.';
            return response;
        }
        args = JSON.parse(args);

        // create a new voter
        const newVoter = await new Voter(args.voterId, args.areaId);

        // update state with new voter
        await ctx.stub.putState(newVoter.voterId, Buffer.from(JSON.stringify(newVoter)));


        // generate ballot with the given votableItems
        await BallotService.createBallot(ctx, newVoter.voterId, currElections[0].electionId);

        const response: string = `voter with voterId ${newVoter.voterId} is updated in the world state`;
        return response;
    }

    async castVote(ctx, args) {
        args = JSON.parse(args);

        // get the political party the voter voted for, also the key
        const candidatId = args.picked;

        // check to make sure the election exists
        const electionExists = await ServiceUtils.myAssetExists(ctx, args.electionId);

        if (electionExists) {

            // make sure we have an election
            const electionAsBytes = await ctx.stub.getState(args.electionId);
            const election = await JSON.parse(electionAsBytes);
            const voterAsBytes = await ctx.stub.getState(args.voterId);
            const voter = await JSON.parse(voterAsBytes);
            // ballotCast ==> voter voted
            if (voter.ballotCast) {
                const response = {
                    error: ''
                };
                response.error = 'this voter has already cast this ballot!';
                return response;
            }

            // check the date of the election, to make sure the election is still open
            const currentTime = await new Date(2020, 11, 3);

            // parse date objects
            // @ts-ignore
            const parsedCurrentTime = Date.parse(currentTime);
            const electionStart = await Date.parse(election.startDate);
            const electionEnd = await Date.parse(election.endDate);

            // only allow vote if the election has started
            if (parsedCurrentTime >= electionStart && parsedCurrentTime < electionEnd) {

                const candidatExists = await ServiceUtils.myAssetExists(ctx, candidatId);
                if (!candidatExists) {
                    // tslint:disable-next-line:no-shadowed-variable
                    const response = {
                        error: ''
                    };
                    response.error = 'VotableId does not exist!';
                    return response;
                }

                // get the votable object from the state - with the votableId the user picked
                const candidatAsBytes = await ctx.stub.getState(candidatId);
                const candidat = await JSON.parse(candidatAsBytes);

                // increase the vote of the political party that was picked by the voter
                await candidat.count++;

                // update the state with the new vote count
                const result = await ctx.stub.putState(candidatId, Buffer.from(JSON.stringify(candidat)));
                console.log(result);

                // make sure this voter cannot vote again!
                voter.ballotCast = true;
                voter.picked = {};
                voter.picked = args.picked;

                // update state to say that this voter has voted, and who they picked
                const response = await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
                console.log(response);
                return voter;

            } else {
                const response = {
                    error: ''
                };
                response.error = 'the election is not open now!';
                return response;
            }

        } else {
            const response = {
                error: ''
            };
            response.error = 'the election or the voter does not exist!';
            return response;
        }
    }
}
