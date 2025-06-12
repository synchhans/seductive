"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ title: "", url: "" });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  const handleEsc = useCallback((e) => {
    if (e.key === "Escape") {
      setModalOpen(false);
      setPreviewUrl(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/images/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setImages((prev) =>
        prev.map((img) => (img._id === editingId ? { ...img, ...form } : img))
      );
    } else {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setImages([...images, { ...form, _id: data.insertedId }]);
    }

    setForm({ title: "", url: "" });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;
    await fetch(`/api/images/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    setImages(images.filter((img) => img._id !== id));
  };

  const openEditModal = (img) => {
    setForm({ title: img.title, url: img.url });
    setEditingId(img._id);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setForm({ title: "", url: "" });
    setEditingId(null);
    setModalOpen(true);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📸 Galeri Gambar
      </h1>

      <button
        onClick={openAddModal}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        + Tambah Gambar
      </button>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId ? "Edit Gambar" : "Tambah Gambar"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  URL Gambar
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-4 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 bg-white border rounded-full px-2 py-1 shadow hover:bg-gray-100 transition"
            >
              ✕
            </button>
            <Image
              src={previewUrl}
              alt={"Preview"}
              width={400}
              height={300}
              className="object-contain max-w-[100vh] max-h-[100vh] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Galeri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {images.map((img) => (
          <div
            key={img._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform transform hover:scale-[1.03]"
          >
            <div
              onClick={() => setPreviewUrl(img.url)}
              className="cursor-pointer"
            >
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
                  onClick={() => openEditModal(img)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
