const AWS = require('aws-sdk');
global.fetch = require('node-fetch');

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}

const documentClient = new AWS.DynamoDB.DocumentClient(options);

module.exports.handler = async function(event, context, callback) {
    const { author, music } = event.pathParameters;

    const result = await getDynamoDB(author, music);
    let lyrics = '';

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

async function insertDynamoDB(author, music, lyrics) {
    const params = {
        Item: {
            author: author.toLowerCase(),
            music: music.toLowerCase(),
            lyrics: lyrics
        },
        TableName: 'lyrics'
    };

    const data = await documentClient.put(params).promise();
}

async function getDynamoDB(author, music) {
    
    const params = {
        TableName: 'lyrics',
        Key: {
            "author": author.toLowerCase(),
            "music": music.toLowerCase()
        }
    };

    const data = await documentClient.get(params).promise();
    if(data.Item)
        return data.Item.lyrics;
    else
        return '';
}

async function getLyrics(author, music) {
    const url = `https://api.lyrics.ovh/v1/${author}/${music}`;
    const response = await fetch(url).then(result => result.json()).catch(err => console.log(err));
    return response.lyrics;
}