
import {
  ApiGatewayEvent, AuthenticatedRequestContext, ApiGatewayResponse
} from './types';


export interface RequestMethod {
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
}

export type ApiHandler = (event: ApiGatewayEvent, context: AuthenticatedRequestContext) =>Promise<ApiGatewayResponse>;

export abstract class Handler {

  method: RequestMethod;

  constructor(m: RequestMethod) {
    this.method = m;
  }

  abstract handle(event: ApiGatewayEvent, context: AuthenticatedRequestContext): Promise<ApiGatewayResponse>;

  isHandler(event: ApiGatewayEvent): boolean {
    return event.path === this.method.endpoint && event.httpMethod == this.method.method;
  }

  async getResponse(event: ApiGatewayEvent, context: AuthenticatedRequestContext): Promise<ApiGatewayResponse> {
    return await this.handle(event, context);
  }
}

export class LambdaApp {
  handlers: Handler[];

  constructor() {
    this.handlers = [];
  }

  async run(event: ApiGatewayEvent, context: AuthenticatedRequestContext): Promise<ApiGatewayResponse> {
    for (let i=0; i < this.handlers.length; i++) {
      if (this.handlers[i].isHandler(event)) {
        return this.handlers[i].getResponse(event, context);
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify({message: `No handler set up for ${event.httpMethod} ${event.path}`})
    };
  }

  register(handler: Handler): void {
    this.handlers.push(handler);
  }


  _packageResponse(response: ApiGatewayResponse): Record<string, any> {
    return {
      ...response,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": 'http://localhost:3000',
        "Access-Control-Allow-Credentials": true
      }
    }
  }

  asFunc(): (event: ApiGatewayEvent, context: AuthenticatedRequestContext) =>Promise<any> {
    return (evt, ctx) => this.run(evt, ctx).then(resp => this._packageResponse(resp));
  }

}