import { NextResponse } from "next/server";
import {
  addImage,
  getAllImages,
} from "../../../../controllers/imageController";

export async function GET() {
  const images = await getAllImages();
  return NextResponse.json(images);
}

export async function POST(req) {
  const body = await req.json();

  if (!body.title || !body.url) {
    return NextResponse.json(
      { error: "Title and URL required" },
      { status: 400 }
    );
  }

  const result = await addImage(body);
  return NextResponse.json(result, { status: 201 });
}