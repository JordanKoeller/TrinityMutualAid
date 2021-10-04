
import { Handler, LambdaApp } from '../common/lambda-app';
import {
  ApiGatewayEvent, AuthenticatedRequestContext, ApiGatewayResponse
} from '../common/types';

const app = new LambdaApp();

export class HelloHandler extends Handler {
  constructor() {
    super({endpoint: '/hello', method: 'GET'});
  }

  async handle(event: ApiGatewayEvent, context: AuthenticatedRequestContext): Promise<ApiGatewayResponse> {
    return {
      statusCode: 200,
      body: JSON.stringify({"message": "This worked!", cognito: event.requestContext.identity}),
    }
  }
}

app.register(new HelloHandler());

export default app.asFunc();