import { LyrifyRepositoryInterface } from '../interfaces/RepositoryInterface';
import * as AWS from 'aws-sdk';
import ApplicationError from '../exceptions/ApplicationError';
import AwsFactory from '../factories/AWSFactory';

const docClient:AWS.DynamoDB.DocumentClient = new AwsFactory().buildDynamo();

export default class LyricRepository implements LyrifyRepositoryInterface {
    constructor() {}

    public async getLyric(
        author: string, 
        music: string
    ): Promise<string> {

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

    public async insertLyric(
        author: string, 
        music: string,
        lyric: string
    ): Promise<void> {

        const params = {
            Item: {
                author: author.toLowerCase(),
                music: music.toLowerCase(),
                lyrics: lyric
            },
            TableName: 'lyrics'
        };
    
        await docClient.put(params, (err, data) => {
            if(err) { throw new ApplicationError(String(err)) }
        }).promise();

        return;
    }
}