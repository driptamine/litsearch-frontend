// https://chatgpt.com/c/6832c06f-3110-800c-bd4d-a84a93eb9fc6
import React, { useState } from 'react';
import axios from 'axios';

export default function VideoUploader() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const uploadVideo = async () => {
    if (!videoFile) return;
    setIsUploading(true);

    try {
      // Step 1: request to create a presigned URL session
      const createRes = await axios.post('/api/create_presigned_url/', {
        filename: videoFile.name,
        content_type: videoFile.type,
      });

      const { upload_id, s3_key, part_size } = createRes.data;

      // Step 2: split file into parts
      const parts = [];
      const promises = [];

      for (let i = 0; i < videoFile.size; i += part_size) {
        const partNumber = parts.length + 1;
        const blobPart = videoFile.slice(i, i + part_size);

        // Get signed URL for this part
        const { data } = await axios.post('/api/get_presigned_url/', {
          upload_id,
          part_number: partNumber,
          s3_key,
        });

        const url = data.url;

        // Upload part directly to S3
        const uploadPart = axios.put(url, blobPart, {
          headers: { 'Content-Type': videoFile.type },
        });

        promises.push(uploadPart);

        parts.push({
          PartNumber: partNumber,
          ETagPromise: uploadPart.then((res) => res.headers.etag),
        });
      }

      // Step 3: wait for all parts to upload
      await Promise.all(promises);

      const completedParts = await Promise.all(
        parts.map(async (p) => ({
          PartNumber: p.PartNumber,
          ETag: await p.ETagPromise,
        }))
      );

      // Step 4: complete upload and get Video ID
      const completeRes = await axios.post('/api/complete_upload/', {
        upload_id,
        s3_key,
        parts: completedParts,
      });

      setVideoId(completeRes.data.video_id);
      setVideoUrl(completeRes.data.url);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const createPost = async () => {
    if (!title || !videoId) return;

    try {
      const res = await axios.post('/api/create_post_with_video/', {
        title,
        video_id: videoId,
      });

      alert('Post created successfully!');
      console.log(res.data);
      // Optionally reset state
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Upload Video and Create Post</h2>

      <input type="file" accept="video/*" onChange={handleVideoChange} />
      <button onClick={uploadVideo} disabled={!videoFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>

      {videoUrl && (
        <div>
          <h4>Video Uploaded</h4>
          <video src={videoUrl} controls width="400" />
        </div>
      )}

      {videoId && (
        <div>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginTop: '1rem', display: 'block', width: '100%' }}
          />
          <button onClick={createPost} disabled={!title}>
            Create Post
          </button>
        </div>
      )}
    </div>
  );
}
