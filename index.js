const AWS = require('aws-sdk');
global.fetch = require('node-fetch');

let options  = {};
if(process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
}

const docClient = new AWS.DynamoDB.DocumentClient(options);

module.exports.handler = function(event, context, callback) {
    const { author, music } = event.pathParameters;
    // const result = getDynamoDB(event.author, event.music, callback);
    let lyrics = getLyrics(author, music);
    // if(result == null) {
    //     insertDynamoDB(event.author, event.music, lyrics, callback);
    // }
    // else {
    //     lyrics = result;
    // }

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
            return callback(err, null);
        }
        else {
            return callback(null, data)
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
            callback(err, null);
        }
        else {
            callback(null, data)
        }
    });
}

async function getLyrics(author, music) {
    const url = `https://api.lyrics.ovh/v1/${author}/${music}`;
    const response = await fetch(url).then(result => result.json()).catch(err => console.log(err));
    return response.lyrics;
}