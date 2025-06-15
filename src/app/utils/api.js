export async function fetchImages() {
  const res = await fetch("/api/images");
  return res.json();
}

export async function addImage(form) {
  const res = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return res.json();
}

export async function updateImage(id, form) {
  await fetch(`/api/images/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
}

export async function deleteImage(id) {
  await fetch(`/api/images/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
