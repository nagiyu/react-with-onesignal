// DynamoDBクライアント生成ユーティリティ
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function createDynamoDBClient() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    // Lambda環境など、環境変数がない場合は credentials を指定しない
    return new DynamoDBClient();
  }
  return new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}
