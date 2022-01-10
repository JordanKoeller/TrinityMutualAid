import { expect } from "chai";
import { GetArticleHandler, PutArticleHandler } from "../../src/handlers/articles";
import { generateRequestMock } from "../mocks/apigateway-event-mock";
import AWS from 'aws-sdk';


describe("Test Hello world", () => {
    process.env.EDITORS_TABLE='tma-editors-dev';
    process.env.ARTICLES_TABLE='tma-articles-dev';
    process.env.RESOURCES_BUCKET='dev-tma-files';
    process.env.AWS_REGION="us-east-1";
    AWS.config.update({region: process.env.AWS_REGION});

    it('it runs', async () => {
        const putter = new PutArticleHandler();
        // const app = new HelloHandler();
        const evt = generateRequestMock('/article', testcaseBody, 'PUT');
    
        expect(putter.isHandler(evt)).to.equal(true);
        const response = await putter.handle(evt);
        expect(response.statusCode).to.equal(200);
        const getter = new GetArticleHandler();
        const getEvt = generateRequestMock(`/en/article/${JSON.parse(response.body).id}`, {}, 'GET', '/{language}/article/{articleId}');
        getEvt.pathParameters = {language: 'en', articleId: JSON.parse(response.body).id};
        expect(getter.isHandler(getEvt)).to.equal(true);
        const got = await getter.handle(getEvt);
        expect(got.statusCode).to.equal(200);
        console.log(got.body);

    })
});


const testcaseBody = {"content":{"blocks":[{"key":"6khje","text":"In this editor a toolbar shows up once you select part of the text. Did I successfully do it?","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"title":"My cool page","language":"en", "articleType": "news"}
