import { 
    APIGatewayProxyEventInterface
} from '../interfaces/APIGateWayInterace';

import LyricRepository from '../repositories/LyricRepository';
import OvhRepository from '../repositories/OvhRepository';

export default class AppController {

    constructor(private readonly docClient:AWS.DynamoDB.DocumentClient){}

    public async run(event: APIGatewayProxyEventInterface) {
        const repo = new LyricRepository(this.docClient);
        const ovh = new OvhRepository();
        const { music, author } = event.pathParameters;
        const result = await repo.getLyric(author, music);
        let lyrics: string = '';
        
        if(!result) {
            console.log("Procurando letra na api.lyrics.ovh");
            lyrics = await ovh.getLyrics(author, music);
            if(lyrics) {
                console.log("Inserindo...");
                await repo.insertLyric(author, music, lyrics);
            }
            else
                lyrics = 'Não foi encontrada letra.';
        }
        else {
            console.log("Tem no banco!");
            lyrics = result;
        }
    
        return lyrics; 
    }

    public async test(event: APIGatewayProxyEventInterface) {
        return event.pathParameters.name;
    }
}
