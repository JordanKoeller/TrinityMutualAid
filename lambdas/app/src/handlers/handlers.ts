import AWS from 'aws-sdk';
import { LambdaApp } from '../common/lambda-app';
import { PatchArticleHandler, PutArticleHandler , /*GetArticlesHandler*/} from './articles';


import { FileUploadHandler } from './file-upload';

AWS.config.update({region: process.env.AWS_REGION});


const app = new LambdaApp();

app.register(new FileUploadHandler());
// app.register(new GetArticleHandler());
// app.register(new GetArticlesHandler());
app.register(new PutArticleHandler());
app.register(new PatchArticleHandler());

export const handler = app.asFunc();

export default handler;