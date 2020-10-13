import AppController from './controllers/AppController';
import { 
    APIGatewayProxyEventInterface, 
    APIGatewayProxyResultInterface 
} from './interfaces/APIGateWayInterace';

export const handler = async (
    event: APIGatewayProxyEventInterface,
  ): Promise<APIGatewayProxyResultInterface> => {
    try {
        const appController = new AppController();
        const lyric = await appController.run(event);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: lyric}, null, 2),
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