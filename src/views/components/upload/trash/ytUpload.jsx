// REFERENCE
// youtubeclone-frontend

import React, { useState } from "react";
import path from "path";
import { toast } from "react-toastify";
import { UploadIcon } from "./Icons";
import UploadVideoModal from "./UploadVideoModal";
import { upload } from "../utils";

const UploadVideo = () => {
  const [showModal, setShowModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const closeModal = () => setShowModal(false);

  const uploadyt = async (resourceType, file) => {
    const formData = new FormData();
    formData.append("upload_preset", "youtubeclone");
    formData.append("file", file);

    let toastId = null;
    const config = {
      onUploadProgress: (p) => {
        const progress = p.loaded / p.total;
        if (toastId === null) {
          toastId = toast("Upload in Progress", {
            progress,
          });
        } else {
          toast.update(toastId, {
            progress,
          });
        }
      },
    };

    const { data } = await axios.post(
      `${import.meta.env.REACT_APP_CLOUDINARY_ENDPOINT}/${resourceType}/upload`,
      formData,
      config
    );

    toast.dismiss(toastId);

    return data.secure_url;
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const size = file.size / 1000000;

      if (size > 30) {
        return toast.error("Sorry, file size should be less than 30MB");
      }

      const url = URL.createObjectURL(file);
      setPreviewVideo(url);
      setShowModal(true);

      const data = await upload("video", file);
      const data = await uploadyt("video", file);
      setUrl(data);

      const ext = path.extname(data);
      setThumbnail(data.replace(ext, ".jpg"));
    }
  };

  return (
    <div>
      <label htmlFor="video-upload">
        <UploadIcon />
      </label>
      <input
        style={{ display: "none" }}
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
      />
      {showModal && (
        <UploadVideoModal
          closeModal={closeModal}
          previewVideo={previewVideo}
          thumbnail={thumbnail}
          url={url}
        />
      )}
    </div>
  );
};

export default UploadVideo;
