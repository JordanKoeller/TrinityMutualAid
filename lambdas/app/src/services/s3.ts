import AWS from 'aws-sdk';

let s3: AWS.S3 | undefined = undefined;

export class S3Bucket {

    private bucket: string;

    constructor(bucket: string) {
        this.bucket = bucket;
        if (s3 === undefined) s3 = new AWS.S3()
    }

    upload(filename: string, data: string | Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = {
                ACL: 'public-read',
                Bucket: this.bucket,
                Key: filename, // File name you want to save as in S3
                Body: data
            };
            s3?.upload(params, undefined, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Location);
                }
            });
        });
    }

    download(filename: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: this.bucket,
                Key: filename,
            }
            s3?.getObject(params, (err, data) => {
                if (err) reject(err);
                else {
                    const dataString = data.Body?.toString();
                    if (dataString) resolve(dataString);
                    else reject("s3.getObject returned an empty Body");
                }
            });
        });
    }

    delete(filenames: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: this.bucket,
                Delete: { Objects: filenames.map(fname => ({ Key: fname })) }
            };
            s3?.deleteObjects(params, (err, data) => {
                if (err) {
                    console.log("ERROR:", err.message);
                    reject("Failed to delete!.");
                } else {
                    resolve();
                }
            })
        });
    }

    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            const params = { Bucket: this.bucket };
            s3?.listObjectsV2(params, (err, data) => {
                if (err) reject("Failed to list objects, so could not count");
                else {
                    if (data.Contents) {
                        resolve(data.Contents.length);
                    } else {
                        reject("Could not access Contents on S3 response");
                    }
                }
            })
        })
    }

}