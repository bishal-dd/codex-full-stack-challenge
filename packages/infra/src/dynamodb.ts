import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getEnv } from '@verso/utils/env.js';

export const DbClient = new DynamoDBClient({
  region: getEnv('AWS_REGION'),
});

export const TableName = getEnv('TABLE_NAME');
