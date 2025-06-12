import React, { useState } from 'react';
import axios from 'axios';

function PostCreate({ onPostCreated }) {
  const [newPost, setNewPost] = useState({ title: "", image: null });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewPost({ ...newPost, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", newPost.title);
    if (newPost.image) formData.append("image", newPost.image);

    try {
      await axios.post("/api/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewPost({ title: "", image: null });
      onPostCreated(); // notify PostFeed to refresh
    } catch (error) {
      console.error("Post creation failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        type="text"
        name="title"
        placeholder="Enter title"
        value={newPost.title}
        onChange={handleInputChange}
        required
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />
      <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
      <button type="submit" disabled={submitting} style={{ marginLeft: "1rem" }}>
        {submitting ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}

export default PostCreate;
