import * as AWS from 'aws-sdk'
import ApplicationError from '../exceptions/ApplicationError'

export default class AwsFactory {
    constructor() {
        if(!process.env.AWS_DYNAMO_REGION) {
            throw new ApplicationError('Missing AWS_DYNAMO_REGION environment var');
        }
    }

    public buildDynamo(): AWS.DynamoDB.DocumentClient {
        return new AWS.DynamoDB.DocumentClient({
            region: process.env.AWS_DYNAMO_REGION,
        });
    }
}