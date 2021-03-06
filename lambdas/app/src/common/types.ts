
export interface ApiGatewayRequestContextIdentity {
  cognitoIdentityPoolId?: string;
  accountId?: string;
  cognitoIdentityId?: string;
  caller?: string;
  accessKey?: string;
  sourceIp?: string;
  cognitoAuthenticationType?: string;
  cognitoAuthenticationProvider?: string;
  userArn: string;
  userAgent?: string;
  user: string;
}
export interface AuthenticatedRequestContext {
  accountId: string;
  resourceId: string;
  stage: string;
  requestId: string;
  requestTime: string;
  requestTimeEpoch: number;
  path: string;
  resourcePath: string;
  httpMethod: string;
  apiId: string;
  identity: ApiGatewayRequestContextIdentity;
}
export interface ApiGatewayEvent {
  body: string;
  resource: string;
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  requestContext: AuthenticatedRequestContext;
  pathParameters?: Record<string, string>;
  multiValueQueryStringParameters?: Record<string, string[]>;
}

export interface ApiGatewayResponse {
  statusCode: number,
  body: string,
}




