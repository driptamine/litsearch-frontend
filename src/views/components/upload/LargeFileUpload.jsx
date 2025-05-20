// REFERENCE https://medium.com/swlh/uploadig-large-files-as-chunks-using-reactjs-net-core-2e6e00e13875
// LargeFileUpload-master/

import React, { useEffect, useState } from 'react';
import {
  ProgressBar,
  // Jumbotron,
  Button,
  Form
} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

const chunkSize = 1048576 * 3;//its 3MB, increase the number measure in mb

function LargeFileUpload() {
  const [showProgress, setShowProgress] = useState(false)
  const [counter, setCounter] = useState(1)
  const [fileToBeUpload, setFileToBeUpload] = useState({})
  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0)
  const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize)
  const [progress, setProgress] = useState(0)
  const [fileGuid, setFileGuid] = useState("")
  const [fileNameV1, setFileNameV1] = useState("");
  const [fileSize, setFileSize] = useState(0)
  const [chunkCount, setChunkCount] = useState(0)

  const progressInstance = <ProgressBar animated now={progress} label={`${progress.toFixed(3)}%`} />;

  useEffect(() => {
    if (fileSize > 0) {
      fileUpload(counter);
    }
  }, [fileToBeUpload, progress])

  const getFileContext = (e) => {
    resetChunkProperties();
    const _file = e.target.files[0];
    setFileSize(_file.size)

    const _totalCount = _file.size % chunkSize == 0 ? _file.size / chunkSize : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
    setChunkCount(_totalCount)
    console.log(_totalCount);
    setFileToBeUpload(_file)

    const _fileID = uuidv4() + "." + _file.name.split('.').pop();
    setFileGuid(_fileID)

    const _fileNameV1 = _file.name;
    setFileNameV1(_fileNameV1)
  }


  const fileUpload = () => {
    setCounter(counter + 1);
    if (counter <= chunkCount) {
      const formData = new FormData();
      var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);

      // formData.append("qqfile", chunk);
      // formData.append("qquuid", file);
      // formData.append("qqfilename", file);

      // formData.append("qqpartindex", file);
      // formData.append("qqchunksize", file);
      // formData.append("qqtotalparts", file);
      // formData.append("qqtotalfilesize", file);
      // formData.append("qqpartbyteoffset", file);

      // uploadChunk(formData)
      uploadChunk(chunk)
    }
  }


  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

  const uploadChunk = async (chunk) => {
    try {
      // const response = await axios.post("http://localhost:8000/fu/upload/", chunk, {
      //   params: {
      //     id: counter,
      //     fileName: fileGuid,
      //   },
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-CSRFToken': csrftoken
      //   }
      // });

      // REFERENCE https://axios-http.com/docs/post_example
      const response = await axios.post('http://localhost:8000/fu/upload/', {
          qqfile: chunk,
          qquuid: fileGuid,
          qqfilename: fileGuid,
          // qqpartindex: ,
          // qqchunksize: ,
          // qqtotalparts: ,
          // qqtotalfilesize: ,
          // qqpartbyteoffset:
        }, {
          // params: {
          //   id: counter,
          //   fileName: fileGuid,
          // },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      const data = response.data;
      if (data.isSuccess) {
        setBeginingOfTheChunk(endOfTheChunk);
        setEndOfTheChunk(endOfTheChunk + chunkSize);
        if (counter == chunkCount) {
          console.log('Process is complete, counter', counter)

          await uploadCompleted();
        } else {
          var percentage = (counter / chunkCount) * 100;
          setProgress(percentage);
        }
      } else {
        console.log('Error Occurred:', data.errorMessage)
      }

    } catch (error) {
      debugger
      console.log('error', error)
    }
  }

  const uploadCompleted = async () => {
    var formData = new FormData();
    formData.append('fileName', fileGuid);

    const response = await axios.post("https://localhost:8000/upload/?done", {}, {
      params: {
        fileName: fileGuid,
      },
      data: formData,
    });

    const data = response.data;
    if (data.isSuccess) {
      setProgress(100);
    }
  }

  const resetChunkProperties = () => {
    setShowProgress(true)
    setProgress(0)
    setCounter(1)
    setBeginingOfTheChunk(0)
    setEndOfTheChunk(chunkSize)
  }

  return (
    // <Jumbotron>
    <div>
      <div>
        <div>
          <input type="file" id="exampleFormControlFile1" onChange={getFileContext} label="Example file input" />
        </div>
        <form style={{ display: showProgress ? "block" : "none" }}>
          {progressInstance}
        </form>
      </div>
    </div>
    // </Jumbotron >
  );

  // return (
  //   <div>
  //     <Form>
  //       <Form.Group>
  //         <Form.File id="exampleFormControlFile1" onChange={getFileContext} label="Example file input" />
  //       </Form.Group>
  //       <Form.Group style={{ display: showProgress ? "block" : "none" }}>
  //         {progressInstance}
  //       </Form.Group>
  //     </Form>
  //   </div >
  // )
}


export default LargeFileUpload;
