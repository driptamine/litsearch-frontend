// import React, { Component } from 'react'
//
// import FineUploaderTraditional from 'fine-uploader-wrappers'
// import Gallery from 'react-fine-uploader'
//
// // ...or load this specific CSS file using a <link> tag in your document
// import 'react-fine-uploader/gallery/gallery.css'
// function getCookie(name) {
//   var cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//       var cookies = document.cookie.split(';');
//       for (var i = 0; i < cookies.length; i++) {
//           var cookie = cookies[i].trim();
//           if (cookie.substring(0, name.length + 1) === (name + '=')) {
//               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//               break;
//           }
//       }
//   }
//   return cookieValue;
// }
//
// const uploader = new FineUploaderTraditional({
//   options: {
//     chunking: {
//       enabled: true,
//       success: {
//         // endpoint: "fu/upload?done",
//         // endpoint: "http://localhost:8000/fu/upload?done"
//         endpoint: "http://0.0.0.0/fu/upload/?done"
//       }
//     },
//     deleteFile: {
//       enabled: true,
//       // endpoint: 'fu/upload',
//       endpoint: 'http://localhost:8000/fu/upload/'
//       // endpoint: 'http://0.0.0.0/fu/upload/'
//     },
//     request: {
//       // endpoint: 'fu/upload',
//       endpoint: 'http://localhost:8000/fu/upload/',
//       // endpoint: 'http://0.0.0.0/fu/upload/',
//       customHeaders: {
//         // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//         // 'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Headers': '*',
// 				'X-CSRFToken': getCookie('csrftoken'),
// 			},
//       // headers: {  }
//     },
//     cors: {
//       expected: true,
//       // enabled: true,
//     },
//     resume: {
//       enabled: true
//     },
//     retry: {
//       enableAuto: true,
//       showButton: true
//     }
//   }
// })
//
// class GalleryFineUploader extends Component {
//   render() {
//     return (
//       <Gallery uploader={ uploader } />
//     )
//   }
// }
//
// // export default UploadComponent
// export default GalleryFineUploader
