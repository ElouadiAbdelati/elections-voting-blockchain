import {Object, Property} from 'fabric-contract-api';

@Object()
export class Ballot {
    @Property()
    public ballotCast: boolean;
    @Property()
    public ballotId: string;
    @Property()
    public type: string;
    @Property()
    public electionId: string;
    @Property()
    public voterId: string;

    constructor(electionId: string, voterId?: string) {
        this.ballotCast = false;
        this.electionId = electionId;
        this.ballotId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.type = 'ballot';
        this.voterId = voterId;
        return this;
    }
}
