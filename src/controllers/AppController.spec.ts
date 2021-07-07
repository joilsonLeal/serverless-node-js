import AppController from './AppController';
import AwsFactory from '../factories/AwsFactory';
import { APIGatewayProxyEventInterface } from '../interfaces/APIGatewayInterace';

const setEnvVars = () => {
    process.env.AWS_DYNAMO_REGION = 'fake_AWS_DYNAMO_REGION'
}

const makeSut = () => {
    const awsFactory = new AwsFactory();
    const DocumentClientStub = awsFactory.buildDynamo();
    const appController = new AppController(DocumentClientStub);
    appController.run = jest.fn().mockImplementation( async () => 
        "Não foi encontrada letra."
    );

    return {
        appController
    }
}

describe('AppController', () => {
    beforeEach(setEnvVars);

    it('should return not found lyrics', async () => {

        const { appController } = makeSut();

        const request:APIGatewayProxyEventInterface = { 
            pathParameters: {
                "author": "adele",
                "music": "test"
            },
            
        }
        const result = await appController.run(request);

        expect(appController.run).toBeCalledTimes(1);
        expect(result).toEqual('Não foi encontrada letra.')
    });
    
});