export class Voter {
    nom: string;
    prenom: string;
    cin: string;
    email: string;
    region: string;
    carteIdRecto: string;
    carteIdVerso: string;
    public constructor(carteIdRecto: string, carteIdVerso: string, nom: string, prenom: string, cin: string, region: string, email: string) {
        this.cin = cin;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.region = region;
        this.carteIdRecto = carteIdRecto;
        this.carteIdVerso = carteIdVerso;
    }

};

export const Regions = ['ouarzazate', 'casa', 'rabat'];