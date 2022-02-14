import AWS from 'aws-sdk';
import { expect } from 'chai';
import { FileUploadHandler } from '../../src/handlers/file-upload';
import { S3Bucket } from "../../src/services/s3";
import { generateRequestMock } from '../mocks/apigateway-event-mock';

describe("File Upload Handler", () => {
    process.env.EDITORS_TABLE='tma-editors-dev';
    process.env.ARTICLES_TABLE='tma-articles-dev';
    process.env.RESOURCES_BUCKET='dev-tma-files';
    process.env.AWS_REGION="us-east-1";
    AWS.config.update({region: process.env.AWS_REGION});

    const s3 = new S3Bucket(process.env.RESOURCES_BUCKET as string);

    const uploader = new FileUploadHandler();

    it("Is the valid handler for the file-upload endpoint", () => {
        const mock = generateRequestMock("/file-upload",  {}, "GET", "/file-upload", {
            multiValueQueryStringParameters: {
                filename: ["some-file.png"],
            }
        });
        expect(uploader.isHandler(mock)).to.equal(true);
    });

    it("Can upload a file description and get back a valid upload token", async () => {
        const mock = generateRequestMock("/file-upload",  {}, "GET", "/file-upload", {
            multiValueQueryStringParameters: {
                filename: ["some-file.png"],
            }
        });
        const response = await uploader.handle(mock);
        const body = JSON.parse(response.body);
        expect(response.statusCode).to.equal(200);
        expect(body.key).to.equal("some-file.png")
    }).timeout(3000);
})