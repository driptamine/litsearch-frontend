// https://chatgpt.com/c/682f9f8c-75c0-800c-9533-c5386a40e9ec
import React, { useState } from 'react';

export default function CreatePostInlineForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [friendlyId, setFriendlyId] = useState('');
  const [photos, setPhotos] = useState([]); // File objects
  const [previewUrls, setPreviewUrls] = useState([]); // For image previews

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    // Generate previews
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('friendly_id', friendlyId);

    photos.forEach(photoFile => {
      formData.append('photos', photoFile);  // 'photos' is key used in backend
    });

    const res = await fetch('/api/posts/create_with_photos/', {
      method: 'POST',
      body: formData,
      credentials: 'include', // include cookies if using session auth
    });

    const data = await res.json();
    if (data.success) {
      alert('Post created! ID: ' + data.post_id);
      // Optionally reset form here
    } else {
      alert('Error creating post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input
        placeholder="Friendly ID"
        value={friendlyId}
        onChange={e => setFriendlyId(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoChange}
        required
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        {previewUrls.map((url, i) => (
          <img key={i} src={url} alt={`preview ${i}`} width={100} />
        ))}
      </div>

      <button type="submit">Create Post with Photos</button>
    </form>
  );
}
