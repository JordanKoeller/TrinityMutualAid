import AWS from 'aws-sdk';


import { open } from 'fs/promises';

import { parse } from 'csv-parse/sync';

process.env.AWS_REGION = "us-east-1";
AWS.config.update({ region: process.env.AWS_REGION });

const CSV_NAME = "/home/jkoeller/Documents/tma-db-records.csv";

const func = async () => {


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

func();
