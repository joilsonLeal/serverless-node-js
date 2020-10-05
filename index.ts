import { AWS } from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});

export const handler = function(event: any, context: any, callback: any) {
    
    const result = getDynamoDB(event.author, event.music, callback);
    let lyrics = '';
    if(result == null) {
        lyrics = getLyrics(event.author, event.music);
        insertDynamoDB(event.author, event.music, lyrics, callback);
    }
    else {
        lyrics = result;
    }

    return lyrics;
}

function insertDynamoDB(author: string, music: string, lyrics: string, callback: any) {
    const params = {
        Item: {
            author: author,
            music: music,
            lyrics: lyrics
        },
        
        TableName: 'lyrics'
    };

    docClient.put(params, function(err: any, data: any) {
        if(err) {
            return callback(err, null);
        }
        else {
            return callback(null, data)
        }
    })
}

function getDynamoDB(author: string, music: string, callback: any) {
    
    const params = {
        TableName: 'lyrics',
        Key: {
            "author": author,
            "music": music
        }
    };

    docClient.get(params, function (err: any, data: any) {
        if(err) {
            callback(err, null);
        }
        else {
            callback(null, data)
        }
    });
}

async function getLyrics(author: string, music: string): Promise<string> {
    const response = await fetch(`https://api.lyrics.ovh/v1/${author}/${music}`).then(result => result.json()).catch(err => console.log(err));
    return response.lyrics;
}