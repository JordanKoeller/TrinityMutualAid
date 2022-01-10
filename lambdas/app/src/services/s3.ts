import AWS from 'aws-sdk';

let s3: AWS.S3 | undefined = undefined;

export class S3Bucket {

    private bucket: string;

    constructor(bucket: string) {
        this.bucket = bucket;
        if (s3 === undefined) s3 = new AWS.S3()
    }

    upload(filename: string, data: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = {
                ACL: 'public-read',
                Bucket: this.bucket,
                Key: filename, // File name you want to save as in S3
                Body: data
            };
            console.log("Uploading to s3", params.Key)
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

}