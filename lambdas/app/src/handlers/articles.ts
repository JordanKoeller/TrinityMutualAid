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
    serialized: {
        article: {
        title: string, // The article's title in the specified language.
        language: string, // What language is this upload in?
        blocks: any[], // JSONified body
        }[],
        articleType: string,
    },
    imageUploadUrls: string[],
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
            if (checksum === record.i18nVersions[version.language].checksum) return; // If the checksums match, I don't need to reupload. Shortcut out.
            const documents = this.getDocumentName(record, version.language);
            if (!documents) throw Error("Failed to get document names for the specified language.");
            await Promise.all(documents.map(docname => this.s3.upload(docname, blockString)));
            record.i18nVersions[version.language].checksum = checksum;
            record.i18nVersions[version.language].revisionNumber += 1;
        });
        await Promise.all(uploadPromises);
        return await this.db.addRecord(record);
    }

    // Pulls out the name of the next file version. To get the current most recent
    // file version, pass a 1 into `offset`. Pass in N to see n-1 revisions ago.
    getDocumentName(record: ArticleDbEntry, language: string, offset = 0): [string, string] | null {
        if (record && language in record.i18nVersions) {
            const versionedName = `${record.id}-${language}-${record.i18nVersions[language].revisionNumber - offset}.json`;
            const latestName = `${record.id}-${language}-latest.json`;
            return [versionedName, latestName];
        }
        console.warn("Tried to get document name for a language that was not in the DbEntry's i18nVersions");
        return null;
    }

    getDocumentVersionFiles(record: ArticleDbEntry): string[] {
        return Object.keys(record.i18nVersions).flatMap(lang => {
            const fnames = [`${record.id}-${lang}-latest.json`];
            for (let i=0; i < record.i18nVersions[lang].revisionNumber; i++) {
                fnames.push(`${record.id}-${lang}-${i}.json`);
            }
            return fnames;
        });
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
        const {serialized: {article, articleType}, imageUploadUrls} = (JSON.parse(event.body) as ArticleUploadBody);
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
            images: imageUploadUrls,
        };
        const uploadSuccess = await this.uploadDocument(article, record);
        if (uploadSuccess) {
            return this.success({message: 'sucess', id});
        }
        return this.err("Failed to upload.")
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
        const {serialized: {article: updates}, imageUploadUrls} = (JSON.parse(event.body) as ArticleUploadBody);
        articleRecord.images = imageUploadUrls; // Update the array of image urls, in case it changed.
        const uploadSuccess = await this.uploadDocument(updates, articleRecord);
        if (uploadSuccess) {
            return this.success({message: "success", id: articleId});
        }
        return this.err("Failed to upload document.");
    }
}

export class DeleteArticleHandler extends ArticleHandler {
    constructor() {
        super({endpoint: '/article/{articleId}', method: 'DELETE'});
    }

    async handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
        if (!event.pathParameters) return this.err("No Article Id in parameters");
        const articleId = parseInt(event.pathParameters!.articleId);
        const articleRecord = await this.db.getRecord(articleId);
        if (articleRecord) {
            const s3Urls = [
                ...(articleRecord?.images?.map(url => url.split('.com/')[1]) || []),
                ...this.getDocumentVersionFiles(articleRecord),
            ];
            await this.s3.delete(s3Urls);
            await this.db.deleteRecord(articleId, ['timestamp', articleRecord.timestamp]);
            return this.success({message: "Delete success!"});
        } else {
            return this.err("Failed to delete. No ArticleRecord was present!")
        }
    }
}

export class GetArticleVersionHandler extends ArticleHandler {
    constructor() {
        super({endpoint: '/article/{articleId}/{language}', method: 'GET'});
    }

    async handle(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
        if (!event.pathParameters) return this.err("No Article Id in parameters");
        const articleId = parseInt(event.pathParameters!.articleId);
        const language = event.pathParameters!.language;
        const articleRecord = await this.db.getRecord(articleId);
        if (!articleRecord) return this.err(`Failed to get article with ID ${articleId}`);
        const fileTuple = this.getDocumentName(articleRecord, language, 1);
        if (fileTuple) {
            return this.success({filename: fileTuple[0]});
        } else {
            return this.err(`Language ${language} not found in article with ID ${articleId}`);
        }
    }
}
