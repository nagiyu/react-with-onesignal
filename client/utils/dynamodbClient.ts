// DynamoDBクライアント生成ユーティリティ
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function createDynamoDBClient() {
  if (!!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // Lambda環境など、環境変数がない場合は credentials を指定しない
    return new DynamoDBClient({
      region: process.env.AWS_REGION
    });
  }

  return new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}
