// import React, { Component } from 'react'
//
// import FineUploaderTraditional from 'fine-uploader-wrappers'
// import PauseResumeButton from 'react-fine-uploader/pause-resume-button'
// import Thumbnail from 'react-fine-uploader/thumbnail'
// import Filename from 'react-fine-uploader/filename'
//
// import Dropzone from 'react-fine-uploader/dropzone'
// // import FineUploaderTraditional from 'fine-uploader-wrappers'
//
// const uploader = new FineUploaderTraditional({
//    options: {
//       request: {
//          endpoint: 'fu/upload'
//       },
//       chunking: {
//         enabled: true,
//         success: {
//           endpoint: "fu/upload?done"
//         }
//       },
//    }
// })
//
//
//
// // const uploader = new FineUploaderTraditional({
// //    options: {
// //       request: {
// //          endpoint: 'my/upload/endpoint'
// //       }
// //    }
// // })
//
// export default class FileListener extends Component {
//   constructor() {
//       super()
//
//       this.state = {
//           submittedFiles: []
//       }
//   }
//
//   componentDidMount() {
//     uploader.on('statusChange', (id, oldStatus, newStatus) => {
//       if (newStatus === 'submitted') {
//         const submittedFiles = this.state.submittedFiles
//
//         submittedFiles.push(id)
//         this.setState({ submittedFiles })
//       }
//     })
//   }
//
//   render() {
//     return (
//         <div>
//           {/*{*/}
//            {/*this.state.submittedFiles.map(id =>*/}
//               {/*<div key={ id }>*/}
//                 <Dropzone
//                   style={ { border: '1px dotted', height: 200, width: 200 } }
//                   uploader={uploader} >
//                   <span>Drop Files Here</span>
//                 </Dropzone>
//                 <Thumbnail
//                   // id={ id }
//                   uploader={ uploader } />
//                 <Filename
//                   // id={ id }
//                   uploader={ uploader } />
//                 {/*<ProgressBar uploader={uploader} />*/}
//                 <PauseResumeButton
//                   // id={ id }
//                   uploader={ uploader } />
//               {/*</div>*/}
//             {/*)*/}
//           {/*}*/}
//         </div>
//     )
//   }
// }
