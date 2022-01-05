import { Handler } from '../common/lambda-app';
import {
    ApiGatewayEvent, ApiGatewayResponse
} from '../common/types';
import { DynamoDbClient } from '../services/db';
import { S3Bucket } from '../services/s3';

// DynamoDB entry for an article or other body of text 
// The S3 resource ID is generated with the following schema:
// {id}-{language}-{revisionNumber}.json
interface ArticleDbEntry {
    id: number, // Unique Identifier for this article.
    timestamp: number, // Uploading timestamp. This is the table's sort key
    // Map from a language code to the specific info for that document in that language.
    i18nVersions: Record<string, { author: string, title: string, revisionNumber: number, s3Id: string }>,
    type: string, // News article? Blog post? What does this article represent?
    images?: string[], // List of all the image IDs associated with this article.
}

interface ArticleUploadBody {
    title: string, // The article's title in the specified language.
    language: string, // What language is this upload in?
    content: string, // JSONified body
    articleType: string,
}


export class PutArticleHandler extends Handler {
    constructor() {
        super({ endpoint: '/article', method: 'PUT' });
    }

    async handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
        // Steps:
        // 1. Upload images (other request)
        // 2. Generate new Article record
        // 3. Upload file contents to S3
        // 4. Add Article record to DynamoDB
        // Return Success
        const body = JSON.parse(event.body) as ArticleUploadBody;
        const db = new DynamoDbClient<ArticleDbEntry>(process.env.ARTICLES_TABLE as string);
        const s3 = new S3Bucket(process.env.RESOURCES_BUCKET as string);
        const id = Math.floor(Math.random() * 100000000);
        const uploadTime = Date.now();
        const record: ArticleDbEntry = {
            id,
            timestamp: uploadTime,
            i18nVersions: {
                [body.language]: { 
                    author: event.requestContext.identity.accountId as string,
                    revisionNumber: 1,
                    title: body.title,
                    s3Id: "",
                },
            },
            type: body.articleType,
            images: this._grabImageStrings(body.content),
        };
        console.log("Uploading record", record);
        const s3Id = await s3.upload(getArticleFileName(record, body.language) as string, JSON.stringify(body.content));
        record.i18nVersions[body.language].s3Id = s3Id
        const dbDone = await db.addRecord(record);
        if (dbDone) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "success",
                    id,
                })
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failure"
            }),
        };
    }

    private _grabImageStrings(content: any): string[] {
        return Object.values(content.entityMap)
            .filter((ent: any) => ent.type === "IMAGE")
            .map((ent: any) => ent.data.src as string)
    }
}

export class GetArticleHandler extends Handler {
    constructor() {
        super({ endpoint: '/{language}/article/{articleId}', method: 'GET' });
    }

    async handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
        const {language, articleId} = event.pathParameters as Record<string, string>;
        const db = new DynamoDbClient<ArticleDbEntry>(process.env.ARTICLES_TABLE as string);
        const articleRecord = await db.getRecord(parseInt(articleId));
        if (articleRecord) {
            const s3Id = articleRecord.i18nVersions[language]?.s3Id;
            if (s3Id) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        title: articleRecord.i18nVersions[language]?.title,
                        author: articleRecord.i18nVersions[language]?.author,
                        timestamp: articleRecord.timestamp,
                        url: s3Id
                    })
                }
            }
        }
        return {
            statusCode: 500,
            body: `Failed to get article ${articleId} in language ${language}`
        };
    }
}

// export class GetArticlesHandler extends Handler {
//     constructor() {
//         super({ endpoint: '/articles/summary', method: 'GET' });
//     }

//     async handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
//         const pageNumber = event.multiValueQueryStringParameters?.pageNumber?.[0];
//         const db = new DynamoDbClient<ArticleDbEntry>(process.env.ARTICLES_TABLE as string);
//         const articleRecord = await db.getRecords(articleId);
//         if (articleRecord) {
//             const s3Id = articleRecord.i18nVersions[language]?.s3Id;
//             if (s3Id) {
//                 return {
//                     statusCode: 200,
//                     body: s3Id
//                 }
//             }
//         }
//         return {
//             statusCode: 500,
//             body: `Failed to get article ${articleId} in language ${language}`
//         };
//     }
// }


function getArticleFileName(record: ArticleDbEntry | null, language: string): string | null {
    if (record && language in record.i18nVersions) {
        return `${record.id}-${language}-${record.i18nVersions[language].revisionNumber}.json`;
    }
    return null;
}
