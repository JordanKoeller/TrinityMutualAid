import { Handler, RequestMethod } from '../common/lambda-app';
import {
    ApiGatewayEvent, ApiGatewayResponse
} from '../common/types';
import { DynamoDbClient } from '../services/db';
import { S3Bucket } from '../services/s3';

import * as crypto from 'crypto';

// DynamoDB entry for an article or other body of text 
// The S3 resource ID is generated with the following schema:
// {id}-{language}-{revisionNumber}.json
interface ArticleDbEntry {
    id: number, // Unique Identifier for this article.
    timestamp: number, // Uploading timestamp. This is the table's sort key
    // Map from a language code to the specific info for that document in that language.
    i18nVersions: Record<string, { author: string, title: string, revisionNumber: number, checksum: string }>,
    type: string, // News article? Blog post? What does this article represent?
    images?: string[], // List of all the image IDs associated with this article.
}

interface ArticleUploadBody {
    article: {
    title: string, // The article's title in the specified language.
    language: string, // What language is this upload in?
    blocks: any[], // JSONified body
    }[],
    articleType: string,
}

interface ArticleVersion {
    title: string;
    language: string;
    blocks: any[];
}

// type ArticleType = string;

abstract class ArticleHandler extends Handler {

    db: DynamoDbClient<ArticleDbEntry>;
    s3: S3Bucket;

    constructor(m: RequestMethod) {
        super(m);
        this.db = new DynamoDbClient<ArticleDbEntry>(process.env.ARTICLES_TABLE as string);
        this.s3 = new S3Bucket(process.env.RESOURCES_BUCKET as string);
    }

    abstract handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse>;

    async uploadDocument(article: ArticleVersion[], record: ArticleDbEntry): Promise<boolean> {
        // The following flatMap compares the new article contents with the old via a
        // checksum comparison. If the checksums differ, it uploads the new document to s3,
        // as well as a copy that is marked as the "latest" version in s3.

        // Once the upload is done, the checksum stored in the record is done, and the revision number is incremented.
        const uploadPromises = article.map(async version => {
            const blockString = JSON.stringify(version.blocks);
            const checksum = crypto.createHash('sha256').update(blockString).digest('hex');
            if (checksum === record.i18nVersions[version.language].checksum) return []; // If the checksums match, I don't need to reupload. Shortcut out.
            const documents = this.getDocumentName(record, version.language);
            if (!documents) throw Error("Failed to get document names for the specified language.");
            await Promise.all(documents.map(docname => this.s3.upload(docname, blockString)));
            record.i18nVersions[version.language].checksum = checksum;
            record.i18nVersions[version.language].revisionNumber += 1;
        });
        await Promise.all(uploadPromises);
        return await this.db.addRecord(record);
    }

    getDocumentName(record: ArticleDbEntry, language: string): [string, string] | null {
        if (record && language in record.i18nVersions) {
            const versionedName = `${record.id}-${language}-${record.i18nVersions[language].revisionNumber}.json`;
            const latestName = `${record.id}-${language}-latest.json`;
            return [versionedName, latestName];
        }
        console.warn("Tried to get document name for a language that was not in the DbEntry's i18nVersions");
        return null;
    }
}


export class PutArticleHandler extends ArticleHandler {
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
        const {article, articleType} = (JSON.parse(event.body) as ArticleUploadBody);
        const id = Math.floor(Math.random() * 100000000);
        const uploadTime = Date.now();
        const record: ArticleDbEntry = {
            id,
            timestamp: uploadTime,
            i18nVersions: Object.fromEntries(article.map(desc => [desc.language, {
                author: event.requestContext.identity.accountId as string,
                revisionNumber: 0,
                title: desc.title,
                checksum: ""
            }])),
            type: articleType,
            images: article.flatMap(body => this._grabImageStrings(body.blocks)),
        };
        const uploadSuccess = await this.uploadDocument(article, record);
        if (uploadSuccess) {
            return this.success({message: 'sucess', id});
        }
        return this.err("Failed to upload.")
    }

    private _grabImageStrings(content: any[]): string[] {
        return content.flatMap(block => Object.values(block.entityMap)
            .filter((ent: any) => ent.type === "IMAGE")
            .map((ent: any) => ent.data.src as string)
        );
    }
}

export class PatchArticleHandler extends ArticleHandler {
    constructor() {
        super({endpoint: '/article/{articleId}', method: 'PATCH'});
    }

    async handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
        if (!event.pathParameters) return this.err("No Article Id in parameters");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const articleId = parseInt(event.pathParameters!.articleId);
        const articleRecord = await this.db.getRecord(articleId);
        if (!articleRecord) return this.err(`Could not find article with id ${articleId}`);
        const {article: updates} = (JSON.parse(event.body) as ArticleUploadBody);
        const uploadSuccess = await this.uploadDocument(updates, articleRecord);
        if (uploadSuccess) {
            return this.success({message: "success", id: articleId});
        }
        return this.err("Failed to upload document.");
    }
}