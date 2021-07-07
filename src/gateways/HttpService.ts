global.fetch = require('node-fetch');
import ApplicationError from '../exceptions/ApplicationError';

export default class HttpService {
    public async get<R = any>(url: string): Promise<R> {
        return await fetch(url)
            .then(result => result.json())
            .catch(err => { throw new ApplicationError(err) });
    }
}