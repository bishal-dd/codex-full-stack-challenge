import { DbClient, TableName } from '@/dynamodb.js';
import {
  ConditionalCheckFailedException,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Value } from '@sinclair/typebox/value';
import { CreateBook, GetBook, ListBooks, UpdateBook } from '@verso/command/books/service.js';
import { logger } from '@verso/utils/logger.js';
import { BookRecord, toBookRecord, toBookRecordKey } from './record.js';

export const listBooks: ListBooks = async () => {
  const books = [];

  let lastEvaluatedKey: QueryCommandInput['ExclusiveStartKey'] | undefined = undefined;

  do {
    const update = new QueryCommand({
      TableName: TableName,
      KeyConditionExpression: 'GSI1PK = :recordType AND GSI1SK = :recordType',
      IndexName: 'GSI1',
      ExpressionAttributeValues: marshall({ ':recordType': 'BOOK' }),
    });

    if (lastEvaluatedKey) {
      update.input.ExclusiveStartKey = lastEvaluatedKey;
    }

    logger.info('Querying books from DynamoDB', { input: update.input });
    const { Items: items, LastEvaluatedKey: lek } = await DbClient.send(update);

    for (const item of items ?? []) {
      books.push(Value.Parse(BookRecord, unmarshall(item)).book);
    }

    lastEvaluatedKey = lek;
  } while (lastEvaluatedKey);

  return books;
};

export const updateBook: UpdateBook = async book => {
  const update = new PutItemCommand({
    TableName: TableName,
    Item: marshall(toBookRecord(book)),
    ConditionExpression: 'attribute_exists(PK)',
  });

  try {
    logger.info('Updaing book in DynamoDB', { input: update.input, book });
    await DbClient.send(update);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return undefined;
    } else {
      throw error;
    }
  }

  return book;
};

export const getBook: GetBook = async bookId => {
  const command = new GetItemCommand({
    TableName: TableName,
    Key: marshall(toBookRecordKey(bookId)),
  });

  logger.info('Getting book from DynamoDB', { input: command.input, bookId });
  const { Item: item } = await DbClient.send(command);

  return item ? Value.Parse(BookRecord, unmarshall(item)).book : undefined;
};

export const createBook: CreateBook = async input => {
  const book = {
    bookId: Math.floor(100000 + Math.random() * 900000).toString(),
    ...input,
  };

  const item = marshall(toBookRecord(book));

  const command = new PutItemCommand({
    TableName: TableName,
    Item: item,
    ConditionExpression: 'attribute_not_exists(PK)', // Ensure no overwrite
  });

  logger.info('Creating book in DynamoDB', { input: command.input, book });

  await DbClient.send(command);

  return book;
};
