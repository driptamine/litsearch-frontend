const PostCreator = ({ videoId }) => {
  const [title, setTitle] = useState("");

  const handleCreatePost = async () => {
    try {
      await axios.post("http://localhost:8000/videos/create_post_with_video/", {
        title,
        video_id: videoId,
      });
      alert("Post created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Enter post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />
      <button onClick={handleCreatePost} disabled={!title || !videoId}>
        Create Post
      </button>
    </div>
  );
};
