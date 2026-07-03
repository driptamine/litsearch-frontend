import { useState, useCallback } from 'react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const CHUNK_SIZE = 5 * 1024 * 1024;

function getApiPrefix(mediaType) {
  if (mediaType === 'photo') return 'photos';
  if (mediaType === 'video') return 'videos';
  if (mediaType === 'track') return 'tracks';
  return 'videos';
}

function getStoragePath(mediaType) {
  return 'r2';
}

export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFiles = useCallback(async (files, mediaType, album_id) => {
    setIsUploading(true);
    setProgress(0);
    const results = [];
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    let uploadedBytes = 0;

    for (const file of files) {
      try {
        const fileName = `${file.name}-${Date.now()}`;
        const apiPrefix = getApiPrefix(mediaType);
        const storagePath = getStoragePath(mediaType);

        const initRes = await axios.post(
          `${LITLOOP_API_URL}/${apiPrefix}/${storagePath}/create_presigned_url/`,
          { filename: fileName, content_type: file.type, media_type: mediaType },
          { headers: { "Content-Type": "application/json", ...authHeader() } }
        );
        const { upload_id, key } = initRes.data;
        const totalParts = Math.ceil(file.size / CHUNK_SIZE);
        const parts = [];

        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
          const start = (partNumber - 1) * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const blob = file.slice(start, end);

          const presignRes = await axios.post(
            `${LITLOOP_API_URL}/${apiPrefix}/${storagePath}/get_presigned_url/`,
            { upload_id, key, part_number: partNumber },
            { headers: { "Content-Type": "application/json", ...authHeader() } }
          );

          const uploadRes = await axios.put(presignRes.data.url, blob, {
            headers: { "Content-Type": file.type },
          });

          const etag = (uploadRes.headers.etag || uploadRes.headers.ETag || "").replace(/"/g, "");
          parts.push({ PartNumber: partNumber, ETag: etag });
          uploadedBytes += blob.size;
          setProgress(Math.min(95, Math.round((uploadedBytes / totalBytes) * 100)));
        }

        const completeRes = await axios.post(
          `${LITLOOP_API_URL}/${apiPrefix}/${storagePath}/complete_upload/`,
          { upload_id, key, parts, media_type: mediaType, ...(album_id ? { album_id } : {}) },
          { headers: { "Content-Type": "application/json", ...authHeader() } }
        );

        results.push(completeRes.data);
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
      }
    }

    setProgress(100);
    setIsUploading(false);
    return results;
  }, []);

  return { uploadFiles, isUploading, progress };
}
