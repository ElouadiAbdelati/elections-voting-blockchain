import { Object, Property } from 'fabric-contract-api';

@Object()
export class Area {
    @Property()
    public id: number;
    @Property()
    public area: string;

    constructor(id: number, area: string) {
        this.id = id;
        this.area = area;
    }
}
