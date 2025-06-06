import clientPromise from "../lib/mongodb.js";
import ImageModel from "../models/image.js";

export async function getAllImages() {
  const client = await clientPromise;
  const db = client.db("image_db");
  return await db.collection("images").find({}).toArray();
}

export async function addImage(data) {
  const client = await clientPromise;
  const db = client.db("image_db");
  const image = ImageModel(data);
  const result = await db.collection("images").insertOne(image);
  return result;
}
