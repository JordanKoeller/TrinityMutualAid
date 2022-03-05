import AWS from 'aws-sdk';
import { Handler } from '../common/lambda-app';
import {
  ApiGatewayEvent, ApiGatewayResponse
} from '../common/types';

// https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/
// Link above for how to get a signed url for uploading files
export class FileUploadHandler extends Handler {
    constructor() {
      super({endpoint: '/file-upload', method: 'GET'});
    }
    
    async handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
      const s3 = new AWS.S3();
      const URL_EXPIRATION_SECONDS = 300
      const filename = event.multiValueQueryStringParameters!.filename[0];
      const filenameParts = filename.split(".");
      const extension = filenameParts[filenameParts.length - 1];
      const s3Params = {
        Bucket: process.env.RESOURCES_BUCKET,
        Key: filename,
        Expires: URL_EXPIRATION_SECONDS,
        ContentType: `image/${extension}`,
      }
      const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)
      const imagePath = `https://${process.env.CDN_ORIGIN}/${filename}`;
      return {
        statusCode: 200,
        body: JSON.stringify({uploadURL: uploadURL, key: filename, imagePath})
      };
    }
  }