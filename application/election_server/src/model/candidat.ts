import { Object, Property } from 'fabric-contract-api';

@Object()
export class Candidat {

    @Property()
    public candidatId: string;
    @Property()
    public description: string;
    @Property()
    public nomSGP: string;
    @Property()
    public prenomSGP: string;
    @Property()
    public areaId: number;
    @Property()
    public partiId: number;
    @Property()
    public count: number;
    @Property()
    public type: string;

    constructor(candidatId: string, description: string, nomSGP: string, prenomSGP: string, areaId: number, partiId: number) {
        this.candidatId = candidatId;
        this.description = description;
        this.nomSGP = nomSGP;
        this.prenomSGP = prenomSGP;
        this.areaId = areaId;
        this.partiId = partiId;
        this.count = 0;
        this.type = 'candidat';
        return this;
    }
}
