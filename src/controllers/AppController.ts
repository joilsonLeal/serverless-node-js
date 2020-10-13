import ApplicationError from '../exceptions/ApplicationError';
import * as AWS from 'aws-sdk';
global.fetch = require('node-fetch');
import { 
    APIGatewayProxyEventInterface, 
    APIGatewayProxyResultInterface 
} from '../interfaces/APIGateWayInterace';

import RepositoryInterface from '../repositories/LyricRepository';

const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

export default class AppController {
    public async run(event: APIGatewayProxyEventInterface) {

        const repo = new RepositoryInterface();

        const { music, author } = event.pathParameters;
        const result = await repo.getLyric(author, music);
        let lyrics: string = '';
        
        if(!result) {
            console.log("Procurando letra na api.lyrics.ovh");
            lyrics = await getLyrics(author, music);
            if(lyrics) {
                console.log("Inserindo");
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
}

async function getLyrics(author: string, music: string): Promise<string> {
    const response = await 
        fetch(`https://api.lyrics.ovh/v1/${author}/${music}`)
            .then(result => result.json())
            .catch(err => {throw new ApplicationError(err)});
    return response.lyrics;
}