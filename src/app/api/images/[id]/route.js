import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb.js";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // Mengambil id dari params
    const { title, url } = await req.json(); // Mendapatkan data title dan url dari body

    // Koneksi ke database MongoDB
    const client = await clientPromise;
    const db = client.db("image_db");

    // Update data gambar berdasarkan ID
    const result = await db.collection("images").updateOne(
      { _id: new ObjectId(id) }, // Menggunakan ObjectId untuk pencarian berdasarkan ID
      { $set: { title, url } } // Menetapkan title dan url yang baru
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Image updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { message: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE request untuk menghapus image berdasarkan ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Mengambil id dari params

    // Koneksi ke database MongoDB
    const client = await clientPromise;
    const db = client.db("image_db");

    // Hapus gambar berdasarkan ID
    const result = await db
      .collection("images")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
}