import { LyrifyRepositoryInterface } from '../interfaces/RepositoryInterface';
import * as AWS from 'aws-sdk';
import ApplicationError from '../exceptions/ApplicationError';

export default class LyricRepository implements LyrifyRepositoryInterface {
    constructor(private readonly docClient:AWS.DynamoDB.DocumentClient) {}

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

        const data = await this.docClient.get(params).promise();

        return data.Item && data.Item.lyrics || '';
    }

    public async insertLyric(
        author: string, 
        music: string,
        lyric: string
    ): Promise<void> {

        const params = {
            TableName: 'lyrics',
            Item: {
                author: author.toLowerCase(),
                music: music.toLowerCase(),
                lyrics: lyric
            }
        };
    
        await this.docClient.put(params, (err, data) => {
            if(err) throw new ApplicationError(String(err), err.statusCode);
        }).promise();
    }
}
