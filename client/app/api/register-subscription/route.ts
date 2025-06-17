import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // GUID生成
  const id = uuidv4();

  // DynamoDBクライアント初期化
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  // PutItemコマンド作成
  const params = {
    TableName: "NextSubscription",
    Item: {
      Id: { S: id },
      Subscription: { S: JSON.stringify(body) },
    },
  };

  try {
    await client.send(new PutItemCommand(params));
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
