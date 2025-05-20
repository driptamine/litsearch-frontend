// REFERENCE
// veems

export const uploadVideoParts = async (
  videoId,
  presignedUploadUrls,
  file,
  numParts,
  fileSize,
  chunkSize,
  progressCallback,
  markUploadAsFailedCallback
) => {
  let parts = [];
  for (let idx = 0; idx < numParts; idx++) {
    const startByte = chunkSize * idx;
    const stopByte = Math.min(startByte + chunkSize, fileSize);
    const url = presignedUploadUrls[idx];
    const body = file.slice(startByte, stopByte);
    var res;
    var percentageComplete;
    try {
      res = await API_STORAGE.put(url, body);
      percentageComplete = Math.round(100 * idx / (numParts - 1));
      progressCallback(videoId, percentageComplete)
      parts.push({ etag: res.headers.etag, part_number: idx + 1 });
    } catch (err) {
      handleError(err);
      markUploadAsFailedCallback(videoId);
      // TODO: cancel the upload process
      return null;
    }
  }
  return parts;
}

const _uploadVideo = async (videoId, file, uploadPrepareResult) => {
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const fileSize = file.size;
  const numParts = Math.ceil(fileSize / chunkSize)
  const uploadId = uploadPrepareResult.upload_id;
  const presignedUploadUrls = uploadPrepareResult.presigned_upload_urls;
  console.debug('Uploading video parts')
  const parts = await uploadVideoParts(
    videoId,
    presignedUploadUrls,
    file,
    numParts,
    fileSize,
    chunkSize,
    _updateUploadProgressCallback,
    _markUploadAsFailed,
  )
  if (parts === null) {
    // TODO: mark the upload as failed.
  }
  console.debug('Uploading video parts completed')
  await uploadComplete(uploadId, parts);
}

export const startVideoUpload = (channelId, file) => async (dispatch, getState) => {
  console.debug('action, startVideoUpload');
  dispatch(setUserPermissionToLeavePage(false));
  dispatch(_setVideoDetailFileIsSelected(true));
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const filename = file.name;
  const fileSize = file.size;
  const numParts = Math.ceil(fileSize / chunkSize);
  const response = await uploadPrepare(channelId, filename, numParts);
  const data = response.data;
  if (response?.status === 201) {
    dispatch({ type: aTypes.START_VIDEO_UPLOADING, payload: data.video_id });
    dispatch(populateVideoDetail(data.video_id));
    dispatch(provideUploadFeedback(data.video_id, data.upload_id));
    dispatch(_setVideoDetailFileSelectorIsVisible(false));
    await _uploadVideo(data.video_id, file, data);
    if (_haveAllVideoUploadsCompleted(getState().temp.uploadingVideos)) {
      dispatch(setUserPermissionToLeavePage(true));
    }
  } else {
    console.error('UPLOAD FAILED');
    dispatch(setUserPermissionToLeavePage(true));
    dispatch(_setVideoDetailFileIsSelected(false));
  }
};
