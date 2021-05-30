import {Candidat} from '../model/Candidat';
import {ServiceUtils} from '../utils/serviceUtils';

export class CandidatService {

    static async createCandidat(ctx, candidatId: string, description: string, nomSGP: string, prenomSGP: string, areaId: number, partiId: number): Promise<Candidat> {
        const candidat: Candidat = new Candidat(candidatId, description, nomSGP, prenomSGP, areaId, partiId);
        const buffer: Buffer = Buffer.from(JSON.stringify(candidat));
        await ctx.stub.putState(candidatId, buffer);
        return candidat;
    }

    static async getAllCandidatsByArea(ctx, areaId: number): Promise<Candidat[]> {
        const candidats: Candidat[] = JSON.parse(await ServiceUtils.queryByObjectType(ctx, 'candidat'));
        // tslint:disable-next-line:prefer-const
        let candidatsArea: Candidat[];
        let j = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < candidats.length; i++) {
            if (candidats[i].areaId === areaId) {
                candidatsArea[j] = candidats[i];
                j++;
            }
        }
        return candidatsArea;
    }
}
