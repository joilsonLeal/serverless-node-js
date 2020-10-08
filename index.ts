import * as AWS from 'aws-sdk';
global.fetch = require('node-fetch');

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}

const docClient = new AWS.DynamoDB.DocumentClient(options);

export const handler = async (event: any) => {
    const { author, music } = event.pathParameters;

    const result = getDynamoDB(author, music);
    let lyrics: any = '';

    if(!result) {
        console.log("Inserindo");
        lyrics = await getLyrics(author, music);

        if(lyrics) 
            insertDynamoDB(author, music, lyrics);
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

    const data = await docClient.put(params).promise();
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

async function getLyrics(author: string, music: string): Promise<string> {
    const response = await 
        fetch(`https://api.lyrics.ovh/v1/${author}/${music}`)
            .then(result => result.json())
            .catch(err => console.log(err));
    return response.Item.lyrics;
}