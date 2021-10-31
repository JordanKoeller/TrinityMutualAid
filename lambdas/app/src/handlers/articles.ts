import AWS from 'aws-sdk';
import { Handler, LambdaApp } from '../common/lambda-app';
import {
  ApiGatewayEvent, AuthenticatedRequestContext, ApiGatewayResponse
} from '../common/types';

AWS.config.update({region: process.env.AWS_REGION});


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

// https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/
// Link above for how to get a signed url for uploading files
export class FileUploadHandler extends Handler {
  constructor() {
    super({endpoint: '/file-upload', method: 'GET'});
  }
  
  async handle(event: ApiGatewayEvent, context: AuthenticatedRequestContext): Promise<ApiGatewayResponse> {
    const s3 = new AWS.S3();
    const URL_EXPIRATION_SECONDS = 300
    const randomID = Math.random() * 10000000;
    const Key = `${randomID}.${event.multiValueQueryStringParameters?.extension[0]}`
    const s3Params = {
      Bucket: process.env.RESOURCES_BUCKET,
      Key,
      Expires: URL_EXPIRATION_SECONDS,
      ContentType: `image/${event.multiValueQueryStringParameters?.extension[0]}`,
    }
    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)
    const imagePath = `https://${process.env.RESOURCES_BUCKET}.s3.amazonaws.com/${Key}`;
    return {
      statusCode: 200,
      body: JSON.stringify({uploadURL: uploadURL, key: Key, imagePath})
    };
  }
}

app.register(new HelloHandler());
app.register(new FileUploadHandler());

export const handler = app.asFunc();

export default handler;