import { AWS } from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});

exports.handle = function(event: any, context: any, callback: any) {

}

function insertDynamoDB(callback: any) {
    const params = {
        Item: {
            date: Date.now(),
            message: 'Insert dynamoDB'
        },
        
        TableName: 'lyrics'
    };

    docClient.put(params, function(err: any, data: any) {
        if(err) {
            callback(err, null);
        }
        else {
            callback(null, data)
        }
    })
}

function getDynamoDB(callback: any) {
    
    /*
    const scannigParams = {
        TableName: 'lyrics',
        Limit: 100
    };
    // scan percorre toda a tabela
    // utilizar query
    docClient.scan(scannigParams, function (err: any, data: any) {
        if(err) {
            callback(err, null);
        }
        else {
            callback(null, data)
        }
    });
    */

    const params = {
        TableName: 'lyrics',
        Key: {
            "date": 123123123123
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