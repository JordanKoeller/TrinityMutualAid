import { expect } from "chai";
import { DeleteArticleHandler, PatchArticleHandler, PutArticleHandler } from "../../src/handlers/articles";
import { generateRequestMock } from "../mocks/apigateway-event-mock";
import AWS from 'aws-sdk';
import { S3Bucket } from "../../src/services/s3";
import { assert } from "console";


describe("Test Hello world", () => {
    process.env.EDITORS_TABLE='tma-editors-dev';
    process.env.ARTICLES_TABLE='tma-articles-dev';
    process.env.RESOURCES_BUCKET='dev-tma-files';
    process.env.AWS_REGION="us-east-1";
    AWS.config.update({region: process.env.AWS_REGION});

    const deleter = new DeleteArticleHandler();
    const s3 = new S3Bucket(process.env.RESOURCES_BUCKET as string);
    
    it('it can upload an article', async () => {
        const startCount = await s3.count();
        const putter = new PutArticleHandler();
        const evt = generateRequestMock('/article', testcaseBody, 'PUT');
        expect(putter.isHandler(evt)).to.equal(true);
        const response = await putter.handle(evt);
        expect(response.statusCode).to.equal(200);
        const article = JSON.parse(response.body);
        const deleteEvt = generateRequestMock(`/article/${article.id}`, {}, 'DELETE', '/article/{articleId}', {pathParameters: {articleId: article.id}});
        await deleter.handle(deleteEvt);

        expect(startCount).to.equal(await s3.count());
    }).timeout(3000); 

    it('can patch an article with new content', async () => {
        const startCount = await s3.count();
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
        expect(preUpdateJson[1].editorState.blocks[0].text).to.equal("Enter Text Here")
        expect(postUpdateJson[1].editorState.blocks[0].text).to.equal("This is some new text");
        expect(preUpdateRecord?.i18nVersions.en.revisionNumber).to.equal(1)
        expect(preUpdateRecord?.i18nVersions.es.revisionNumber).to.equal(1)
        expect(postUpdateRecord?.i18nVersions.en.revisionNumber).to.equal(2)
        expect(postUpdateRecord?.i18nVersions.es.revisionNumber).to.equal(1)
        expect(preUpdateRecord?.i18nVersions.en.checksum).to.not.equal(postUpdateRecord?.i18nVersions.en.checksum);
        expect(preUpdateRecord?.i18nVersions.es.checksum).to.equal(postUpdateRecord?.i18nVersions.es.checksum);
        const deleteEvt = generateRequestMock(`/article/${article.id}`, {}, 'DELETE', '/article/{articleId}', {pathParameters: {articleId: article.id}});
        await deleter.handle(deleteEvt);

        expect(startCount).to.equal(await s3.count())
    }).timeout(8000);
});
const testcaseBody = {
    "serialized": {
      "article": [
        {
          "language": "en",
          "blocks": [
            {
              "editorState": {
                "blocks": [
                  {
                    "key": "c53qs",
                    "text": "Enter text here.",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                  },
                  {
                    "key": "4157m",
                    "text": " ",
                    "type": "atomic",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [
                      {
                        "offset": 0,
                        "length": 1,
                        "key": 0
                      }
                    ],
                    "data": {}
                  },
                  {
                    "key": "d84qf",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                  }
                ],
                "entityMap": {
                  "0": {
                    "type": "IMAGE",
                    "mutability": "IMMUTABLE",
                    "data": {
                      "src": "https://dev-tma-files.s3.amazonaws.com/8238937.jpeg"
                    }
                  }
                }
              },
              "blockType": "Paragraph"
            },
            {
              "blockType": "SplitPanel",
              "editorState": {
                "blocks": [
                  {
                    "key": "b3eta",
                    "text": "Enter Text Here",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                  }
                ],
                "entityMap": {}
              },
              "data": "https://dev-tma-files.s3.amazonaws.com/6911698.png"
            }
          ]
        },
        {
          "language": "es",
          "blocks": [
            {
              "blockType": "Paragraph",
              "editorState": {
                "blocks": [
                  {
                    "key": "ahu56",
                    "text": "Enter text here.",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                  }
                ],
                "entityMap": {}
              }
            }
          ]
        }
      ],
      "articleType": "news"
    },
    "imageUploadUrls": [
      "https://dev-tma-files.s3.amazonaws.com/6911698.png",
      "https://dev-tma-files.s3.amazonaws.com/8238937.jpeg"
    ]
  }

const updateBody = {
    "serialized": {
      "article": [
        {
          "language": "en",
          "blocks": [
            {
              "editorState": {
                "blocks": [
                  {
                    "key": "c53qs",
                    "text": "Enter text here.",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                  },
                  {
                    "key": "4157m",
                    "text": " ",
                    "type": "atomic",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [
                      {
                        "offset": 0,
                        "length": 1,
                        "key": 0
                      }
                    ],
                    "data": {}
                  },
                  {
                    "key": "d84qf",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                  }
                ],
                "entityMap": {
                  "0": {
                    "type": "IMAGE",
                    "mutability": "IMMUTABLE",
                    "data": {
                      "src": "https://dev-tma-files.s3.amazonaws.com/8238937.jpeg"
                    }
                  }
                }
              },
              "blockType": "Paragraph"
            },
            {
              "blockType": "SplitPanel",
              "editorState": {
                "blocks": [
                  {
                    "key": "b3eta",
                    "text": "This is some new text",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                  }
                ],
                "entityMap": {}
              },
              "data": "https://dev-tma-files.s3.amazonaws.com/6911698.png"
            }
          ]
        },
      ],
      "articleType": "news"
    },
    "imageUploadUrls": [
      "https://dev-tma-files.s3.amazonaws.com/6911698.png",
      "https://dev-tma-files.s3.amazonaws.com/8238937.jpeg"
    ]
  }