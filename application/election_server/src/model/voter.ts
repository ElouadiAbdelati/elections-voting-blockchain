import { Object, Property } from 'fabric-contract-api';

import { Ballot } from './Ballot';

@Object()
export class Voter {
    @Property()
    public voterId: string;
    @Property()
    public areaId: number;
    @Property()
    public voted: boolean;
    @Property()
    public type: string;
    @Property()
    public ballotId: string;

    constructor(voterId: string, areaId: number) {
        this.voterId = voterId;
        this.areaId = areaId;
        this.voted = false;
        this.type = 'voter';
        this.ballotId = '';
        return this;
    }
}
