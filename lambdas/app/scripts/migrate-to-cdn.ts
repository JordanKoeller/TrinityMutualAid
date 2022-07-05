import AWS from 'aws-sdk';


import { open } from 'fs/promises';

import { parse } from 'csv-parse/sync';

process.env.AWS_REGION = "us-east-1";
AWS.config.update({ region: process.env.AWS_REGION });

const CSV_NAME = "/home/jkoeller/Documents/tma-db-records.csv";

const copyOverDynamoDb = async () => {


    const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

    const file = await open(CSV_NAME, 'r');

    const contents = await file.readFile();

    const records = parse(contents, {
        columns: true,
        skip_empty_lines: true
    });

    for (let i = 0; i < records.length; i++) {
        records[i].images = JSON.parse(records[i].images);
        console.log(records[i].images);
        records[i].images = records[i].images.map((s: string) => s
          .replace("prod-tma-files.s3.amazonaws.com", "cdn.trinitymutualaid.com")
          .replace("dev-tma-files.s3.amazonaws.com", "cdn.trinitymutualaid.com"));

        // console.log(JSON.stringify(records[i]));
        //   await db.addRecord(records[i]);
        const item = {
            TableName: 'tma-articles-prod',
            Item: records[i]
        };
        // console.log(JSON.stringify(item))
        ddb.putItem(item, err => console.log(err));
    }


    //   await db.addRecord(records[0]);
}

const copyOverS3Bucket = async () => {
    const s3 = new AWS.S3();

    const OLD_BUCKET = "prod-tma-files";
    const NEW_BUCKET = "prod-tma-files";

    // First grab list of filenames from the old bucket
    s3.listObjects({Bucket: OLD_BUCKET,}, (_err, data) => 
        data.Contents?.forEach(({Key}) => {
            if (Key?.endsWith(".json")) {
                s3.getObject({Bucket: OLD_BUCKET, Key: Key as string}, (_err2, obj) => {
                    const contents = new Buffer(obj.Body as any).toString("utf8");
                    // const file = obj.Body?.valueOf();
                    // const fileReader = obj.Body.
                    const mapped = contents
                        .replace("prod-tma-files.s3.amazonaws.com", "cdn.trinitymutualaid.com")
                        .replace("dev-tma-files.s3.amazonaws.com", "cdn.trinitymutualaid.com");
                    s3.upload({
                        Bucket: NEW_BUCKET,
                        ACL: 'public-read',
                        Key: Key as string,
                        Body: mapped
                    }, (err3) => 
                        err3 ? console.log(`Failed to upload ${Key}`) : console.log(`Uploaded ${Key}`)
                    )
                }
                )
            }
        }
        )
    );
}

// copyOverDynamoDb();

copyOverS3Bucket();
