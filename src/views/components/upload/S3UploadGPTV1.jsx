// https://chatgpt.com/c/67e1965e-60e8-800c-83b7-c40c5bd2317c
import { useState } from "react";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

const VideoUploader = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    // const fileName = `videos/${Date.now()}-${file.name}`;
    const fileName = `${Date.now()}-${file.name}`;

    // Get upload ID from Django
    const res = await fetch(`http://localhost:8000/videos/create_presigned_url/?file_name=${fileName}&file_type=${file.type}`);
    const { upload_id } = await res.json();

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedParts = [];

    for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // Get presigned URL for the chunk
      const urlRes = await fetch(`http://localhost:8000/videos/get_presigned_url/?upload_id=${upload_id}&file_name=${fileName}&part_number=${partNumber}`);
      // const endpoint = `http://localhost:8000/videos/get_presigned_url/?upload_id=${upload_id}&file_name=${fileName}&part_number=${partNumber}`;
      // const urlRes = await axios({
      //   method: 'GET',
      //   url: endpoint,
      //   data: body,
      //   headers: headers,
      // })
      const { presigned_url } = await urlRes.json();

      // Upload chunk
      const res = await fetch(presigned_url, {
        method: "PUT",
        body: chunk,
        headers: {
          "Content-Type": file.type
        }
      });

      // const etag = res.headers.get("ETag");
      const etag = res.headers.get("ETag")?.replace(/"/g, "");

      uploadedParts.push({ PartNumber: partNumber, ETag: etag }); // Use real ETag from response

      setUploadProgress((partNumber / totalChunks) * 100);
    }

    // Finalize upload
    await fetch(`http://localhost:8000/videos/complete_upload/`, {
      method: "POST",
      body: JSON.stringify({ upload_id, file_name: fileName, parts: uploadedParts }),
      headers: { "Content-Type": "application/json" }
    });

    console.log("Upload complete!");
  };

  return (
    <div>
      {/*<input type="file" onChange={(e) => uploadFile(e.target.files[0])} />*/}
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
      <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
    </div>
  );
};

export default VideoUploader;
