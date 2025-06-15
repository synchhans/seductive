"use client";
import Image from "next/image";

export default function ImageCard({ img, onEdit, onDelete, onPreview }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform transform hover:scale-[1.03]">
      <div onClick={() => onPreview(img.url)} className="cursor-pointer">
        <Image
          src={img.url}
          alt={img.title}
          width={400}
          height={300}
          className="object-cover w-full h-48 bg-gray-100"
        />
      </div>
      <div className="p-4">
        <p className="font-semibold truncate">{img.title}</p>
        <div className="flex justify-between text-sm mt-3">
          <button
            onClick={() => onEdit(img)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(img._id)}
            className="text-red-600 hover:underline"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
