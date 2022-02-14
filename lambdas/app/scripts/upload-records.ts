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
        records[i].i18nVersions = {"M": JSON.parse(records[i].i18nVersions)};
        records[i].images = JSON.parse(records[i].images);
        records[i].id = {"N": records[i].id};
        records[i].timestamp = {"N": records[i].timestamp};
        records[i].images = {"L": records[i].images};
        records[i].type = {"S": records[i].type};

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

    const OLD_BUCKET = "dev-tma-files";
    const NEW_BUCKET = "prod-tma-files";

    // First grab list of filenames from the old bucket
    s3.listObjects({Bucket: OLD_BUCKET,}, (_err, data) => 
        data.Contents?.forEach(({Key}) => 
            s3.getObject({Bucket: OLD_BUCKET, Key: Key as string}, (_err2, obj) =>
                s3.upload({
                    Bucket: NEW_BUCKET,
                    ACL: 'public-read',
                    Key: Key as string,
                    Body: obj.Body
                }, (err3) => 
                    err3 ? console.log(`Failed to upload ${Key}`) : console.log(`Uploaded ${Key}`)
                )
            )
        )
    );
}

copyOverDynamoDb();

copyOverS3Bucket();
