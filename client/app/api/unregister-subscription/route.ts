import { NextRequest, NextResponse } from "next/server";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { createDynamoDBClient } from "@/utils/dynamodbClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = body.id;

  if (!id) {
    return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
  }

  const client = createDynamoDBClient();

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
