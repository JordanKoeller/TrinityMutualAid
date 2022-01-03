import AWS from 'aws-sdk';
import { ScanInput } from 'aws-sdk/clients/dynamodb';



let client: AWS.DynamoDB.DocumentClient | undefined = undefined;

export class DynamoDbClient<V> {
    // This class enforces a convention that all primary keys are under the "id" field.

    protected _tableName: string;

    constructor(tableName: string,) {
        this._tableName = tableName;
        if (client === undefined) client = new AWS.DynamoDB.DocumentClient();
    }

    addRecord(value: V): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const record = {
                Item: value,
                TableName: this._tableName
            };
            client?.put(record, (err) => {
                if (err) {
                    console.warn(
                        `Adding to DynamoDB Failed! Item=${JSON.stringify(record)}`,
                        err,
                        err.stack
                    );
                    reject(err)
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    getRecord(key: number): Promise<V | null> {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: this._tableName,
                KeyConditionExpression: "#id = :id",
                ExpressionAttributeNames: {
                    "#id": "id"
                },
                ExpressionAttributeValues: {
                    ":id": key
                }
            }
            client?.query(params, (err, data) => {
                if (err) {
                    console.warn(
                        `Adding to DynamoDB Failed! Item=${JSON.stringify(params)}`,
                        err,
                        err.stack
                    );
                    reject(err)
                } else {
                    if (data.Items && data.Items.length > 0) {
                        resolve(data.Items[0] as V)
                    } else {
                        resolve(null)
                    }
                }
            });
        });
    }

    getRecords(pageSize: number): Promise<V[]> {
        return new Promise((resolve, reject) => {
            const query: ScanInput = {
                TableName: this._tableName,
            }
            client?.scan(query, (err, data) => {
            // client?.get(query, (err, data) => {
                if (err) {
                    console.warn(
                        `Adding to DynamoDB Failed! Item=${JSON.stringify(query)}`,
                        err,
                        err.stack
                    );
                    reject(err)
                } else {
                    if (data.Items) {
                        resolve(data.Items as V[])
                    } else {
                        resolve([])
                    }
                }
            });
        });
    }
}