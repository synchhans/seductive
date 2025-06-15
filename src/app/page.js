"use client";

import { useEffect, useState } from "react";
import useEscapeClose from "./hooks/useEscapeClose";
import { fetchImages, addImage, updateImage, deleteImage } from "./utils/api";
import ImageCard from "./components/ImageCard";
import ImageModalForm from "./components/ImageModalForm";
import ImagePreviewModal from "./components/ImagePreviewModal";

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ title: "", url: "" });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEscapeClose(() => {
    setModalOpen(false);
    setPreviewUrl(null);
  });

  useEffect(() => {
    fetchImages().then(setImages);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateImage(editingId, form);
      setImages((prev) =>
        prev.map((img) => (img._id === editingId ? { ...img, ...form } : img))
      );
    } else {
      const data = await addImage(form);
      setImages([...images, { ...form, _id: data.insertedId }]);
    }

    setForm({ title: "", url: "" });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;
    await deleteImage(id);
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
      <button
        onClick={openAddModal}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        + Tambah Gambar
      </button>

      {modalOpen && (
        <ImageModalForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          isEditing={!!editingId}
        />
      )}

      {previewUrl && (
        <ImagePreviewModal
          url={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {images.map((img) => (
          <ImageCard
            key={img._id}
            img={img}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onPreview={setPreviewUrl}
          />
        ))}
      </div>
    </main>
  );
}
