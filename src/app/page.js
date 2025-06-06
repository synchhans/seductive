"use client";

import { useState, useEffect } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/images/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setImages(
        images.map((img) => (img._id === editingId ? { ...img, ...form } : img))
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
      <h1 className="text-3xl font-bold mb-6">📸 Galeri Gambar</h1>

      <button
        onClick={openAddModal}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Tambah Gambar
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Gambar" : "Tambah Gambar"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Judul</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">URL Gambar</label>
                <input
                  type="url"
                  className="w-full border px-3 py-2 rounded"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="text-gray-600"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewUrl(null)} // Tutup saat klik di luar gambar
        >
          <div
            className="relative bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik isi
          >
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 text-black bg-white border rounded-full px-2 py-1"
            >
              ✕
            </button>
            <Image
              src={previewUrl}
              alt="Preview"
              width={800}
              height={800}
              className="object-contain max-w-[90vw] max-h-[80vh] rounded-lg cursor-pointer"
              onClick={() => setPreviewUrl(null)} // Tutup juga saat gambar diklik
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {images.map((img) => (
          <div
            key={img._id}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <div
              onClick={() => setPreviewUrl(img.url)}
              className="cursor-pointer"
            >
              <Image
                src={img.url}
                alt={img.title}
                width={400} // Ukuran gambar disesuaikan
                height={300} // Ukuran gambar disesuaikan
                className="object-contain bg-gray-100 rounded w-full h-48 transform transition-all duration-300 hover:scale-110"
              />
            </div>
            <div className="p-4">
              <p className="font-medium truncate">{img.title}</p>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => openEditModal(img)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="text-red-600 hover:underline text-sm"
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
