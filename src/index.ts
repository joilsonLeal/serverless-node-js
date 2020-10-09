import * as AWS from 'aws-sdk';
import{ Context } from 'aws-lambda';
global.fetch = require('node-fetch');
import RequestLyricInterface from './interfaces/RequestInterface';

const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});

export const handler = async (event: RequestLyricInterface, context: Context) => {
    const { author, music } = event;

    const result = await getDynamoDB(author, music);
    let lyrics: any = '';
    
    if(!result) {
        console.log("Inserindo");
        lyrics = await getLyrics(author, music);

        if(lyrics) 
            await insertDynamoDB(author, music, lyrics);
        else
            lyrics = 'Não foi encontrada letra.';
    }
    else {
        console.log("Tem no banco!");
        lyrics = result;
    }

    return lyrics; 
}

async function insertDynamoDB(author: string, music: string, lyrics: string) {
    const params = {
        Item: {
            author: author.toLowerCase(),
            music: music.toLowerCase(),
            lyrics: lyrics
        },
        TableName: 'lyrics'
    };

    await docClient.put(params, (err, data) => {
        if(err)
            throw Error(String(err));
    }).promise();
}

async function getDynamoDB(author: string, music: string) {
    
    const params = {
        TableName: 'lyrics',
        Key: {
            "author": author,
            "music": music
        }
    };

    const data = await docClient.get(params).promise();

    if(data.Item)
        return data.Item.lyrics;
    else
        return '';
}

async function getLyrics(author: string, music: string): Promise<any> {
    const response = await 
        fetch(`https://api.lyrics.ovh/v1/${author}/${music}`)
            .then(result => result.json())
            .catch(err => {throw Error(err)});
    return response.lyrics;
}