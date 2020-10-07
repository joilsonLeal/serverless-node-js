const AWS = require('aws-sdk');
global.fetch = require('node-fetch');

let options  = {};
if(process.env.IS_OFFLINE) {
    options = {
        region: 'local',
        endpoint: 'http://localhost:8000',
        accessKeyId: process.env.AWS_SECRET_KEY,
        accessSecretKey: process.env.AWS_SECRET_KEY,
    }
}

const docClient = new AWS.DynamoDB.DocumentClient(options);

module.exports.handler = function(event, context, callback) {
    const { author, music } = event.pathParameters;

    const result = getDynamoDB(author, music, callback);
    
    let lyrics = '';
    
    if(!result) {
        lyrics = getLyrics(author, music);
        insertDynamoDB(author, music, lyrics, callback);
    }
    else {
        lyrics = result.lyrics;
    }

    return lyrics; 
}

function insertDynamoDB(author, music, lyrics, callback) {
    const params = {
        Item: {
            author: author,
            music: music,
            lyrics: lyrics
        },
        
        TableName: 'lyrics'
    };

    docClient.put(params, function(err, data) {
        if(err) {
            console.log(err)
            return err;
        }
        else {
            console.log(data);
            return data;
        }
    })
}

function getDynamoDB(author, music, callback) {
    
    const params = {
        TableName: 'lyrics',
        Key: {
            "author": author,
            "music": music
        }
    };

    docClient.get(params, function (err, data) {
        if(err) {
            console.log(err);
            return err;
        }
        else {
            console.log(data);
            return data;
        }
    });
}

async function getLyrics(author, music) {
    const url = `https://api.lyrics.ovh/v1/${author}/${music}`;
    const response = await fetch(url).then(result => result.json()).catch(err => console.log(err));
    return response.lyrics;
}