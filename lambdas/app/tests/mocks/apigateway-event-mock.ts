import { ApiGatewayEvent } from '../../src/common/types';

export const generateRequestMock = (path: string, body: any, method: string, pathTemplate?: string): ApiGatewayEvent => {
    return {
        body: typeof body === 'string' ? body : JSON.stringify(body),
        resource: pathTemplate || path,
        path,
        httpMethod: method,
        headers: {
            'Content-Type': 'application/json'
        },
        pathParameters: {},
        requestContext: {
            accountId: '123456789',
            resourceId: '123456789',
            stage: 'prod',
            requestId: 'abcdefg',
            requestTime: Date().toString(),
            requestTimeEpoch: Date.now(),
            path,
            resourcePath: pathTemplate || path,
            httpMethod: method,
            apiId: 'abcdefg',
            identity: {
                cognitoIdentityPoolId: 'cognitoIdentityPoolId',
                accountId: 'accountId',
                cognitoIdentityId: 'cognitoIdentityId',
                caller: 'caller',
                accessKey: 'accessKey',
                sourceIp: 'sourceIp',
                cognitoAuthenticationType: 'cognitoAuthenticationType',
                cognitoAuthenticationProvider: 'cognitoAuthenticationProvider',
                userArn: 'userArn',
                userAgent: 'userAgent',
                user: 'user',
            }

        },
    }
}