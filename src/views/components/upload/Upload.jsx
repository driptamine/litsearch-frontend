// https://dev.to/shingaiz/optimizing-file-processing-in-react-with-multipart-uploads-and-downloads-2n8p

import React, { useState, useRef, useEffect } from "react";

function Upload() {
  const [file, setFile] = useState(null); // The file that I uploaded locally
  const [uploadedChunks, setUploadedChunks] = useState([]); // The list of chunks that have been uploaded
  const [uploading, setUploading] = useState(false); // Whether the upload is in progress
  const uploadRequestRef = useRef(null); // A reference to the current upload request

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const uploadChunk = async (chunk) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", chunk);

    // Send the slice to the server
    return await fetch("your-upload-url", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Handle the response result
        return data;
      });
  };

  const upload = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    let start = 0;
    let end = Math.min(chunkSize, file.size);

    setUploading(true);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(start, end);
      const uploadedChunkIndex = uploadedChunks.indexOf(i);

      if (uploadedChunkIndex === -1) {
        try {
          const response = await uploadChunk(chunk);
          setUploadedChunks((prevChunks) => [...prevChunks, i]);

          // Save the list of uploaded chunks to local storage
          localStorage.setItem("uploadedChunks", JSON.stringify(uploadedChunks));
        } catch (error) {
          console.error(error); // Handle the error
        }
      }

      start = end;
      end = Math.min(start + chunkSize, file.size);
    }

    setUploading(false);

    // Upload is complete, clear the list of uploaded chunks from local storage
    localStorage.removeItem("uploadedChunks");
  };

  useEffect(() => {
    const storedUploadedChunks = localStorage.getItem("uploadedChunks");

    if (storedUploadedChunks) {
      setUploadedChunks(JSON.parse(storedUploadedChunks));
    }
  }, []);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={upload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
