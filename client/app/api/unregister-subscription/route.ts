import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = body.id;

  if (!id) {
    return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
  }

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const params = {
    TableName: "NextSubscription",
    Key: {
      Id: { S: id },
    },
  };

  try {
    await client.send(new DeleteItemCommand(params));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
