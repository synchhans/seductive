"use client";
import Image from "next/image";

export default function ImagePreviewModal({ url, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg p-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white border rounded-full px-2 py-1 shadow hover:bg-gray-100 transition"
        >
          ✕
        </button>
        <Image
          src={url}
          alt="Preview"
          width={400}
          height={300}
          className="object-contain max-w-[100vh] max-h-[100vh] rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
}
