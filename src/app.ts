import AppController from './controllers/AppController';
import { 
    APIGatewayProxyEventInterface, 
    APIGatewayProxyResultInterface 
} from './interfaces/APIGateWayInterace';

import AwsFactory from './factories/AwsFactory';

export const docClient: AWS.DynamoDB.DocumentClient = new AwsFactory().buildDynamo();

export const handler = async (
    event: APIGatewayProxyEventInterface,
  ): Promise<APIGatewayProxyResultInterface> => {
    try {
        const appController = new AppController(docClient);
        const lyric = await appController.run(event);
        return {
            statusCode: 200,
            lyrics: lyric,
        }
    } catch (error) {
      return {
        statusCode: error.status || 500,
        body: JSON.stringify(
          {
            code: error.code,
            message: error.message,
          },
          null,
          2,
        ),
      }
    }
  }