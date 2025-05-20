import React, { Component } from "react";
import ReactDOM from "react-dom";

import FineUploaderTraditional from "fine-uploader-wrappers";
import Gallery from "react-fine-uploader";

import "react-fine-uploader/gallery/gallery.css";

const uploader = new FineUploaderTraditional({
  options: {
    chunking: {
      enabled: true
    },
    deleteFile: {
      enabled: true,
      endpoint: "/uploads"
    },
    request: {
      endpoint: "/uploads"
    },
    retry: {
      enableAuto: true
    }
  }
});

class UploadComponent extends Component {
  render() {
    return (
      <div>
        <h1>Upload your files</h1>
        <Gallery uploader={uploader} />
      </div>
    );
  }
}

export default UploadComponent;

ReactDOM.render(<UploadComponent />, document.getElementById("root"));
