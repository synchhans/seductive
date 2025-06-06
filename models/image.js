export default function ImageModel(data) {
  return {
    title: data.title,
    url: data.url,
    createdAt: new Date(),
  };
}