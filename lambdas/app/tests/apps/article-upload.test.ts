import { expect } from "chai";
import { PatchArticleHandler, PutArticleHandler } from "../../src/handlers/articles";
import { generateRequestMock } from "../mocks/apigateway-event-mock";
import AWS from 'aws-sdk';


describe("Test Hello world", () => {
    process.env.EDITORS_TABLE='tma-editors-dev';
    process.env.ARTICLES_TABLE='tma-articles-dev';
    process.env.RESOURCES_BUCKET='dev-tma-files';
    process.env.AWS_REGION="us-east-1";
    AWS.config.update({region: process.env.AWS_REGION});

    it('it can upload an article', async () => {
        const putter = new PutArticleHandler();
        const evt = generateRequestMock('/article', testcaseBody, 'PUT');

        expect(putter.isHandler(evt)).to.equal(true);
        const response = await putter.handle(evt);
        expect(response.statusCode).to.equal(200);
    }).timeout(3000); 

    it('can patch an article with new content', async () => {
        const putter = new PutArticleHandler();
        const patcher = new PatchArticleHandler();
        const putEvt = generateRequestMock('/article', testcaseBody, 'PUT');
        const putResponse = await putter.handle(putEvt);
        const article = JSON.parse(putResponse.body);
        const preUpdateJson = JSON.parse(await putter.s3.download(`${article.id}-en-latest.json`));
        const preUpdateRecord = await patcher.db.getRecord(article.id as number);
        const patchEvt = generateRequestMock(`/article/${article.id}`, updateBody, 'PATCH', '/article/{articleId}', {
            pathParameters: {articleId: article.id}
        });
        expect(patcher.isHandler(patchEvt)).to.equal(true);
        const patchResponse = await patcher.handle(patchEvt);
        const body = JSON.parse(patchResponse.body);
        const postUpdateRecord = await patcher.db.getRecord(body.id as number);
        const postUpdateJson = JSON.parse(await putter.s3.download(`${article.id}-en-latest.json`));
        expect(preUpdateJson[0].blocks[0].text).to.equal("This is a block")
        expect(postUpdateJson[0].blocks[0].text).to.equal("This is an updated block");
        expect(preUpdateRecord?.i18nVersions.en.revisionNumber).to.equal(1)
        expect(preUpdateRecord?.i18nVersions.es.revisionNumber).to.equal(1)
        expect(postUpdateRecord?.i18nVersions.en.revisionNumber).to.equal(2)
        expect(postUpdateRecord?.i18nVersions.es.revisionNumber).to.equal(1)
        expect(preUpdateRecord?.i18nVersions.en.checksum).to.not.equal(postUpdateRecord?.i18nVersions.en.checksum);
        expect(preUpdateRecord?.i18nVersions.es.checksum).to.equal(postUpdateRecord?.i18nVersions.es.checksum);
    }).timeout(4000);
});
const testcaseBody = {
    "article": [
        {
            "language": "en",
            "blocks": [
                {
                    "blocks": [
                        {
                            "key": "unj1",
                            "text": "This is a block",
                            "type": "unstyled",
                            "depth": 0,
                            "inlineStyleRanges": [],
                            "entityRanges": [],
                            "data": {}
                        }
                    ],
                    "entityMap": {}
                },
                {
                    "blocks": [
                        {
                            "key": "apga1",
                            "text": "This is a second block",
                            "type": "unstyled",
                            "depth": 0,
                            "inlineStyleRanges": [
                                {
                                    "offset": 17,
                                    "length": 5,
                                    "style": "BOLD"
                                }
                            ],
                            "entityRanges": [],
                            "data": {}
                        }
                    ],
                    "entityMap": {}
                }
            ]
        },
        {
            "language": "es",
            "blocks": [
                {
                    "blocks": [
                        {
                            "key": "769lr",
                            "text": "Introducir texto aquí",
                            "type": "unstyled",
                            "depth": 0,
                            "inlineStyleRanges": [],
                            "entityRanges": [],
                            "data": {}
                        }
                    ],
                    "entityMap": {}
                }
            ]
        }
    ]
}

const updateBody = {
    "article": [
      {
        "language": "en",
        "blocks": [
          {
            "blocks": [
              {
                "key": "unj1",
                "text": "This is an updated block",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {}
              }
            ],
            "entityMap": {}
          },
          {
            "blocks": [
              {
                "key": "apga1",
                "text": "This is a second block",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [
                  {
                    "offset": 17,
                    "length": 5,
                    "style": "BOLD"
                  }
                ],
                "entityRanges": [],
                "data": {}
              }
            ],
            "entityMap": {}
          }
        ]
      },
      {
        "language": "es",
        "blocks": [
          {
            "blocks": [
              {
                "key": "769lr",
                "text": "Introducir texto aquí",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {}
              }
            ],
            "entityMap": {}
          }
        ]
      }
    ]
  }