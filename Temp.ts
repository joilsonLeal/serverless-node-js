import { Context, Handler } from 'aws-lambda';

interface ReqEvents {
    key1: string;
    key2: string;
    key3: string;
}

interface Res {
    message: string;
}

export const handler: Handler<ReqEvents, Res> = async (event: ReqEvents, context: Context): Promise<Res> => {
    let res: Res = { message: 'mensagem' };
    try {
        res = { message: event.key1 }
    } catch (error) {
        console.log(error);
        return error;
    }
    return res;
}