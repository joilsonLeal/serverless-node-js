import HttpService from '../gateways/HttpService';

export default class OvhRepository {
    async getLyrics(author: string, music: string): Promise<string> {
        const url = `https://api.lyrics.ovh/v1/${author}/${music}`;
        const response = await new HttpService().get(url);
        return response.lyrics;
    }
}